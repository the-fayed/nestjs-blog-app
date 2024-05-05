import { Expose } from 'class-transformer';
import { ISignUpResponse } from '../auth.interface';

export class SignUpDto implements ISignUpResponse {
  @Expose()
  status: 'success' | 'error';

  @Expose()
  message: string;
}
