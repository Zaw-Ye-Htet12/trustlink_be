import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../enums/user-role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no roles are required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Extract user from request
    const request = context
      .switchToHttp()
      .getRequest<{ user?: { role?: UserRole } }>();
    const user = request.user;

    // If user not found or has no role, deny access
    if (!user || !user.role) {
      return false;
    }

    // Check if the user's role is among the required roles
    return requiredRoles.includes(user.role);
  }
}
