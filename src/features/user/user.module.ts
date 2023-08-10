import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionsName } from '../constant';
import { UserSchema } from './schema/user.schema';
import { AdminModule } from '../admin/admin.module';
import { HodModule } from '../hod/hod.module';
import { EmployeeModule } from '../employee/employee.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: collectionsName.user, schema: UserSchema }]), forwardRef(() => AdminModule), forwardRef(() => HodModule), forwardRef(() => EmployeeModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule { }
