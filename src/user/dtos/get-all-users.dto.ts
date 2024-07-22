import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class GetAllUsersDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  page: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  limit: number;
}
