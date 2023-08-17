import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from 'src/features/constant';

export const PERMISSION_KEY = 'permission';
export const Permission = (permissions: RolesEnum[]) =>
  SetMetadata(PERMISSION_KEY, permissions);
