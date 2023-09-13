import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { LeaveModule } from '../leave/leave.module';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionsName } from '../constant';
import { LeaveSchema } from '../leave/schema/leave.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: collectionsName.leave, schema: LeaveSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
