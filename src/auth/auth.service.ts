import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';
import { IPayload, LoginResponse } from './auth.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entity/refresh-token.entity';
import { Repository } from 'typeorm';
import { IUser } from 'src/user/user.interface';

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
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);
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
}
