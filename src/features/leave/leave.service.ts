import { ClientSession, Model, Types } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';
import { Leave, LeaveDocument } from './schema/leave.schema';
import { LeaveStatusEnum, RolesEnum, collectionsName } from '../constant';
import { IAuthUser } from '../common';

@Injectable()
export class LeaveService {
  constructor(
    @InjectModel(collectionsName.leave)
    private readonly leaveModel: Model<Leave>,
  ) {}

  async create(createLeaveDto: CreateLeaveDto): Promise<LeaveDocument> {
    return this.leaveModel.create(createLeaveDto);
  }

  async findAll(
    admin: Types.ObjectId,
    authUser: IAuthUser,
    sort: string,
  ): Promise<LeaveDocument[]> {
    const query = { admin };
    if (authUser.role === RolesEnum.EMPLOYEE) {
      query['employee'] = authUser.employee;
    }
    if (
      authUser.role === RolesEnum.HOD ||
      authUser.role === RolesEnum.EMPLOYEE
    ) {
      query['department'] = authUser.department;
    }

    if (authUser.role === RolesEnum.ADMIN)
      query['hodStatus'] = LeaveStatusEnum.APPROVE;

    const leaves = await this.leaveModel
      .find(query)
      .sort({ createdAt: sort === 'asc' ? 1 : -1 });
    return leaves;
  }

  async findOne<T>(query: T): Promise<LeaveDocument> {
    return this.leaveModel.findOne(query);
  }

  async findById(id: Types.ObjectId): Promise<LeaveDocument> {
    return this.leaveModel.findById(id);
  }

  async update(
    id: Types.ObjectId,
    updateLeaveDto: UpdateLeaveDto,
  ): Promise<LeaveDocument> {
    const leave = await this.leaveModel.findByIdAndUpdate(
      id,
      { $set: updateLeaveDto },
      { new: true },
    );
    if (!leave) throw new NotFoundException('Leave not found');
    return leave;
  }

  async remove(id: Types.ObjectId): Promise<LeaveDocument> {
    const leave = await this.findById(id);
    if (!leave) {
      throw new NotFoundException('Leave not found');
    }

    if (
      leave.hodStatus !== LeaveStatusEnum.PENDING &&
      leave.adminStatus !== LeaveStatusEnum.PENDING
    ) {
      throw new BadRequestException('Only pending leave will be deletable');
    }
    return this.leaveModel.findByIdAndDelete(id) as any;
  }

  private async removeByUser(
    employee: Types.ObjectId,
    hod: Types.ObjectId,
    session: ClientSession,
  ): Promise<LeaveDocument[]> {
    const query = { ...(employee && { employee }), ...(hod && { hod }) };
    const leaves = this.leaveModel.find(query, { session });
    return leaves.deleteMany().session(session).exec();
  }

  async deleteLeavesEmployeeId(
    employee: Types.ObjectId,
    session: ClientSession,
  ): Promise<LeaveDocument[]> {
    return this.removeByUser(employee, null, session);
  }

  async deleteLeavesByHodId(
    hod: Types.ObjectId,
    session: ClientSession,
  ): Promise<LeaveDocument[]> {
    return this.removeByUser(null, hod, session);
  }
}
