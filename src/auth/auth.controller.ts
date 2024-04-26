import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: CreateUserDto) {
    const response = await this.authService.signup(signupDto);
    if (response.includes('successfully')) {
      return { status: 'success', message: response };
    } else {
      return { status: 'error', message: response };
    }
  }
}
