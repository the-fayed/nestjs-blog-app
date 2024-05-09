import {
  Controller,
  HttpStatus,
  HttpCode,
  Delete,
  Param,
  Post,
  Body,
  Get,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { Serialize } from '../decorators';
import { CreateUserDto } from '../user';
import { JwtGuard } from '../guards';
import { LoginDto } from './dtos';
import {
  VerifyEmailTokenResponseDto,
  RefreshTokenResponseDto,
  LoginResponseDto,
  RefreshTokenDto,
  SignUpDto,
} from './dtos';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Serialize(SignUpDto)
  public async signup(@Body() signupDto: CreateUserDto): Promise<SignUpDto> {
    const response = await this.authService.signup(signupDto);
    if (response.includes('successfully')) {
      return { status: 'success', message: response };
    } else {
      return { status: 'error', message: response };
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Serialize(LoginResponseDto)
  public async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return await this.authService.login(loginDto);
  }

  @UseGuards(JwtGuard)
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @Serialize(RefreshTokenResponseDto)
  public async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<RefreshTokenResponseDto> {
    return await this.authService.refreshToken(refreshTokenDto);
  }

  @Delete('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async logout(@Body() refreshTokenDto: RefreshTokenDto): Promise<void> {
    return this.authService.logout(refreshTokenDto);
  }

  @Get('verify-email/:token')
  @Serialize(VerifyEmailTokenResponseDto)
  public async verifyEmailToken(
    @Param('token') token: string,
  ): Promise<VerifyEmailTokenResponseDto> {
    return await this.authService.verifyEmailToken(token);
  }
}
