import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { RolesEnum, collectionsName } from '../constant';
import { ClientSession, Model, Types } from 'mongoose';
import { User } from './schema/user.schema';
import { AdminService } from '../admin/admin.service';
import { HodService } from '../hod/hod.service';
import { EmployeeService } from '../employee/employee.service';

export interface IProfile {
  _id: Types.ObjectId;
  admin?: Types.ObjectId;
  firstName?: string;
  lastName?: string;
  address?: string;
  role: RolesEnum;
  availableLeaves?: number;
  department?: Types.ObjectId;
}

@Injectable()
export class UserService {
  constructor(
    @InjectModel(collectionsName.user) private readonly userModel: Model<User>,
    @Inject(forwardRef(() => AdminService))
    private readonly adminService: AdminService,
    @Inject(forwardRef(() => HodService))
    private readonly hodService: HodService,

    @Inject(forwardRef(() => EmployeeService))
    private readonly employeeService: EmployeeService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    session: ClientSession,
  ): Promise<User> {
    const isEmailUsed = await this.getUserByEmail(createUserDto.email);
    if (isEmailUsed)
      throw new BadRequestException('This email is already used');

    const isMobileUsed = await this.getUserByMobile(createUserDto.mobile);
    if (isMobileUsed)
      throw new BadRequestException('This mobile is already used');

    const user = new this.userModel(createUserDto);
    return user.save({ session });
  }

  async getUserById(userId: Types.ObjectId): Promise<User> {
    return this.userModel.findById(userId);
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }

  async getUserByMobile(mobile: string): Promise<User> {
    return this.userModel.findOne({ mobile });
  }

  async getUser(query: any): Promise<User> {
    return this.userModel.findOne(query);
  }

  async createAdmin(createUserDto: CreateUserDto): Promise<User> {
    const admin = new this.userModel({
      ...createUserDto,
      role: RolesEnum.ADMIN,
    });
    return admin.save();
  }

  async getProfile(userId: Types.ObjectId): Promise<IProfile> {
    const user = await this.getUserById(userId);
    if (!user) throw new BadRequestException('User not found');
    const profile: IProfile = { _id: user._id, role: user.role };

    if (user.role === RolesEnum.ADMIN) {
      const admin = await this.adminService.findByUserId(user._id);
      profile.admin = admin._id;
      profile.firstName = admin.firstName;
      profile.lastName = admin.lastName;
      profile.address = admin.address;
    }
    if (user.role === RolesEnum.HOD) {
      const hod = await this.hodService.findByUserId(user._id);
      profile.admin = hod.admin;
      profile.firstName = hod.firstName;
      profile.lastName = hod.lastName;
      profile.address = hod.address;
      profile.availableLeaves = hod.availableLeaves;
      profile.department = hod.department;
    }
    if (user.role === RolesEnum.EMPLOYEE) {
      const employee = await this.employeeService.findByUserId(user._id);
      profile.admin = employee.admin;
      profile.firstName = employee.firstName;
      profile.lastName = employee.lastName;
      profile.address = employee.address;
      profile.availableLeaves = employee.availableLeaves;
      profile.department = employee.department;
    }
    return profile;
  }
}
