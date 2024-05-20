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

import { IBlog, IReportBlogResponse } from './blog.interface';
import { CreateBlogDto, UpdateBlogDto } from './dtos';
import { NoContentException } from '../exceptions';
import { CloudinaryService } from '../cloudinary';
import { Blog } from './entity';
import { User } from '../user';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  public async create(
    createBlogDto: CreateBlogDto,
    user: User,
  ): Promise<IBlog> {
    let headerImageUrl: string;
    let headerImagePublicId: string;
    if (createBlogDto.headerImage) {
      const headerImage = await this.cloudinaryService.uploadImage(
        createBlogDto.headerImage,
      );
      headerImageUrl = headerImage.url;
      headerImagePublicId = headerImage.public_id;
    }
    const blog = this.blogRepository.create({
      title: createBlogDto.title,
      description: createBlogDto.description,
      body: createBlogDto.body,
      headerImage: headerImageUrl,
      headerImagePublicId: headerImagePublicId,
      author: user,
    });
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

    let headerImageUrl: string;
    let headerImagePublicId: string;
    if (updateBlogDto.headerImage) {
      if (blog.headerImage) {
        await this.cloudinaryService.deleteImage(blog.headerImagePublicId);
      }

      const headerImage = await this.cloudinaryService.uploadImage(
        updateBlogDto.headerImage,
      );
      headerImageUrl = headerImage.url;
      headerImagePublicId = headerImage.public_id;
    }

    Object.assign(blog, {
      ...updateBlogDto,
      headerImage: headerImageUrl,
      headerImagePublicId,
    });
    await this.blogRepository.save(blog);

    return blog;
  }

  public async likeOrDislikeBlog(id: number, user: User): Promise<IBlog> {
    const blog = await this.blogRepository
      .createQueryBuilder('blog')
      .where('blog.id = :id', { id: id })
      .leftJoinAndSelect('blog.author', 'author')
      .leftJoinAndSelect('blog.likedBy', 'likedBy')
      .select([
        'blog.id',
        'blog.title',
        'blog.slug',
        'blog.description',
        'blog.body',
        'blog.headerImage',
        'blog.createdAt',
        'blog.updatedAt',
        'blog.likes',
        'likedBy.id',
        'likedBy.name',
        'author.id',
        'author.name',
      ])
      .getOne();
    if (!blog) {
      throw new NotFoundException('Blog not found!');
    }
    // check if user has already liked the blog and remove the like
    if (blog.likedBy.length && blog.likedBy.find((u) => u.id === user.id)) {
      blog.likedBy = blog.likedBy.filter((likedBy) => likedBy.id !== user.id);
      blog.likes = blog.likes - 1;
      return await this.blogRepository.save(blog);
    }
    //else adding the like
    blog.likes += 1;
    blog.likedBy.push(user);
    return await this.blogRepository.save(blog);
  }

  public async deleteOne(id: number): Promise<void> {
    const blog = await this.blogRepository.findOneBy({ id });
    if (!blog) {
      throw new NotFoundException('Blog not found!');
    }
    if (blog.headerImage) {
      await this.cloudinaryService.deleteImage(blog.headerImagePublicId);
    }
    await this.blogRepository.delete(blog.id);
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
