import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { Match } from '../../decorators';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 32, { message: 'Name must be between 3 and 32 characters!' })
  @ApiProperty({ type: String, required: true, example: 'Ahmed Fayed' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 32, { message: 'Username must be between 3 and 32 characters!' })
  @ApiProperty({ type: String, required: true, example: 'ahmed_fayed' })
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ type: String, required: true, example: 'user@email.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  @ApiProperty({ type: String, required: true, example: 'Aa@12345678' })
  password: string;

  @Match('password', {
    message: 'password and password confirmation does not match!',
  })
  @ApiProperty({
    type: String,
    required: true,
    description: 'password confirmation',
  })
  passwordConfirmation: string;
}
