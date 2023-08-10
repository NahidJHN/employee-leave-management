import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Types } from 'mongoose';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) { }

  @Post()
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    const data = await this.employeeService.create(createEmployeeDto);
    return { data, message: "Employee created successfully" }
  }

  @Get(":admin")
  async findAll(@Param("admin") admin: Types.ObjectId) {
    return await this.employeeService.findAll(admin);
  }


  @Patch(':id')
  update(@Param('id') id: Types.ObjectId, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(+id);
  }
}
