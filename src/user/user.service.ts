import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { IFindAllUsersResponse, IUser } from './user.interface';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dtos/update-user.dto';

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

  async updateOne(id: number, updateUserDto: UpdateUserDto): Promise<IUser> {
    const user = await this.userRepository.findOneBy({ id });
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
