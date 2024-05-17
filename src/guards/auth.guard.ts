import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import {
  UnauthorizedException,
  ExecutionContext,
  CanActivate,
  Injectable,
} from '@nestjs/common';

import { IUser, UserService } from '../user';
import { IJwtPayload } from '../auth';
// import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // extracting token from header
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      return false;
    }
    // verifying token
    const payload: IJwtPayload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    // verify that user still exists
    const user: IUser = await this.userService.findOne(payload.id);
    if (!user) {
      return false;
    }
    // check if password has been changed
    if (user.passwordChangedAt !== null) {
      const passwordChangedAtTimestamp =
        parseInt(user.passwordChangedAt.getTime().toString(), 10) / 1000;
      if (passwordChangedAtTimestamp > payload.iat) {
        throw new UnauthorizedException(
          'Password has been changed. Please login again!',
        );
      }
    }
    request['user'] = user;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
