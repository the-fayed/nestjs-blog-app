import {
  Controller,
  HttpCode,
  Delete,
  Param,
  Body,
  Get,
  Put,
} from '@nestjs/common';

import { UpdateUserDto, UserDto } from './dtos';
import { UserService } from './user.service';
import { Auth, CurrentUser } from '../decorators';
import { IPayload } from '../auth';
import { UserRoles } from './user.interface';

@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Auth(UserRoles.ADMIN)
  public async findAll(): Promise<UserDto[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id') id: number): Promise<UserDto> {
    return this.userService.findOne(id);
  }

  @Put()
  public async updateOne(
    @CurrentUser() user: IPayload,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    return await this.userService.updateOne(user.id, updateUserDto);
  }

  @Delete()
  @HttpCode(204)
  public async delete(@CurrentUser() user: IPayload): Promise<void> {
    await this.userService.delete(user);
  }
}
