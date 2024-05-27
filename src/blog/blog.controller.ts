import { FileInterceptor } from '@nestjs/platform-express';
import { Pagination } from 'nestjs-typeorm-paginate';
import {
  MaxFileSizeValidator,
  FileTypeValidator,
  UseInterceptors,
  ParseFilePipe,
  UploadedFile,
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

import { IsAuthorGuard, IsPermitted, AuthGuard } from '../guards';
import { IBlog, IReportBlogResponse } from './blog.interface';
import { Auth, CurrentUser, Serialize } from '../decorators';
import { BlogService } from './blog.service';
import { User, UserRoles } from '../user';
import { Blog } from './entity';
import {
  ReportBlogResponseDto,
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
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('headerImage'))
  public async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 3,
            message: 'Max size for the image is 3 mb',
          }),
          new FileTypeValidator({
            fileType: 'image/(jpg|jpeg|png)$',
          }),
        ],
      }),
    )
    headerImage: Express.Multer.File,
    @Body() createBlogDto: CreateBlogDto,
    @CurrentUser() user: User,
  ): Promise<IBlog> {
    createBlogDto.headerImage = headerImage;
    return this.blogService.create(createBlogDto, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Serialize(PaginatedBlogDto)
  public async findAll(
    @Query() paginationOpt: GetAllBlogsDto,
  ): Promise<Pagination<Blog>> {
    return this.blogService.findAll(paginationOpt);
  }

  @Get('reported')
  @Auth(UserRoles.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Serialize(PaginatedBlogDto)
  public async getReportedBlogs(
    @Query() paginationOpt: GetAllBlogsDto,
  ): Promise<Pagination<Blog>> {
    return this.blogService.getReportedBlogs(paginationOpt);
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
  @UseGuards(AuthGuard, IsAuthorGuard)
  @UseInterceptors(FileInterceptor('headerImage'))
  public async updateOne(
    @Param('id') id: number,
    @Body() updateBlogDto: UpdateBlogDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 3,
            message: 'Max size for the image is 3 mb',
          }),
          new FileTypeValidator({
            fileType: 'image/(jpg|jpeg|png)$',
          }),
        ],
      }),
    )
    headerImage: Express.Multer.File,
  ): Promise<IBlog> {
    updateBlogDto.headerImage = headerImage;
    return this.blogService.updateOne(id, updateBlogDto);
  }

  @Put(':id/like')
  @Serialize(BlogDto)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  public async likeOrDislikeBlog(
    @Param('id') id: number,
    @CurrentUser() user: User,
  ): Promise<IBlog> {
    return this.blogService.likeOrDislikeBlog(id, user);
  }

  @Put(':id/report')
  @HttpCode(HttpStatus.OK)
  @Serialize(ReportBlogResponseDto)
  @Auth(UserRoles.CHIEFEDITOR, UserRoles.EDITOR)
  public async reportBlog(
    @Param('id') id: number,
  ): Promise<IReportBlogResponse> {
    return this.blogService.reportBlog(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard, IsPermitted)
  public async deleteOne(@Param('id') id: number): Promise<void> {
    return this.blogService.deleteOne(id);
  }
}
