import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Types } from 'mongoose';
import { AuthUser, IAuthUser } from '../common';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    const data = await this.employeeService.create(createEmployeeDto);
    return { data, message: 'Employee created successfully' };
  }

  @Get(':admin')
  async findAll(
    @Param('admin') admin: Types.ObjectId,
    @AuthUser() authUser: IAuthUser,
  ) {
    return await this.employeeService.findAll(admin, authUser);
  }

  @Patch(':id')
  async update(
    @Param('id') id: Types.ObjectId,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    const data = await this.employeeService.update(id, updateEmployeeDto);
    return { data, message: 'Employee updated successfully' };
  }

  @Delete(':id')
  async remove(@Param('id') id: Types.ObjectId) {
    const data = await this.employeeService.remove(id);
    return { data, message: 'Employee deleted successfully' };
  }
}
