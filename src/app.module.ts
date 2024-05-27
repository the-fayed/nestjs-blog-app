import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module, ValidationPipe } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';

import { NodemailerModule } from './nodemailer';
import { UserModule } from './user/user.module';
import { CloudinaryModule } from './cloudinary';
import { BlogModule } from './blog';
import { AuthModule } from './auth';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('TYPEORM_URL'),
        autoLoadEntities: true,
        synchronize: true,
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
