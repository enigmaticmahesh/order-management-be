import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/allowed-roles.decorator';
import { UserRole } from '../authcore.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true; // For public routes
    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException('Unauthenticated user');
    }

    const hasReqRole = requiredRoles.some((role) => user.role === role);
    if (!hasReqRole) {
      throw new ForbiddenException('Unauthorized user');
    }
    return true;
  }
}
