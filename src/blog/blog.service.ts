import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import {
  InternalServerErrorException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';

import { CreateBlogDto, UpdateBlogDto } from './dtos';
import { IBlog, IReportBlogResponse } from './blog.interface';
import { Blog } from './entity';
import { User } from '../user';
import { NoContentException } from 'src/exceptions';

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

  public async findById(id: number): Promise<IBlog> {
    const blog = await this.blogRepository
      .createQueryBuilder('blog')
      .where('blog.id = :id', { id: id })
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
      ])
      .getOne();

    if (!blog) {
      throw new NotFoundException('Blog not found!');
    }

    return blog;
  }

  public async updateOne(
    id: number,
    updateBlogDto: UpdateBlogDto,
  ): Promise<IBlog> {
    const blog = await this.blogRepository.findOneBy({ id });

    if (!blog) {
      throw new NotFoundException('Blog not found!');
    }

    Object.assign(blog, updateBlogDto);
    await this.blogRepository.save(blog);

    return blog;
  }

  public async deleteOne(id: number): Promise<void> {
    await this.blogRepository.delete(id);
  }

  public async reportBlog(id: number): Promise<IReportBlogResponse> {
    const blog = await this.blogRepository.findOneBy({ id });
    if (!blog) {
      throw new NotFoundException('Blog not found!');
    }
    if (!blog.reported) {
      blog.reported = true;
      this.blogRepository.save(blog);
    }
    return { status: 'success', message: 'Blog reported successfully!' };
  }

  public async getReportedBlogs(
    options: IPaginationOptions,
  ): Promise<Pagination<Blog>> {
    const queryBuilder = this.blogRepository
      .createQueryBuilder('blog')
      .where('blog.reported = :reported', { reported: true })
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
    if (!blogs.items.length) {
      throw new NoContentException();
    }
    return blogs;
  }
}
