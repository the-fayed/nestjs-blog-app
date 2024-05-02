import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { IFindAllUsersResponse, IUser } from './user.interface';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { User } from './entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<IFindAllUsersResponse> {
    const users = await this.userRepository.find();
    return {
      records: users.length,
      data: users,
    };
  }

  async findOne(id: number): Promise<IUser> {
    return await this.userRepository.findOneBy({ id });
  }

  async findOneByEmailOrUsername(emailOrUserName: string): Promise<IUser> {
    return await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.name',
        'user.username',
        'user.password',
        'user.email',
        'user.emailVerified',
      ])
      .where(
        'user.email = :emailOrUserName OR user.username = :emailOrUserName',
        { emailOrUserName: emailOrUserName },
      )
      .getOne();
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto): Promise<IUser> {
    const user = await this.userRepository.findOneBy({ id });
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  public async updateEmailVerificationStatus(id: number, status: boolean) {
    const user = await this.userRepository.findOneBy({ id });
    user.emailVerified = status;
    return await this.userRepository.save(user);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
