import { Module } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { LeaveController } from './leave.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionsName } from '../constant';
import { LeaveSchema } from './schema/leave.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: collectionsName.leave, schema: LeaveSchema }])],
  controllers: [LeaveController],
  providers: [LeaveService],
  exports: [LeaveService]
})
export class LeaveModule { }
