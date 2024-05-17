import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

import { IUser } from '../user.interface';
import { Match } from '../../decorators';

export type IUpdateUserPasswordDto = Pick<IUser, 'password'>;

export class UpdateUserPasswordDto implements IUpdateUserPasswordDto {
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @Match('password')
  passwordConfirmation: string;
}
