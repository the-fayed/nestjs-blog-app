export interface IUser {
  id?: number;
  name?: string;
  username?: string;
}

export interface IFindAllUsersResponse {
  records: number;
  data: IUser[];
}
