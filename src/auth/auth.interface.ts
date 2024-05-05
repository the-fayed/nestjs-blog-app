export interface IPayload {
  id: number;
  username: string;
}

export interface ISignUpResponse {
  status: 'success' | 'error';
  message: string;
}

export interface ILoginResponse {
  user: {
    id: number;
    username: string;
    name: string;
    email: string;
    role: string;
    emailVerified: boolean;
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
