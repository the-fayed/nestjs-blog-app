export interface IPayload {
  id: number;
  username: string;
}

export interface LoginResponse {
  user: {
    id: number;
    username: string;
    name: string;
    email: string;
  };
  auth_token: string;
  refresh_token: string;
}

export interface IRefreshTokenResponse {
  auth_token: string;
  refresh_token: string;
}

export interface IVerifyEmailResponse {
  status: string;
  message: string;
}
