import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

import { IUser } from '../user.interface';
import { Match } from '../../decorators';

export class UpdateUserPasswordDto implements Partial<IUser> {
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @Match('password')
  passwordConfirmation: string;
}
