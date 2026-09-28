import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ALLOW_INCOMPLETE_KEY, IS_PUBLIC_KEY } from './auth.decorators';

/**
 * Garde globale : toute route exige un jeton valide, sauf celles marquées @Public().
 * Un compte au mot de passe provisoire n'accède qu'aux routes @AllowIncompleteAccount().
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    if (this.flag(IS_PUBLIC_KEY, context)) return true;
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, _info: any, context: ExecutionContext) {
    if (err || !user) {
      throw err || new UnauthorizedException('Connexion requise.');
    }
    if (user.mustChangePassword && !this.flag(ALLOW_INCOMPLETE_KEY, context)) {
      throw new ForbiddenException('Complétez votre compte avant de continuer.');
    }
    return user;
  }

  private flag(key: string, context: ExecutionContext): boolean {
    return !!this.reflector.getAllAndOverride<boolean>(key, [context.getHandler(), context.getClass()]);
  }
}
