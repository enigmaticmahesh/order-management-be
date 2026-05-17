import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../authcore.interface';

export const ROLES_KEY = 'roles';
export const AllowedRoles = (...roles: UserRole[]) =>
  SetMetadata(ROLES_KEY, roles);
