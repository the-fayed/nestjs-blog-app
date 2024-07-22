import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { UserRoles } from '../user.interface';

export class UserDto {
  @Expose()
  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ type: String, example: 'Ahmed Fayed' })
  name: string;

  @Expose()
  @ApiProperty({ type: String, example: 'ahmed-fayed' })
  username: string;

  @Expose()
  @ApiProperty({ type: String, example: 'ahmedfayed@email.com' })
  email: string;

  @Expose()
  @ApiProperty({ type: String, enum: UserRoles, example: UserRoles.USER })
  role: UserRoles;

  @Expose()
  @ApiProperty({ type: Boolean, example: true })
  emailVerified: boolean;
}

export class Meta {
  @Expose()
  @ApiProperty({ type: Number, example: 100 })
  totalItems: number;

  @Expose()
  @ApiProperty({ type: Number, example: 50 })
  itemCount: number;

  @Expose()
  @ApiProperty({ type: Number, example: 50 })
  itemsPerPage: number;

  @Expose()
  @ApiProperty({ type: Number, example: 2 })
  totalPages: number;

  @Expose()
  @ApiProperty({ type: Number, example: 1 })
  currentPage: number;
}

export class PaginatedUserDto {
  @Expose()
  @Type(() => UserDto)
  @ApiProperty({ type: UserDto, isArray: true })
  items: [UserDto];

  @Expose()
  @Type(() => Meta)
  @ApiProperty({ type: Meta })
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
