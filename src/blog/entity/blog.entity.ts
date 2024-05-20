import slugify from 'slugify';
import {
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  JoinTable,
  ManyToOne,
  Column,
  Entity,
} from 'typeorm';

import { IBlog } from '../blog.interface';
import { User } from '../../user';

@Entity()
export class Blog implements IBlog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 256, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 300, nullable: false })
  slug: string;

  @Column({ type: 'varchar', length: 1024, nullable: false })
  description: string;

  @Column({ type: 'varchar', length: 2048, nullable: false })
  body: string;

  @Column({ type: 'varchar', nullable: true })
  headerImage?: string;

  @Column({ type: 'varchar', nullable: true })
  headerImagePublicId?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @JoinTable()
  @ManyToOne(() => User, (user) => user.blogs, { onDelete: 'CASCADE' })
  author: User;

  @Column({ type: 'int', default: 0 })
  likes: number;

  @Column({ type: 'bool', default: false })
  reported: boolean;

  @BeforeUpdate()
  private updateTimestamp(): void {
    this.updatedAt = new Date();
  }

  @BeforeInsert()
  generateSlug(): void {
    this.slug = slugify(this.title, { lower: true });
  }
}
