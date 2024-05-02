import { ConfigModule, ConfigService } from '@nestjs/config';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { RefreshToken, UserModule, VerifyEmailToken } from '../user';
import { AuthController } from './auth.controller';
import { NodemailerModule } from '../nodemailer';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies';
import { JwtGard } from './guards';

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
  providers: [AuthService, JwtGard, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
