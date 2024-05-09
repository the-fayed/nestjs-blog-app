import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateBlogDto {
  @IsString()
  @IsOptional()
  @Length(3, 256, {
    message: 'Blog title must be between 3 and 256 characters',
  })
  title?: string;

  @IsString()
  @IsOptional()
  @Length(3, 1024, {
    message: 'description must be between 3 and 1024 characters',
  })
  description?: string;

  @IsString()
  @IsOptional()
  @Length(3, 2048, {
    message: 'body must be between 3 and 2048 characters',
  })
  body?: string;

  @ApiProperty({ required: false })
  headerImage?: string;
}
