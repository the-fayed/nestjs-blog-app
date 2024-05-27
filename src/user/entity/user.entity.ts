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

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, length: 32 })
  name: string;

  @Column({ type: 'varchar', nullable: false, length: 64, unique: true })
  username: string;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ nullable: false })
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
