import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { JwtGuard, RoleGuard } from '../auth';
import { UserRoles } from '../user';

export const Auth = (...roles: UserRoles[]) => {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(JwtGuard, RoleGuard),
  );
};
