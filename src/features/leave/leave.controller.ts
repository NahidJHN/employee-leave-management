import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { LeaveService } from './leave.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';
import { Permission } from '../common';
import { Leave } from './schema/leave.schema';
import { RolesEnum } from '../constant';

@Controller('leaves')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post()
  @Permission([RolesEnum.EMPLOYEE, RolesEnum.HOD])
  async create(
    @Body() createLeaveDto: CreateLeaveDto,
  ): Promise<{ data: Leave; message: string }> {
    const data = await this.leaveService.create(createLeaveDto);
    return { data, message: 'Leave created successfully' };
  }

  @Get('/:admin')
  @Permission([RolesEnum.ADMIN, RolesEnum.HOD])
  async findAll(@Param('admin') admin: Types.ObjectId): Promise<Leave[]> {
    return await this.leaveService.findAll(admin);
  }

  @Patch(':id')
  @Permission([RolesEnum.ADMIN, RolesEnum.EMPLOYEE, RolesEnum.HOD])
  async update(
    @Param('id') id: Types.ObjectId,
    @Body() updateLeaveDto: UpdateLeaveDto,
  ): Promise<{ data: Leave; message: string }> {
    const data = await this.leaveService.update(id, updateLeaveDto);
    return { data, message: 'Leave updated successful' };
  }

  @Delete(':id')
  @Permission([RolesEnum.ADMIN, RolesEnum.EMPLOYEE])
  async remove(
    @Param('id') id: Types.ObjectId,
  ): Promise<{ data: Leave; message: string }> {
    const data = await this.leaveService.remove(id);

    return { data, message: 'Leave deleted successful' };
  }
}
