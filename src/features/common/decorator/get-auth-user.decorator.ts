import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IAuthUser } from '../interfaces/auth-user.interface';

export const AuthUser = createParamDecorator(
  (_data, ctx: ExecutionContext): IAuthUser => {
    const req = ctx.switchToHttp().getRequest();
    return {
      _id: req.user._id,
      admin: req.user.admin,
      ...(req.user.employee && {
        employee: req.user.employee,
        department: req.user.department,
      }),
      ...(req.user.hod && {
        hod: req.user.hod,
        department: req.user.department,
      }),
      role: req.user.role,
    };
  },
);
