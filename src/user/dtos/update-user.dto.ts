import { Expose, Type } from 'class-transformer';

import { IUpdateUserResponse, IUser } from '../user.interface';
import { UserDto } from './user.dto';

export class UpdateUserDto implements IUpdateUserResponse {
  @Expose()
  status: 'success';

  @Expose()
  message: 'User updated successfully';

  @Expose()
  @Type(() => UserDto)
  data: IUser;
}
