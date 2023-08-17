import { IsMongoId, IsString, IsEnum, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateDepartmentDto {
  @IsMongoId({ message: 'Admin id is invalid' })
  admin: Types.ObjectId;

  @IsString({ message: 'Department name is required' })
  name: string;

  @IsString({ message: 'Alias name is required' })
  alias: string;

  @IsOptional()
  @IsString()
  description: string;
}
