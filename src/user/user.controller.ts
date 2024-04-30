import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { IFindAllUsersResponse, IUser } from './user.interface';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  public async findAll(): Promise<IFindAllUsersResponse> {
    return this.userService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id') id: number): Promise<IUser> {
    return this.userService.findOne(id);
  }

  @Put(':id')
  public async updateOne(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateOne(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  public async delete(@Param('id') id: number) {
    await this.userService.delete(id);
  }
}
