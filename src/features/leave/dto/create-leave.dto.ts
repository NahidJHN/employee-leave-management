import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsMongoId,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';
import { Types } from 'mongoose';
import { LeaveStatusEnum } from 'src/features/constant';

export class CreateLeaveDto {
  @IsNotEmpty()
  @IsMongoId()
  admin: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  user: Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  employee: Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  hod: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  leaveType: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  department: Types.ObjectId;

  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @IsNotEmpty()
  @IsDateString()
  endDate: Date;

  @IsNotEmpty()
  @IsNumber()
  numOfDay: number;

  @IsOptional()
  @IsString()
  adminRemark: string;

  @IsOptional()
  @IsString()
  hodRemark: string;

  @IsOptional()
  @IsString()
  note: string;

  @IsOptional()
  @IsEnum(LeaveStatusEnum)
  hodStatus: LeaveStatusEnum;

  @IsOptional()
  @IsEnum(LeaveStatusEnum)
  adminStatus: LeaveStatusEnum;
}
