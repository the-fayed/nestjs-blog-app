export interface IUser {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  emailVerified?: boolean;
}

export interface IFindAllUsersResponse {
  records: number;
  data: IUser[];
}
