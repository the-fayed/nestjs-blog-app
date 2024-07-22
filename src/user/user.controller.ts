import { Pagination } from 'nestjs-typeorm-paginate';
import {
  Controller,
  UseGuards,
  HttpCode,
  Delete,
  Param,
  Body,
  Get,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { IUpdateUserResponse, IUser, UserRoles } from './user.interface';
import { Auth, CurrentUser, Serialize } from '../decorators';
import { UserService } from './user.service';
import { AuthGuard } from '../guards';
import { IPayload } from '../auth';
import { User } from './entity';
import {
  UpdateUserPasswordDto,
  UpdateUserEmailDto,
  UpdateUserRoleDto,
  UpdateUserDataDto,
  UpdateUserDto,
  UserDto,
  GetAllUsersDto,
  PaginatedUserDto,
} from './dtos';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Auth(UserRoles.ADMIN)
  @Serialize(PaginatedUserDto)
  @ApiOkResponse({
    description: 'Get all users successfully',
    type: PaginatedUserDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  public async findAll(
    @Query() opts?: GetAllUsersDto,
  ): Promise<Pagination<User>> {
    opts.page = opts.page || 1;
    opts.limit = opts.limit || 50;
    return this.userService.findAll(opts);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Get specific user successfully',
    type: User,
    isArray: false,
  })
  @ApiNotFoundResponse({
    description: 'Not Found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  public async findOne(@Param('id') id: number): Promise<UserDto> {
    return this.userService.findOne(id);
  }

  @Put('/update-data')
  @UseGuards(AuthGuard)
  @Serialize(UpdateUserDto)
  @ApiOkResponse({
    description: 'Update user data successfully',
    type: UpdateUserDto,
    isArray: false,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
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
  @ApiCreatedResponse({
    description: 'Update user password successfully',
    type: UpdateUserDto,
    isArray: false,
  })
  @ApiCreatedResponse({
    description: 'Bad Request',
  })
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
  @ApiCreatedResponse({
    description: 'Update user email successfully',
    type: UpdateUserDto,
    isArray: false,
  })
  @ApiCreatedResponse({
    description: 'Bad Request',
  })
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
  @ApiCreatedResponse({
    description: 'Update user role successfully',
    type: UpdateUserDto,
    isArray: false,
  })
  @ApiCreatedResponse({
    description: 'Bad Request',
  })
  @ApiCreatedResponse({
    description: 'Not Found',
  })
  @ApiCreatedResponse({
    description: 'Forbidden',
  })
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
