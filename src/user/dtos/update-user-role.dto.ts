import { IsNotEmpty } from 'class-validator';

import { IUser, UserRoles } from '../user.interface';

export type IUpdateUserRole = Pick<IUser, 'role'>;

export class UpdateUserRoleDto implements IUpdateUserRole {
  @IsNotEmpty()
  role: UserRoles;
}
