import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { IUser, UserRoles } from '../user.interface';

export type IUpdateUserRole = Pick<IUser, 'role'>;

export class UpdateUserRoleDto implements IUpdateUserRole {
  @IsNotEmpty()
  @ApiProperty({ type: UserRoles, enum: UserRoles, required: true })
  role: UserRoles;
}
