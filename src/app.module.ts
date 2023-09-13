import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import * as Joi from '@hapi/joi';
import { appConfig } from './features/config/app.config';
import { UserModule } from './features/user/user.module';
import { EmployeeModule } from './features/employee/employee.module';
import { CommonModule } from './features/common/config.module';
import { AuthModule } from './features/auth/auth.module';
import { DepartmentModule } from './features/department/department.module';
import { LeaveTypeModule } from './features/leave-type/leave-type.module';
import { LeaveModule } from './features/leave/leave.module';
import { AdminModule } from './features/admin/admin.module';
import { HodModule } from './features/hod/hod.module';
import { DashboardModule } from './features/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema: Joi.object({
        MONGODB_URL: Joi.required(),
        JWT_SECRET: Joi.string().required(),
        SERVER_PORT: Joi.number().required(),
        JWT_ACCESS_EXPIRATION_MINUTES: Joi.string().required(),
        JWT_REFRESH_EXPIRATION_DAYS: Joi.number().required(),
        MASTER_PASSWORD: Joi.string().required(),
      }),
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      fallbacks: {
        'en-*': 'en',
        'bn-*': 'bn',
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    CommonModule,
    UserModule,
    EmployeeModule,
    AuthModule,
    DepartmentModule,
    LeaveTypeModule,
    LeaveModule,
    AdminModule,
    HodModule,
    DashboardModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
