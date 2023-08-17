import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { appConfig } from '../config';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt.strategy';
import { EmployeeModule } from '../employee/employee.module';
import { HodModule } from '../hod/hod.module';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory() {
        const config = appConfig();
        return {
          secret: config.jwt_secret,
          signOptions: {
            expiresIn: config.access_token_expiration_minute,
          },
        };
      },
    }),
    UserModule,
    EmployeeModule,
    HodModule,
    AdminModule,
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService],
})
export class AuthModule {}
