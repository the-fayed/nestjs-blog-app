import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IUser } from '../user.interface';

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

  @BeforeInsert()
  private emailToLowerCase(): void {
    this.email = this.email.toLowerCase();
  }
}
