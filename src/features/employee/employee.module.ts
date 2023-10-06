import { Module, forwardRef } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionsName } from '../constant';
import { EmployeeSchema } from './schema/employee.schema';
import { UserModule } from '../user/user.module';
import { LeaveModule } from '../leave/leave.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: collectionsName.employee, schema: EmployeeSchema },
    ]),
    forwardRef(() => UserModule),
    LeaveModule,
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService],
})
export class EmployeeModule {}
