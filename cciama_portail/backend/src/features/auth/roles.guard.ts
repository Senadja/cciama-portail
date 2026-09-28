import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthUser, Role, ROLES_KEY } from './auth.decorators';

/** Garde globale, après JwtAuthGuard : applique les restrictions @Roles(). */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    const user: AuthUser | undefined = context.switchToHttp().getRequest().user;
    // Pas de restriction, ou route publique (aucun utilisateur n'a été chargé).
    if (!roles?.length || !user) return true;
    if (!roles.includes(user.role)) {
      throw new ForbiddenException('Droits insuffisants pour cette action.');
    }
    return true;
  }
}
