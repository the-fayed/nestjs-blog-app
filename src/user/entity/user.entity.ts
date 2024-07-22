import {
  PrimaryGeneratedColumn,
  BeforeInsert,
  JoinColumn,
  OneToMany,
  OneToOne,
  Column,
  Entity,
  BeforeUpdate,
  AfterLoad,
  ManyToMany,
} from 'typeorm';

import { RefreshToken, VerifyEmailToken } from '../entity';
import { Blog } from '../../blog/entity/blog.entity';
import { IUser, UserRoles } from '../user.interface';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    type: Number,
    description: 'Unique identifier of the user',
  })
  id: number;

  @Column({ type: 'varchar', nullable: false, length: 32 })
  @ApiProperty({
    type: String,
    description: 'Name of the user',
    example: 'Ahmed Fayed',
  })
  name: string;

  @Column({ type: 'varchar', nullable: false, length: 64, unique: true })
  @ApiProperty({
    type: String,
    description: 'Name of the user',
    example: 'ahmed_fayed',
  })
  username: string;

  @Column({ type: 'varchar', nullable: false })
  @ApiProperty({
    type: String,
    description: 'Name of the user',
    example: 'user@email.com',
  })
  email: string;

  @Column({ nullable: false })
  @ApiProperty({
    type: String,
    description: 'Password of the user',
    example: 'Aa@12345678',
  })
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
  @ApiProperty({
    type: Boolean,
    description: 'Email verified status of the user',
    example: true,
  })
  emailVerified: boolean;

  @OneToMany(() => Blog, (blog) => blog.author, { onDelete: 'CASCADE' })
  blogs: Blog[];

  @ManyToMany(() => Blog, (blog) => blog.likedBy, { onDelete: 'CASCADE' })
  likes: Blog[];

  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.USER })
  role: UserRoles;

  @Column({ type: 'timestamp', nullable: true })
  passwordChangedAt: Date;

  private tempPassword: string;
  private tempEmail: string;

  @BeforeInsert()
  private emailToLowerCase(): void {
    this.email = this.email.toLowerCase();
  }

  @AfterLoad()
  private storOriginalPassword(): void {
    this.tempPassword = this.password;
    this.tempEmail = this.email;
  }

  @BeforeUpdate()
  private updateTimestamp(): void {
    if (this.password !== this.tempPassword) {
      this.passwordChangedAt = new Date();
    }

    if (this.email !== this.tempEmail) {
      this.emailVerified = false;
    }
  }
}
