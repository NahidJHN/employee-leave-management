import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { RolesEnum, collectionsName } from '../constant';
import { Connection, Model, Types } from 'mongoose';
import { Employee } from './schema/employee.schema';
import { UserService } from '../user/user.service';
import { IAuthUser } from '../common';
import { LeaveService } from '../leave/leave.service';
import { Leave, LeaveDocument } from '../leave/schema/leave.schema';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(collectionsName.employee)
    private readonly employeeModel: Model<Employee>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @InjectConnection() private readonly connection: Connection,
    private readonly leaveService: LeaveService,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();

      //create an employee
      const employee = new this.employeeModel(createEmployeeDto);

      //create a user
      const user = await this.userService.create(
        {
          email: createEmployeeDto.email,
          role: RolesEnum.EMPLOYEE,
          password: '123456',
          mobile: createEmployeeDto.mobile,
          employee: employee._id,
        },
        session,
      );

      employee.user = user._id;

      await employee.save({ session });
      await session.commitTransaction();

      return employee;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async findAll(
    admin: Types.ObjectId,
    authUser: IAuthUser,
  ): Promise<Employee[]> {
    const query = { admin };

    //If the logged in user is an employee then return the current employee only
    if (authUser.role === RolesEnum.EMPLOYEE) query['user'] = authUser._id;
    //if the logged in user is HOD the return the employee of its own department
    if (authUser.role === RolesEnum.HOD)
      query['department'] = authUser.department;

    return this.employeeModel
      .find(query)
      .populate({
        path: 'user',
        select: 'email mobile',
      })
      .exec();
  }

  async findByUserId(userId: Types.ObjectId): Promise<Employee> {
    return this.employeeModel.findOne({ user: userId }).exec();
  }

  async findByDepartment(departmentId: Types.ObjectId): Promise<Employee> {
    return this.employeeModel.findOne({ department: departmentId }).exec();
  }

  async update(
    id: Types.ObjectId,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    const isMobileUsed = await this.userService.getUser({
      mobile: updateEmployeeDto.mobile,
      employee: { $ne: id },
    });

    if (isMobileUsed)
      throw new BadRequestException('This mobile number has already used');

    const isEmailUsed = await this.userService.getUser({
      email: updateEmployeeDto.email,
      employee: { $ne: id },
    });
    if (isEmailUsed)
      throw new BadRequestException('This email has already used');

    const employee = await this.employeeModel
      .findByIdAndUpdate(id, { $set: updateEmployeeDto }, { new: true })
      .populate({
        path: 'user',
        select: 'email mobile',
      })
      .exec();

    if (!employee) throw new BadRequestException('Employee not found');

    return employee;
  }

  async remove(
    id: Types.ObjectId,
  ): Promise<{ employee: Employee; leaves: LeaveDocument[] }> {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      //delete the employee first
      const employee = await this.employeeModel
        .findByIdAndDelete(id, { session })
        .exec();
      if (!employee) throw new BadRequestException('Employee not found');
      //delete the user
      await this.userService.deleteUser(employee.user, session);

      //delete the user's leaves

      const leaves = await this.leaveService.deleteLeavesEmployeeId(
        id,
        session,
      );
      await session.commitTransaction();
      return { employee, leaves };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
