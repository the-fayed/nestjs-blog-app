import { Expose } from 'class-transformer';

import { UserRoles } from '../user.interface';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  role: UserRoles;

  @Expose()
  emailVerified: boolean;
}
