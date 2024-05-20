import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';

import { RefreshToken, User, VerifyEmailToken } from './user';
import { NodemailerModule } from './nodemailer';
import { UserModule } from './user/user.module';
import { CloudinaryModule } from './cloudinary';
import { Blog, BlogModule } from './blog';
import { AuthModule } from './auth';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('TYPEORM_HOST'),
        port: parseInt(configService.get<string>('TYPEORM_PORT')),
        username: configService.get<string>('TYPEORM_USERNAME'),
        password: configService.get<string>('TYPEORM_PASSWORD'),
        database: configService.get<string>('TYPEORM_DATABASE'),
        synchronize: true,
        entities: [User, RefreshToken, VerifyEmailToken, Blog],
      }),
    }),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get<string>('MULTER_DEST'),
      }),
    }),
    UserModule,
    AuthModule,
    BlogModule,
    NodemailerModule,
    CloudinaryModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true, transform: true }),
    },
  ],
})
export class AppModule {}
