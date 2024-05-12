export interface IUser {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  emailVerified: boolean;
  role: UserRoles;
}

export interface IUpdateUserResponse {
  status: 'success';
  message: 'User updated successfully';
  data: IUser;
}

export enum UserRoles {
  ADMIN = 'admin',
  CHIEFEDITOR = 'chiefeditor',
  EDITOR = 'editor',
  USER = 'user',
}
