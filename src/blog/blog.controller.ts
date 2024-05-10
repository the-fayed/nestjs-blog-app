import { Pagination } from 'nestjs-typeorm-paginate';
import {
  Controller,
  HttpStatus,
  UseGuards,
  HttpCode,
  Delete,
  Param,
  Query,
  Post,
  Body,
  Get,
  Put,
} from '@nestjs/common';

import { CurrentUser, Serialize } from '../decorators';
import { IsAuthorGuard, IsPermitted, JwtGuard } from '../guards';
import { BlogService } from './blog.service';
import { Blog } from './entity/blog.entity';
import { IBlog } from './blog.interface';
import { User } from '../user';
import {
  PaginatedBlogDto,
  GetAllBlogsDto,
  UpdateBlogDto,
  CreateBlogDto,
  BlogDto,
} from './dtos';

@Controller('api/v1/blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @Serialize(BlogDto)
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Body() createBlogDto: CreateBlogDto,
    @CurrentUser() user: User,
  ): Promise<IBlog> {
    return this.blogService.create(createBlogDto, user);
  }

  @Get()
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @Serialize(PaginatedBlogDto)
  public async findAll(
    @Query() paginationOpt: GetAllBlogsDto,
  ): Promise<Pagination<Blog>> {
    return this.blogService.findAll(paginationOpt);
  }

  @Get(':id')
  @Serialize(BlogDto)
  @HttpCode(HttpStatus.OK)
  public async findOne(@Param('id') id: number): Promise<IBlog> {
    return this.blogService.findById(id);
  }

  @Put(':id')
  @Serialize(BlogDto)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard, IsAuthorGuard)
  public async updateOne(
    @Param('id') id: number,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<IBlog> {
    return this.blogService.updateOne(id, updateBlogDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtGuard, IsPermitted)
  public async deleteOne(@Param('id') id: number): Promise<void> {
    return this.blogService.deleteOne(id);
  }
}
