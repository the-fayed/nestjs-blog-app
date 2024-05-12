import { IsNotEmpty } from 'class-validator';

import { IUser, UserRoles } from '../user.interface';

export class UpdateUserRoleDto implements Partial<IUser> {
  @IsNotEmpty()
  role: UserRoles;
}
