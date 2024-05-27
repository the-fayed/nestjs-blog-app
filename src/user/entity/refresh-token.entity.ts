import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './user.entity';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.refreshToken, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  token: string;
}
