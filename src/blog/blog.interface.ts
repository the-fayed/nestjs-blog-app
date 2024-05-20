import { IUser } from 'src/user';

export interface IBlog {
  id: number;
  title: string;
  slug: string;
  description: string;
  body: string;
  headerImage?: string;
  headerImagePublicId?: string;
  likes: number;
  likedBy: { id: number; name: string }[];
  createdAt: Date;
  updatedAt: Date;
  author: IUser;
}

export interface IReportBlogResponse {
  status: 'success' | 'error';
  message: string;
}
