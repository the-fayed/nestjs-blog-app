export interface IUser {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  emailVerified: boolean;
  role: UserRoles;
}

export enum UserRoles {
  ADMIN = 'admin',
  CHIEFEDITOR = 'chiefeditor',
  EDITOR = 'editor',
  USER = 'user',
}
