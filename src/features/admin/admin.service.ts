import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { collectionsName } from '../constant';
import { Model, Types } from 'mongoose';
import { Admin } from './schema/admin.schema';
import { UserService } from '../user/user.service';
import { User } from '../user/schema/user.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(collectionsName.admin)
    private readonly adminModel: Model<Admin>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: Model<User>,
  ) {}

  create(createAdminDto: CreateAdminDto) {
    return 'This action adds a new admin';
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  async findByUserId(userId: Types.ObjectId) {
    return this.adminModel.findOneAndUpdate({
      user: userId,
    });
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
