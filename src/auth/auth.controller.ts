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
  LoginResponseDto,
  RefreshTokenDto,
  RefreshTokenResponseDto,
  SignUpDto,
  VerifyEmailTokenResponseDto,
} from './dtos';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user';
import { LoginDto } from './dtos';
import { Public } from 'src/decorators';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Public()
  public async signup(@Body() signupDto: CreateUserDto): Promise<SignUpDto> {
    const response = await this.authService.signup(signupDto);
    if (response.includes('successfully')) {
      return { status: 'success', message: response };
    } else {
      return { status: 'error', message: response };
    }
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return await this.authService.login(loginDto);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  public async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<RefreshTokenResponseDto> {
    return await this.authService.refreshToken(refreshTokenDto);
  }

  @Delete('logout')
  @HttpCode(204)
  public async logout(@Body() refreshTokenDto: RefreshTokenDto): Promise<void> {
    return this.authService.logout(refreshTokenDto);
  }

  @Get('verify-email/:token')
  @Public()
  public async verifyEmailToken(
    @Param('token') token: string,
  ): Promise<VerifyEmailTokenResponseDto> {
    return await this.authService.verifyEmailToken(token);
  }
}
