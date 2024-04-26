import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async signup(signupDto: CreateUserDto): Promise<string> {
    const hash = await bcrypt.hash(signupDto.password, 12);
    signupDto.password = hash;
    const user = await this.userService.create(signupDto);
    if (user) {
      return 'Account created successfully, please confirm your email to continue.';
    } else {
      return 'Something went wrong, please try again!';
    }
  }
}
