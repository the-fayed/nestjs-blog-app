import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { IUser } from '../user.interface';
import { User } from './user.entity';

@Entity()
export class VerifyEmailToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @OneToOne(() => User, (user) => user.verifyEmailToken, {
    onDelete: 'SET NULL',
  })
  user: IUser;
}
