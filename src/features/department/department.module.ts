import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionsName } from '../constant';
import { DepartmentSchema } from './schema/department.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: collectionsName.department, schema: DepartmentSchema }])],
  controllers: [DepartmentController],
  providers: [DepartmentService]
})
export class DepartmentModule { }
