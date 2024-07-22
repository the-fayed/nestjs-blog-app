import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { IUser } from '../user.interface';

export type IUpdateUserEmailDto = Pick<IUser, 'email'>;

export class UpdateUserEmailDto implements IUpdateUserEmailDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    description: 'User email',
    example: 'user@email.com',
  })
  email: string;
}
