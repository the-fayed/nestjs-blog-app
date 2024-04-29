import { Body, Controller, Delete, HttpCode, Post } from '@nestjs/common';

import { IRefreshTokenResponse, LoginResponse } from './auth.interface';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';

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

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return await this.authService.login(loginDto);
  }

  @Post('refresh-token')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<IRefreshTokenResponse> {
    return await this.authService.refreshToken(refreshTokenDto);
  }

  @Delete('logout')
  @HttpCode(204)
  async logout(@Body() refreshTokenDto: RefreshTokenDto): Promise<void> {
    return this.authService.logout(refreshTokenDto);
  }
}
