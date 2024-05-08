import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { AuthModule } from '../auth';
import { Blog } from './entity/blog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Blog]), AuthModule],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
