import {
  Controller,
  UseGuards,
  HttpCode,
  Delete,
  Param,
  Body,
  Get,
  Put,
} from '@nestjs/common';

import { UpdateUserDto, UserDto } from './dtos';
import { UserService } from './user.service';
import { IPayload, JwtGard } from '../auth';
import { CurrentUser } from '../decorators';

@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtGard)
  public async findAll(): Promise<UserDto[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id') id: number): Promise<UserDto> {
    return this.userService.findOne(id);
  }

  @Put()
  @UseGuards(JwtGard)
  public async updateOne(
    @CurrentUser() user: IPayload,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    return await this.userService.updateOne(user.id, updateUserDto);
  }

  @Delete()
  @HttpCode(204)
  @UseGuards(JwtGard)
  public async delete(@CurrentUser() user: IPayload): Promise<void> {
    await this.userService.delete(user);
  }
}
