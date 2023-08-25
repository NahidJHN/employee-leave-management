import { Types } from 'mongoose';
import { RolesEnum } from 'src/features/constant';

export interface IAuthUser {
  _id: Types.ObjectId;
  admin: Types.ObjectId;
  employee?: Types.ObjectId;
  hod?: Types.ObjectId;
  department?: Types.ObjectId;
  role: RolesEnum;
}
