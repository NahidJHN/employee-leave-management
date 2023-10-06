import { Module, forwardRef } from '@nestjs/common';
import { HodService } from './hod.service';
import { HodController } from './hod.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionsName } from '../constant';
import { HodSchema } from './schema/hod.schema';
import { UserModule } from '../user/user.module';
import { LeaveModule } from '../leave/leave.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: collectionsName.hod, schema: HodSchema },
    ]),
    forwardRef(() => UserModule),
    LeaveModule,
  ],
  controllers: [HodController],
  providers: [HodService],
  exports: [HodService],
})
export class HodModule {}
