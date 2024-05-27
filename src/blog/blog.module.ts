import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { BlogController } from './blog.controller';
import { UserModule } from '../user/user.module';
import { CloudinaryModule } from '../cloudinary';
import { BlogService } from './blog.service';
import { Blog } from './entity/blog.entity';
import { AuthModule } from '../auth';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog]),
    CloudinaryModule,
    AuthModule,
    UserModule,
    JwtModule,
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
