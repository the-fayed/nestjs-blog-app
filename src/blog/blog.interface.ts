import { IUser } from 'src/user';

export interface IBlog {
  id: number;
  title: string;
  slug: string;
  description: string;
  body: string;
  headerImage?: string;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
  author: IUser;
}
