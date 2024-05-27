import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos';
import { IUser } from './user.interface';

describe('UserService', () => {
  let users: IUser[] = [];

  let service: UserService;
  const fakeUserService: Partial<UserService> = {
    create: async (createUserDto: CreateUserDto) => {
      const user = {
        id: Math.floor(Math.random() * 100),
        name: createUserDto.name,
        username: createUserDto.username,
        email: createUserDto.email,
        password: createUserDto.password,
      } as IUser;
      users.push(user);
      return Promise.resolve(user);
    },

    findAll: async () => {
      return Promise.resolve(users);
    },

    findOne: async (id) => {
      return Promise.resolve(users.find((user) => user.id === id));
    },

    findOneByEmailOrUsername: async (emailOrUserName) => {
      return Promise.resolve(
        users.find(
          (user) =>
            user.email === emailOrUserName || user.username === emailOrUserName,
        ),
      );
    },

    updateOne: async (id, updateUserDto) => {
      const user = users.find((user) => user.id === id);
      Object.assign(user, updateUserDto);
      return Promise.resolve(user);
    },

    updateEmailVerificationStatus: async (id, status) => {
      const user = users.find((user) => user.id === id);
      user.emailVerified = status;
      return Promise.resolve(user);
    },

    delete: async (currentUser) => {
      users = users.filter((user) => user.id !== currentUser.id);
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    users = [];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
