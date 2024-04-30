import * as crypto from 'crypto';

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
  IVerifyEmailResponse,
  LoginResponse,
} from './auth.interface';
import { NodemailerService } from 'src/nodemailer/nodemailer.service';
import { VerifyEmailToken } from './entity/verify-email-token.entity';
import { verifyEmail } from 'src/nodemailer/email-templates/verify-email.template';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(VerifyEmailToken)
    private readonly verifyEmailTokenRepository: Repository<VerifyEmailToken>,
    private readonly nodemailerService: NodemailerService,
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

  private generateEmailVerificationToken(userId: number): string {
    return crypto.createHash('sha256').update(userId.toString()).digest('hex');
  }

  public async signup(signupDto: CreateUserDto): Promise<string> {
    const emailExists = await this.userService.findOneByEmailOrUsername(
      signupDto.email,
    );
    if (emailExists) {
      throw new BadRequestException('Email already in use');
    }
    const usernameExists = await this.userService.findOneByEmailOrUsername(
      signupDto.username,
    );
    if (usernameExists) {
      throw new BadRequestException('Username already in use');
    }
    const hash = await bcrypt.hash(signupDto.password, 12);
    signupDto.password = hash;
    const user = await this.userService.create(signupDto);
    const token = this.generateEmailVerificationToken(user.id);
    await this.verifyEmailTokenRepository.save({
      token,
      user,
    });
    await this.nodemailerService.sendMail({
      to: user.email,
      subject: 'Verify your email',
      html: verifyEmail(token),
    });
    if (user) {
      return 'Account created successfully, please verify your email to continue.';
    } else {
      return 'Something went wrong, please try again!';
    }
  }

  public async login(loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.userService.findOneByEmailOrUsername(
      loginDto.emailOrUsername,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials!');
    } else if (user.emailVerified === false) {
      const token = await this.verifyEmailTokenRepository
        .createQueryBuilder('et')
        .leftJoinAndSelect('et.user', 'user')
        .getOne();
      if (token) {
        await this.nodemailerService.sendMail({
          to: user.email,
          subject: 'Verify your email',
          html: verifyEmail(token.token),
        });
        throw new BadRequestException(
          'Your email has not been verified yet, please check your email.',
        );
      } else {
        const token = this.generateEmailVerificationToken(user.id);
        await this.nodemailerService.sendMail({
          to: user.email,
          subject: 'Verify your email',
          html: verifyEmail(token),
        });
        await this.verifyEmailTokenRepository.save({
          token,
          user,
        });
        throw new BadRequestException(
          'Your email has not been verified yet, please check your email.',
        );
      }
    } else {
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

  public async refreshToken(
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

  public async logout(refreshTokenDto: RefreshTokenDto): Promise<void> {
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

  public async verifyEmailToken(token: string): Promise<IVerifyEmailResponse> {
    const isValidToken = await this.verifyEmailTokenRepository
      .createQueryBuilder('et')
      .leftJoinAndSelect('et.user', 'user')
      .where('et.token = :token', { token })
      .getOne();
    if (!isValidToken) {
      throw new BadRequestException('Invalid token!');
    }
    await this.userService.updateEmailVerificationStatus(
      isValidToken.user.id,
      true,
    );
    await this.verifyEmailTokenRepository.remove(isValidToken);
    return { status: 'success', message: 'Email verified successfully!' };
  }
}
