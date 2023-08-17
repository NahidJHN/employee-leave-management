import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HodService } from './hod.service';
import { CreateHodDto } from './dto/create-hod.dto';
import { UpdateHodDto } from './dto/update-hod.dto';
import { Types } from 'mongoose';

@Controller('hods')
export class HodController {
  constructor(private readonly hodService: HodService) {}

  @Post()
  async create(@Body() createHodDto: CreateHodDto) {
    const data = await this.hodService.create(createHodDto);
    return { data, message: 'Hod created successfully' };
  }

  @Get(':admin')
  async findAll(@Param('admin') admin: Types.ObjectId) {
    return await this.hodService.findAll(admin);
  }

  @Patch(':id')
  update(@Param('id') id: Types.ObjectId, @Body() updateHodDto: UpdateHodDto) {
    return this.hodService.update(id, updateHodDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hodService.remove(+id);
  }
}
