import {
  Controller,
  HttpStatus,
  HttpCode,
  Delete,
  Param,
  Post,
  Body,
  Get,
} from '@nestjs/common';

import {
  IRefreshTokenResponse,
  IVerifyEmailResponse,
  LoginResponse,
} from './auth.interface';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dtos';
import { CreateUserDto } from '../user';
import { LoginDto } from './dtos';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  public async signup(@Body() signupDto: CreateUserDto) {
    const response = await this.authService.signup(signupDto);
    if (response.includes('successfully')) {
      return { status: 'success', message: response };
    } else {
      return { status: 'error', message: response };
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return await this.authService.login(loginDto);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  public async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<IRefreshTokenResponse> {
    return await this.authService.refreshToken(refreshTokenDto);
  }

  @Delete('logout')
  @HttpCode(204)
  public async logout(@Body() refreshTokenDto: RefreshTokenDto): Promise<void> {
    return this.authService.logout(refreshTokenDto);
  }

  @Get('verify-email/:token')
  public async verifyEmailToken(
    @Param('token') token: string,
  ): Promise<IVerifyEmailResponse> {
    return await this.authService.verifyEmailToken(token);
  }
}
