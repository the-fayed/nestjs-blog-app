import { User } from 'src/user/entity/user.entity';
import { IUser } from 'src/user/user.interface';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

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
