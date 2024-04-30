import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IUser } from '../user.interface';
import { RefreshToken } from 'src/auth/entity/refresh-token.entity';
import { VerifyEmailToken } from 'src/auth/entity/verify-email-token.entity';

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

  @BeforeInsert()
  private emailToLowerCase(): void {
    this.email = this.email.toLowerCase();
  }
}
