import { Pagination } from 'nestjs-typeorm-paginate';
import {
  UseGuards,
  Controller,
  Param,
  Query,
  Body,
  Get,
  Post,
  Put,
} from '@nestjs/common';

import { CurrentUser, Serialize } from '../decorators';
import { IsAuthorGuard, JwtGuard } from '../guards';
import { BlogService } from './blog.service';
import { Blog } from './entity/blog.entity';
import { IBlog } from './blog.interface';
import { User } from '../user';
import {
  PaginatedBlogDto,
  GetAllBlogsDto,
  CreateBlogDto,
  BlogDto,
  UpdateBlogDto,
} from './dtos';

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
  @UseGuards(JwtGuard)
  @Serialize(PaginatedBlogDto)
  public async findAll(
    @Query() paginationOpt: GetAllBlogsDto,
  ): Promise<Pagination<Blog>> {
    return this.blogService.findAll(paginationOpt);
  }

  @Put(':id')
  @Serialize(BlogDto)
  @UseGuards(JwtGuard, IsAuthorGuard)
  public async updateOne(
    @Param('id') id: number,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<IBlog> {
    return this.blogService.updateOne(id, updateBlogDto);
  }
}
