import { Expose, Type } from 'class-transformer';

import { ILoginResponse } from '../auth.interface';
import { UserDto } from '../../user';

export class LoginResponseDto implements ILoginResponse {
  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  @Expose()
  auth_token: string;

  @Expose()
  refresh_token: string;
}
