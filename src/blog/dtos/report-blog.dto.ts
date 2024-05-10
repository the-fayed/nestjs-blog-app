import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class ReportBlogDto {
  @IsString()
  @Transform(({ value }) => Number(value))
  id: number;
}
