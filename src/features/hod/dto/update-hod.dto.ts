import { PartialType } from '@nestjs/mapped-types';
import { CreateHodDto } from './create-hod.dto';

export class UpdateHodDto extends PartialType(CreateHodDto) {}
