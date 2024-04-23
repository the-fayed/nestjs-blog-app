import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { IFindAllUsersResponse, IUser } from './user.interface';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<IUser> {
    return await this.userService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<IFindAllUsersResponse> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<IUser> {
    return this.userService.findOne(id);
  }

  @Put(':id')
  async updateOne(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateOne(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: number) {
    await this.userService.delete(id);
  }
}
