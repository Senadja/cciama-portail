import { SetMetadata, createParamDecorator, ExecutionContext } from '@nestjs/common';

export type Role = 'ADMIN' | 'EDITOR';
export const ROLE_VALUES: Role[] = ['ADMIN', 'EDITOR'];

/** Identité de l'appelant, rechargée depuis la base à chaque requête (voir JwtStrategy). */
export interface AuthUser {
  id: string;
  role: Role;
  /** « Prénom Nom », à défaut l'e-mail ou le matricule : c'est ce qui signe le journal. */
  name: string;
  mustChangePassword: boolean;
}

export const IS_PUBLIC_KEY = 'isPublic';
/** Route accessible sans connexion (lectures du portail public). */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const ROLES_KEY = 'roles';
/** Restreint une route ou un contrôleur à certains rôles. */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const ALLOW_INCOMPLETE_KEY = 'allowIncompleteAccount';
/** Route utilisable avec un mot de passe provisoire (finalisation du compte). */
export const AllowIncompleteAccount = () => SetMetadata(ALLOW_INCOMPLETE_KEY, true);

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AuthUser => ctx.switchToHttp().getRequest().user,
);
