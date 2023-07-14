import {
    IsEnum,
    IsMongoId,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';
import { Types } from 'mongoose';
import { ActiveInaStatus } from 'src/features/constant';

export class CreateLeaveTypeDto {
    @IsMongoId({ message: 'Admin id is invalid' })
    admin: Types.ObjectId;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    note: string;

    @IsEnum(ActiveInaStatus)
    @IsOptional()
    status: ActiveInaStatus
}
