import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

import { IUser } from './user.interface';
import { IPayload } from '../auth';
import { User } from './entity';
import {
  UpdateUserPasswordDto,
  UpdateUserEmailDto,
  UpdateUserRoleDto,
  UpdateUserDataDto,
  CreateUserDto,
} from './dtos';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll(opts?: IPaginationOptions): Promise<Pagination<User>> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.name', 'user.username', 'user.email']);

    const users = await paginate<User>(queryBuilder, opts);
    return users;
  }

  async findOne(id: number): Promise<IUser> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .select([
        'user.passwordChangedAt',
        'user.emailVerified',
        'user.username',
        'user.password',
        'user.email',
        'user.name',
        'user.role',
        'user.id',
      ])
      .getOne();
  }

  async findOneByEmailOrUsername(emailOrUserName: string): Promise<IUser> {
    return await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.emailVerified',
        'user.username',
        'user.password',
        'user.email',
        'user.name',
        'user.role',
        'user.id',
      ])
      .where(
        'user.email = :emailOrUserName OR user.username = :emailOrUserName',
        { emailOrUserName: emailOrUserName },
      )
      .getOne();
  }

  async updateOne(
    id: number,
    updateUserDto:
      | UpdateUserPasswordDto
      | UpdateUserEmailDto
      | UpdateUserDataDto
      | UpdateUserRoleDto,
  ): Promise<IUser> {
    const user = await this.userRepository.findOneBy({ id });
    if (updateUserDto['password']) {
      updateUserDto['password'] = await bcrypt.hash(
        updateUserDto['password'],
        12,
      );
    }
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  public async updateEmailVerificationStatus(
    id: number,
    status: boolean,
  ): Promise<IUser> {
    const user = await this.userRepository.findOneBy({ id });
    user.emailVerified = status;
    return await this.userRepository.save(user);
  }

  async delete(user: IPayload): Promise<void> {
    await this.userRepository.delete(user.id);
  }
}
