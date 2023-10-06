import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionsName } from '../constant';
import { DepartmentSchema } from './schema/department.schema';
import { EmployeeModule } from '../employee/employee.module';
import { HodModule } from '../hod/hod.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: collectionsName.department, schema: DepartmentSchema },
    ]),
    EmployeeModule,
    HodModule,
  ],
  controllers: [DepartmentController],
  providers: [DepartmentService],
})
export class DepartmentModule {}
