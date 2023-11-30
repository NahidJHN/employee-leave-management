import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { DepartmentService } from './department.service';
import { Permission } from '../common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { RolesEnum } from '../constant';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @Permission([RolesEnum.ADMIN])
  async create(@Body() createDepartmentDto: CreateDepartmentDto) {
    const data = await this.departmentService.create(createDepartmentDto);
    return { data, message: 'Department created successfully' };
  }

  @Get('/:admin')
  @Permission([RolesEnum.ADMIN, RolesEnum.HOD])
  async findAll(@Param('admin') admin: Types.ObjectId) {
    const data = await this.departmentService.findAll(admin);
    console.log('data', admin);
    return data;
  }

  @Patch(':id')
  @Permission([RolesEnum.ADMIN])
  async update(
    @Param('id') id: Types.ObjectId,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    const data = await this.departmentService.update(id, updateDepartmentDto);

    return { data, message: 'Department updated successful' };
  }

  @Delete(':id')
  @Permission([RolesEnum.ADMIN])
  async remove(@Param('id') id: Types.ObjectId) {
    const department = await this.departmentService.remove(id);
    return { data: department, message: 'Department deleted successfully' };
  }
}
