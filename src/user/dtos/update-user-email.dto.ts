import { IsEmail, IsNotEmpty } from 'class-validator';

import { IUser } from '../user.interface';

export type IUpdateUserEmailDto = Pick<IUser, 'email'>;

export class UpdateUserEmailDto implements IUpdateUserEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
