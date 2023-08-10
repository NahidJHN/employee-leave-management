import { PartialType } from '@nestjs/swagger';
import { CreateHodDto } from './create-hod.dto';

export class UpdateHodDto extends PartialType(CreateHodDto) {}
