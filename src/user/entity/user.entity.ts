import {
  PrimaryGeneratedColumn,
  BeforeInsert,
  JoinColumn,
  OneToMany,
  OneToOne,
  Column,
  Entity,
} from 'typeorm';

import { RefreshToken, VerifyEmailToken } from '../entity';
import { IUser, UserRoles } from '../user.interface';
import { Blog } from 'src/blog/entity/blog.entity';

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @JoinColumn()
  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.user, {
    onDelete: 'SET NULL',
  })
  refreshToken: RefreshToken;

  @JoinColumn()
  @OneToOne(
    () => VerifyEmailToken,
    (verifyEmailToken) => verifyEmailToken.user,
    {
      onDelete: 'SET NULL',
    },
  )
  verifyEmailToken: VerifyEmailToken;

  @Column({ default: false })
  emailVerified: boolean;

  @OneToMany(() => Blog, (blog) => blog.author)
  blogs: Blog[];

  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.USER })
  role: UserRoles;

  @BeforeInsert()
  private emailToLowerCase(): void {
    this.email = this.email.toLowerCase();
  }
}
