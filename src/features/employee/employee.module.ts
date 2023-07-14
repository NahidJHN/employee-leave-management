import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionsName } from '../constant';
import { EmployeeSchema } from './schema/employee.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: collectionsName.employee, schema: EmployeeSchema }])],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule { }
