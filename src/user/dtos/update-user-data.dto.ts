import { IsOptional, IsString, Length } from 'class-validator';

import { IUser } from '../user.interface';

export type IUpdateUserDataDto = Pick<IUser, 'name' | 'username'>;

export class UpdateUserDataDto implements IUpdateUserDataDto {
  @IsString()
  @IsOptional()
  @Length(3, 32, { message: 'Name must be between 3 and 32 characters!' })
  name: string;

  @IsString()
  @IsOptional()
  @Length(3, 64, { message: 'Username must be between 3 and 32 characters!' })
  username: string;
}
