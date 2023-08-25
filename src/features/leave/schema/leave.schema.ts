import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { LeaveStatusEnum, collectionsName } from 'src/features/constant';

export type LeaveDocument = Document & Leave;

@Schema({ timestamps: true, versionKey: false })
export class Leave extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collectionsName.admin,
    required: true,
  })
  admin: Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collectionsName.employee,
    required: true,
  })
  employee: Types.ObjectId;

  @Prop({
    Type: mongoose.Schema.Types.ObjectId,
    ref: collectionsName.leaveType,
    required: true,
  })
  leaveType: Types.ObjectId;

  @Prop({
    Type: mongoose.Schema.Types.ObjectId,
    ref: collectionsName.department,
    required: true,
  })
  department: Types.ObjectId;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, required: true })
  endDate: Date;

  @Prop({ type: Number, required: true })
  numOfDay: number;

  @Prop({ type: String })
  adminRemark: string;

  @Prop({ type: String })
  hodRemark: string;

  @Prop({ type: String })
  note: string;

  @Prop({
    Type: String,
    enum: LeaveStatusEnum,
    default: LeaveStatusEnum.PENDING,
    required: true,
  })
  hodStatus: string;

  @Prop({
    Type: String,
    enum: LeaveStatusEnum,
    default: LeaveStatusEnum.PENDING,
    required: true,
  })
  adminStatus: string;
}

export const LeaveSchema = SchemaFactory.createForClass(Leave);
