import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { IUser } from '../user.interface';
import { Match } from '../../decorators';

export type IUpdateUserPasswordDto = Pick<IUser, 'password'>;

export class UpdateUserPasswordDto implements IUpdateUserPasswordDto {
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  @ApiProperty({
    type: String,
    required: true,
    description: 'User password',
    example: 'Aa@123456',
  })
  password: string;

  @IsNotEmpty()
  @Match('password')
  @ApiProperty({
    type: String,
    description: 'User password confirmation',
  })
  passwordConfirmation: string;
}
