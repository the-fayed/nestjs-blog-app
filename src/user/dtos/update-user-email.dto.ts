import { IsEmail, IsNotEmpty } from 'class-validator';

import { IUser } from '../user.interface';

export class UpdateUserEmailDto implements Partial<IUser> {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
