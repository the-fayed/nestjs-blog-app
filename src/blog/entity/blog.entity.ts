import {
  PrimaryGeneratedColumn,
  BeforeUpdate,
  ManyToOne,
  Column,
  Entity,
} from 'typeorm';

import { User } from '../../user';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 256, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 256, nullable: false })
  slug: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 4096, nullable: false })
  body: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeUpdate()
  private updateTimestamp(): void {
    this.updatedAt = new Date();
  }

  @Column({ type: 'int', default: 0 })
  likes: number;

  @Column({ type: 'varchar', nullable: true })
  headerImage: string;

  @ManyToOne(() => User, (user) => user.blogs)
  author: User;
}
