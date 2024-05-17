import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { AuthGuard, RoleGuard } from '../guards';
import { UserRoles } from '../user';

export const Auth = (...roles: UserRoles[]) => {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RoleGuard),
  );
};
