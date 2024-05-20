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
