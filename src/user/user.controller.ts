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

import { IFindAllUsersResponse, IUser } from './user.interface';
import { UserService } from './user.service';
import { IPayload, JwtGard } from '../auth';
import { CurrentUser } from '../decorators';
import { UpdateUserDto } from './dtos';

@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtGard)
  public async findAll(): Promise<IFindAllUsersResponse> {
    return this.userService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id') id: number): Promise<IUser> {
    return this.userService.findOne(id);
  }

  @Put()
  public async updateOne(
    @CurrentUser() user: IPayload,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateOne(user.id, updateUserDto);
  }

  @Delete()
  @HttpCode(204)
  @UseGuards(JwtGard)
  public async delete(@CurrentUser() user: IPayload): Promise<void> {
    await this.userService.delete(user);
  }
}
