import { Expose } from 'class-transformer';

export class RefreshTokenResponseDto {
  @Expose()
  refresh_token: string;

  @Expose()
  auth_token: string;
}
