import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { IBlog } from './blog.interface';
import { CreateBlogDto } from './dtos';
import { User } from '../user';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Blog } from './entity/blog.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,
  ) {}

  public async create(
    createBlogDto: CreateBlogDto,
    user: User,
  ): Promise<IBlog> {
    const blog = this.blogRepository.create({ ...createBlogDto, author: user });
    if (!blog) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later!',
      );
    }
    return await this.blogRepository.save(blog);
  }

  public async findAll(
    options?: IPaginationOptions,
  ): Promise<Pagination<Blog>> {
    const queryBuilder = this.blogRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.author', 'author')
      .select([
        'blog.id',
        'blog.title',
        'blog.slug',
        'blog.description',
        'blog.body',
        'blog.headerImage',
        'blog.createdAt',
        'blog.updatedAt',
        'author.id',
        'author.name',
      ]);
    const blogs = await paginate<Blog>(queryBuilder, options);
    if (!blogs) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again!',
      );
    }
    return blogs;
  }
}
