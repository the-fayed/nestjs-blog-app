import { Expose, Type } from 'class-transformer';

export class BlogDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  slug: string;

  @Expose()
  description: string;

  @Expose()
  body: string;

  @Expose()
  headerImage: string;

  @Expose()
  likes: number;

  @Expose()
  @Type(() => Author)
  likedBy: [{ id: number; name: string }];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => Author)
  author: {
    id: number;
    name: string;
  };
}

export class PaginatedBlogDto {
  @Expose()
  @Type(() => BlogDto)
  items: [BlogDto];

  @Expose()
  @Type(() => Meta)
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export class Author {
  @Expose()
  id: number;

  @Expose()
  name: string;
}

export class Meta {
  @Expose()
  totalItems: number;

  @Expose()
  itemCount: number;

  @Expose()
  itemsPerPage: number;

  @Expose()
  totalPages: number;

  @Expose()
  currentPage: number;
}
