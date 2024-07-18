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

import { IUpdateUserResponse, IUser, UserRoles } from './user.interface';
import { Auth, CurrentUser, Serialize } from '../decorators';
import { UserService } from './user.service';
import { AuthGuard } from '../guards';
import { IPayload } from '../auth';
import {
  UpdateUserPasswordDto,
  UpdateUserEmailDto,
  UpdateUserRoleDto,
  UpdateUserDataDto,
  UpdateUserDto,
  UserDto,
} from './dtos';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Auth(UserRoles.ADMIN)
  @Serialize(UserDto)
  public async findAll(): Promise<UserDto[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id') id: number): Promise<UserDto> {
    return this.userService.findOne(id);
  }

  @Put('/update-data')
  @UseGuards(AuthGuard)
  @Serialize(UpdateUserDto)
  public async updateData(
    @CurrentUser() user: IUser,
    @Body() updateUserDataDto: UpdateUserDataDto,
  ): Promise<IUpdateUserResponse> {
    const updatedUser = await this.userService.updateOne(
      user.id,
      updateUserDataDto,
    );
    return {
      status: 'success',
      message: 'User updated successfully',
      data: updatedUser,
    };
  }

  @Put('/update-password')
  @UseGuards(AuthGuard)
  @Serialize(UpdateUserDto)
  public async updatePassword(
    @CurrentUser() user: IUser,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
  ): Promise<IUpdateUserResponse> {
    const updatedUser = await this.userService.updateOne(
      user.id,
      updateUserPasswordDto,
    );
    return {
      status: 'success',
      message: 'User updated successfully',
      data: updatedUser,
    };
  }

  @Put('/update-email')
  @UseGuards(AuthGuard)
  @Serialize(UpdateUserDto)
  public async updateEmail(
    @CurrentUser() user: IUser,
    @Body() updateUserEmailDto: UpdateUserEmailDto,
  ): Promise<IUpdateUserResponse> {
    const updatedUser = await this.userService.updateOne(
      user.id,
      updateUserEmailDto,
    );
    return {
      status: 'success',
      message: 'User updated successfully',
      data: updatedUser,
    };
  }

  @Put(':id/update-role')
  @Auth(UserRoles.ADMIN)
  @Serialize(UpdateUserDto)
  public async updateRole(
    @Param('id') id: number,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ): Promise<IUpdateUserResponse> {
    const updatedUser = await this.userService.updateOne(id, updateUserRoleDto);
    return {
      status: 'success',
      message: 'User updated successfully',
      data: updatedUser,
    };
  }

  @Delete()
  @HttpCode(204)
  @UseGuards(AuthGuard)
  public async delete(@CurrentUser() user: IPayload): Promise<void> {
    await this.userService.delete(user);
  }
}
