import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LeaveTypeService } from './leave-type.service';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';
import { UpdateLeaveTypeDto } from './dto/update-leave-type.dto';
import { AuthUser, IAuthUser, Permission } from '../common';
import { Types } from 'mongoose';
import { LeaveType } from './schema/leave-type.schema';
import { RolesEnum } from '../constant';

@Controller('leave-type')
export class LeaveTypeController {
  constructor(private readonly leaveTypeService: LeaveTypeService) { }

  @Post()
  @Permission([RolesEnum.ADMIN])
  async create(
    @Body() createLeaveTypeDto: CreateLeaveTypeDto,
    @AuthUser() authUser: IAuthUser,
  ): Promise<{ data: LeaveType; message: string }> {
    const data = await this.leaveTypeService.create(createLeaveTypeDto);
    return { data, message: 'Leave type created successful' };
  }

  @Get('/:admin')
  @Permission([RolesEnum.ADMIN, RolesEnum.EMPLOYEE, RolesEnum.HOD])
  async findAll(@Param("admin") admin: Types.ObjectId): Promise<LeaveType[]> {
    return await this.leaveTypeService.findAll(admin)
  }

  @Patch(':id')
  @Permission([RolesEnum.ADMIN])
  async update(
    @Param('id') id: Types.ObjectId,
    @Body() updateLeaveTypeDto: UpdateLeaveTypeDto,
  ): Promise<{ data: LeaveType; message: string }> {
    const data = await this.leaveTypeService.update(id, updateLeaveTypeDto);

    return { data, message: 'Leave type updated successful' };
  }

  @Delete(':id')
  @Permission([RolesEnum.EMPLOYEE])
  async remove(
    @Param('id') id: Types.ObjectId,
    @AuthUser() authUser: IAuthUser
  ): Promise<{ data: LeaveType; message: string }> {
    const data = await this.leaveTypeService.remove(id, authUser);

    return { data, message: 'Leave type deleted successful' };
  }
}
