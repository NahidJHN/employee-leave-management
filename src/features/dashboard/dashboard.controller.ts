import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Sse,
  MessageEvent,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { Observable, interval, map } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { collectionsName } from '../constant';
import { LeaveService } from '../leave/leave.service';
import { Model, Types } from 'mongoose';
import { Leave } from '../leave/schema/leave.schema';
import { Public } from '../common';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    @InjectModel(collectionsName.leave)
    private readonly leaveModel: Model<Leave>,
  ) {}

  @Post()
  create(@Body() createDashboardDto: CreateDashboardDto) {
    return this.dashboardService.create(createDashboardDto);
  }

  @Public()
  @Sse(':admin')
  getDashboardStatus(): Observable<MessageEvent> {
    return new Observable((observer) => {
      const changeStream = this.leaveModel.watch();

      changeStream.on('change', async (change) => {
        const leaves = await this.leaveModel.find();
        // Emit the updated data as a string
        observer.next({ data: leaves });
      });
      // Clean up the change stream when the SSE connection is closed
      // return () => {
      //   changeStream.close();
      // };
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dashboardService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDashboardDto: UpdateDashboardDto,
  ) {
    return this.dashboardService.update(+id, updateDashboardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dashboardService.remove(+id);
  }
}
