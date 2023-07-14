import { Model, Types } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';
import { Leave, LeaveDocument } from './schema/leave.schema';
import { InjectModel } from '@nestjs/mongoose';
import { LeaveStatusEnum, collectionsName } from '../constant';

@Injectable()
export class LeaveService {
  constructor(
    @InjectModel(collectionsName.leave)
    private readonly leaveModel: Model<Leave>,
  ) { }

  async create(createLeaveDto: CreateLeaveDto): Promise<LeaveDocument> {
    return this.leaveModel.create(createLeaveDto);
  }

  async findAll(admin: Types.ObjectId): Promise<LeaveDocument[]> {
    return this.leaveModel.find({ admin });
  }

  async findOne<T>(query: T): Promise<LeaveDocument> {
    return this.leaveModel.findOne(query);
  }

  async findById(id: Types.ObjectId): Promise<LeaveDocument> {
    return this.leaveModel.findById(id);
  }

  async update(id: Types.ObjectId, updateLeaveTypeDto: UpdateLeaveDto,
  ): Promise<LeaveDocument> {
    const leaveType = await this.leaveModel.findByIdAndUpdate(
      id,
      { $set: updateLeaveTypeDto },
      { new: true },
    );

    if (!leaveType) throw new NotFoundException('Leave not found');

    return leaveType;
  }

  async remove(id: Types.ObjectId): Promise<LeaveDocument> {
    const leave = await this.findById(id);
    if (!leave) {
      throw new NotFoundException('Leave not found');
    }

    if (
      leave.hodStatus === LeaveStatusEnum.PENDING &&
      leave.adminStatus === LeaveStatusEnum.PENDING
    ) {
      throw new BadRequestException(
        'There are leaves in this status pending. Cannot be deleted.',
      );
    }
    return this.leaveModel.findByIdAndDelete(id);
  }
}
