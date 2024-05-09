import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { AuthModule } from '../auth';
import { Blog } from './entity/blog.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Blog]), AuthModule, UserModule],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
