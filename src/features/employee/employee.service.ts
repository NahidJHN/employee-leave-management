import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { RolesEnum, collectionsName } from '../constant';
import mongoose, { Connection, Model, Types } from 'mongoose';
import { Employee } from './schema/employee.schema';
import { UserService } from '../user/user.service';

@Injectable()
export class EmployeeService {

  constructor(
    @InjectModel(collectionsName.employee) private readonly employeeModel: Model<Employee>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @InjectConnection() private readonly connection: Connection
  ) { }

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const session = await this.connection.startSession()
    try {
      session.startTransaction()

      //create an employee
      const employee = new this.employeeModel(createEmployeeDto)

      //create a user
      const user = await this.userService.create({
        email: createEmployeeDto.email,
        role: RolesEnum.EMPLOYEE,
        password: "123456",
        mobile: createEmployeeDto.mobile,
        employee: employee._id
      }, session)

      employee.user = user._id

      await employee.save({ session })
      await session.commitTransaction()

      return employee

    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  async findAll(admin: Types.ObjectId): Promise<Employee[]> {
    return this.employeeModel.find({ admin }).populate({
      path: "user",
      select: "email mobile"
    }).exec()
  }

  async findByUserId(userId: Types.ObjectId): Promise<Employee> {
    return this.employeeModel.findOne({ user: userId }).exec()
  }

  async update(id: Types.ObjectId, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    const isMobileUsed = await this.userService.getUser({
      mobile: updateEmployeeDto.mobile,
      employee: { $ne: id }
    })

    if (isMobileUsed) throw new BadRequestException("This mobile number has already used")

    const isEmailUsed = await this.userService.getUser({
      email: updateEmployeeDto.email,
      employee: { $ne: id }
    })
    if (isEmailUsed) throw new BadRequestException("This email has already used")

    const employee = await this.employeeModel.findByIdAndUpdate(id, { $set: updateEmployeeDto }).populate({
      path: "user", select: "email mobile"
    }).exec()

    if (!employee) throw new BadRequestException("Employee not found")

    return employee
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }


}