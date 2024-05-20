import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 256, {
    message: 'Blog title must be between 3 and 256 characters',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 1024, {
    message: 'Blog description must be between 3 and 1024 characters',
  })
  description: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 2048, {
    message: 'body must be between 3 and 2048 characters',
  })
  body: string;

  @ApiProperty({ required: false })
  headerImage?: Express.Multer.File;
}
