import * as crypto from 'crypto';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { RefreshToken } from './entity/refresh-token.entity';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { UserService } from 'src/user/user.service';
import { IUser } from 'src/user/user.interface';
import { LoginDto } from './dtos/login.dto';
import {
  IPayload,
  IRefreshTokenResponse,
  LoginResponse,
} from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  private async generateAuthToken(payload: IPayload): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }

  private async generateRefreshToken(user: IUser): Promise<string> {
    const refreshToken = await this.jwtService.signAsync(
      {
        username: user.username,
        id: user.id,
      },
      { expiresIn: '7d' },
    );
    const hashedRefreshToken = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');
    const token = this.refreshTokenRepository.create({
      user,
      token: hashedRefreshToken,
    });
    await this.refreshTokenRepository.save(token);
    return refreshToken;
  }

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

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.userService.findOneByEmailOrUsername(
      loginDto.emailOrUsername,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials!');
    }
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials!');
    }
    const authToken = await this.generateAuthToken({
      id: user.id,
      username: user.username,
    });
    const refreshToken = await this.generateRefreshToken({
      id: user.id,
      username: user.username,
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
      },
      auth_token: authToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<IRefreshTokenResponse> {
    const token = await this.refreshTokenRepository
      .createQueryBuilder('rt')
      .where('rt.token = :token', {
        token: crypto
          .createHash('sha256')
          .update(refreshTokenDto.refreshToken)
          .digest('hex'),
      })
      .innerJoinAndSelect('rt.user', 'user')
      .getOne();
    if (!token) {
      throw new UnauthorizedException('Invalid refresh token!');
    }
    const auth_token = await this.generateAuthToken({
      id: token.user.id,
      username: token.user.username,
    });
    const refreshToken = await this.generateRefreshToken({
      id: token.user.id,
      username: token.user.username,
    });
    await this.refreshTokenRepository.remove(token);
    return {
      refresh_token: refreshToken,
      auth_token: auth_token,
    };
  }

  async logout(refreshTokenDto: RefreshTokenDto): Promise<void> {
    const token = await this.refreshTokenRepository.findOneBy({
      token: crypto
        .createHash('sha256')
        .update(refreshTokenDto.refreshToken)
        .digest('hex'),
    });
    if (!token) {
      throw new UnauthorizedException('Invalid refresh token!');
    }
    await this.refreshTokenRepository.remove(token);
  }
}
