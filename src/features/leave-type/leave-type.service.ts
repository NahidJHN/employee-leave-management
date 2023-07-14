import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';
import { UpdateLeaveTypeDto } from './dto/update-leave-type.dto';
import { LeaveType } from './schema/leave-type.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LeaveService } from './../leave/leave.service';
import { collectionsName } from '../constant';
import { IAuthUser } from '../common';

@Injectable()
export class LeaveTypeService {
  constructor(
    @InjectModel(collectionsName.leaveType)
    private readonly leaveTypeModel: Model<LeaveType>,
    private readonly leaveService: LeaveService,
  ) { }

  async create(createLeaveTypeDto: CreateLeaveTypeDto): Promise<LeaveType> {
    const hasLeaveType = await this.leaveService.findOne({
      admin: createLeaveTypeDto.admin,
      name: createLeaveTypeDto.name,
    });
    if (hasLeaveType)
      throw new BadGatewayException('Leave type already exists');

    return await this.leaveTypeModel.create(createLeaveTypeDto);
  }

  findAll(admin: Types.ObjectId): Promise<LeaveType[]> {
    return this.leaveTypeModel.find({ admin });
  }


  async findById(id: Types.ObjectId): Promise<LeaveType> {
    return await this.leaveTypeModel.findById(id);
  }

  async update(id: Types.ObjectId, updateLeaveTypeDto: UpdateLeaveTypeDto): Promise<LeaveType> {
    // for unique leave type
    const hasLeaveType = await this.leaveTypeModel.findOne({
      name: updateLeaveTypeDto.name,
      admin: updateLeaveTypeDto.admin,
      _id: { $ne: id },
    });

    if (hasLeaveType)
      throw new BadGatewayException('Leave type already exists');

    const leaveType = await this.leaveTypeModel.findByIdAndUpdate(
      id,
      { $set: updateLeaveTypeDto },
      { new: true },
    );

    if (!leaveType) throw new NotFoundException('Leave type not found');

    return leaveType;
  }

  async remove(id: Types.ObjectId, authUser: IAuthUser): Promise<LeaveType> {
    type leaveQuery = {
      leaveType: Types.ObjectId,
      admin: Types.ObjectId
    }

    const associatedLeave = await this.leaveService.findOne<leaveQuery>({ admin: authUser.admin, leaveType: id });
    if (associatedLeave)
      throw new BadGatewayException(
        'There are leave in this leaves type. Cannot be deleted.',
      );

    const leaveType = await this.leaveTypeModel.findByIdAndDelete(id);

    if (!leaveType) {
      throw new NotFoundException('Leave type not found');
    }

    return leaveType;
  }
}
