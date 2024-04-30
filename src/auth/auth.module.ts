import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';

import { VerifyEmailToken } from './entity/verify-email-token.entity';
import { RefreshToken } from './entity/refresh-token.entity';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { NodemailerModule } from 'src/nodemailer/nodemailer.module';

@Module({
  imports: [
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
    UserModule,
    NodemailerModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
