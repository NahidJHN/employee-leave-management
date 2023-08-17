import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { IAuthUser } from '../common';
import { Types } from 'mongoose';
import { appConfig } from '../config';
import { AdminService } from '../admin/admin.service';
import { HodService } from '../hod/hod.service';
import { EmployeeService } from '../employee/employee.service';
import { RolesEnum } from '../constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly adminService: AdminService,
    private readonly hodService: HodService,
    private readonly employeeService: EmployeeService,
  ) {
    const config = appConfig();
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt_secret,
    });
  }

  async validate(payload: IAuthUser) {
    const user = await this.userService.getUserById(payload._id);
    if (!user) throw new UnauthorizedException();

    const authPayload: any = {
      _id: user._id,
      mobile: user.mobile,
      email: user.email,
      role: user.role,
      admin: new Types.ObjectId(payload.admin),
    };

    if (user.role === RolesEnum.EMPLOYEE) {
      const employee = await this.employeeService.findByUserId(user._id);
      if (!employee) throw new NotAcceptableException('Invalid credential');
      authPayload.employee = employee._id;
    }
    if (user.role === RolesEnum.HOD) {
      const hod = await this.hodService.findByUserId(user._id);
      if (!hod) throw new NotAcceptableException('Invalid credential');
      authPayload.hod = hod._id;
    }

    return authPayload;
  }
}
