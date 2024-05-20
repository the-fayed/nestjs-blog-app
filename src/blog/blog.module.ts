import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { BlogController } from './blog.controller';
import { UserModule } from '../user/user.module';
import { BlogService } from './blog.service';
import { Blog } from './entity/blog.entity';
import { AuthModule } from '../auth';
import { CloudinaryModule } from 'src/cloudinary';

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
