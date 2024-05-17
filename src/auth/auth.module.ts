import { ConfigModule, ConfigService } from '@nestjs/config';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { AuthGuard, JwtStrategy, RoleGuard } from '../guards';
import { RefreshToken, VerifyEmailToken } from '../user';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { NodemailerModule } from '../nodemailer';
import { AuthService } from './auth.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION'),
        },
      }),
    }),
    TypeOrmModule.forFeature([RefreshToken, VerifyEmailToken]),
    NodemailerModule,
  ],
  providers: [AuthService, AuthGuard, RoleGuard, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
