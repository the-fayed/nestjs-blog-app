import { IVerifyEmailResponse } from '../auth.interface';

export class VerifyEmailTokenResponseDto implements IVerifyEmailResponse {
  status: 'success' | 'error';
  message: string;
}
