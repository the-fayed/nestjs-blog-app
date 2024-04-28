import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';
import { Match } from 'src/decorators/match.decorator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 32, { message: 'Name must be between 3 and 32 characters!' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 32, { message: 'Username must be between 3 and 32 characters!' })
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password: string;

  @Match('password', {
    message: 'password and password confirmation does not match!',
  })
  passwordConfirmation: string;
}
