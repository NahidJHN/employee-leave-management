import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { CreateHodDto } from './dto/create-hod.dto';
import { UpdateHodDto } from './dto/update-hod.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { RolesEnum, collectionsName } from '../constant';
import { Connection, Model, Types } from 'mongoose';
import { Hod, HodDocument } from './schema/hod.schema';
import { UserService } from '../user/user.service';
import { LeaveService } from '../leave/leave.service';
import { LeaveDocument } from '../leave/schema/leave.schema';

@Injectable()
export class HodService {
  constructor(
    @InjectModel(collectionsName.hod) private readonly hodModel: Model<Hod>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @InjectConnection() private readonly connection: Connection,
    private readonly leaveService: LeaveService,
  ) {}

  async create(createHodDto: CreateHodDto): Promise<Hod> {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();

      //create an hod
      const hod = new this.hodModel(createHodDto);

      //create a user
      const user = await this.userService.create(
        {
          email: createHodDto.email,
          role: RolesEnum.HOD,
          password: '123456',
          mobile: createHodDto.mobile,
          hod: hod._id,
        },
        session,
      );

      hod.user = user._id;

      await hod.save({ session });
      await session.commitTransaction();

      return hod;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async findAll(admin: Types.ObjectId): Promise<Hod[]> {
    return this.hodModel
      .find({ admin })
      .populate({
        path: 'user',
        select: 'email mobile',
      })
      .exec();
  }

  async findById(id: Types.ObjectId): Promise<HodDocument> {
    return this.hodModel.findById(id);
  }

  async findByDepartment(departmentId: Types.ObjectId): Promise<HodDocument> {
    return this.hodModel.findOne({ department: departmentId }).exec();
  }

  async findByUserId(userId: Types.ObjectId): Promise<HodDocument> {
    return this.hodModel.findOne({ user: userId });
  }

  async update(id: Types.ObjectId, updateHodDto: UpdateHodDto): Promise<Hod> {
    const isMobileUsed = await this.userService.getUser({
      mobile: updateHodDto.mobile,
      hod: { $ne: id },
    });

    if (isMobileUsed)
      throw new BadRequestException('This mobile number has already used');

    const isEmailUsed = await this.userService.getUser({
      email: updateHodDto.email,
      hod: { $ne: id },
    });
    if (isEmailUsed)
      throw new BadRequestException('This email has already used');

    const hod = await this.hodModel
      .findByIdAndUpdate(id, { $set: updateHodDto }, { new: true })
      .populate({
        path: 'user',
        select: 'email mobile',
      })
      .exec();

    if (!hod) throw new BadRequestException('Hod not found');

    return hod;
  }

  async remove(
    id: Types.ObjectId,
  ): Promise<{ hod: HodDocument; leaves: LeaveDocument[] }> {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      const hod = await this.hodModel.findByIdAndDelete(id, { session }).exec();
      if (!hod) throw new BadRequestException('Hod not found');

      //delete the user data
      await this.userService.deleteUser(hod.user, session);

      //delete all leaves
      const leaves = await this.leaveService.deleteLeavesByHodId(
        hod._id,
        session,
      );
      await session.commitTransaction();

      return { hod, leaves };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
