import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';

import { BlogService } from './blog.service';
import { CurrentUser, Serialize } from '../decorators';
import { IBlog } from './blog.interface';
import { BlogDto, CreateBlogDto, PaginatedBlogDto } from './dtos';
import { JwtGuard } from '../auth';
import { User } from '../user';
import { Blog } from './entity/blog.entity';
import { GetAllBlogsDto } from './dtos/get-all-blogs.dto';

@Controller('api/v1/blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseGuards(JwtGuard)
  @Serialize(BlogDto)
  public async create(
    @Body() createBlogDto: CreateBlogDto,
    @CurrentUser() user: User,
  ): Promise<IBlog> {
    return this.blogService.create(createBlogDto, user);
  }

  @Get()
  // @Serialize(PaginatedBlogDto)
  public async findAll(
    @Query() paginationOpt: GetAllBlogsDto,
  ): Promise<Pagination<Blog>> {
    return this.blogService.findAll(paginationOpt);
  }
}
