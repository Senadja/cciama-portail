import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../core/database/prisma.service';
import { AuthUser, Role } from './auth.decorators';

/** « Prénom Nom », à défaut l'e-mail ou le matricule. */
export function displayName(u: Pick<User, 'firstName' | 'lastName' | 'email' | 'matricule'>): string {
  return [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email || u.matricule || 'Utilisateur';
}

export function toAuthUser(u: User): AuthUser {
  return { id: u.id, role: u.role as Role, name: displayName(u), mustChangePassword: u.mustChangePassword };
}

/** Ce qu'on expose d'un compte : jamais l'empreinte du mot de passe. */
export function publicUser(u: User) {
  const { passwordHash: _hash, ...rest } = u;
  return rest;
}

const BOOTSTRAP_EMAIL = 'admin@cciama-tchad.com';
const BOOTSTRAP_PASSWORD = 'admin123';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Compte d'amorçage, créé uniquement s'il n'existe aucun administrateur. Son mot de
   * passe est provisoire : il doit être remplacé dès la première connexion.
   */
  async onModuleInit() {
    try {
      if ((await this.prisma.user.count({ where: { role: 'ADMIN' } })) > 0) return;
      await this.prisma.user.create({
        data: {
          email: BOOTSTRAP_EMAIL,
          passwordHash: await bcrypt.hash(BOOTSTRAP_PASSWORD, 10),
          role: 'ADMIN',
          firstName: 'Admin',
          lastName: 'System',
          mustChangePassword: true,
        },
      });
      this.logger.warn(`Aucun administrateur : compte d'amorçage ${BOOTSTRAP_EMAIL} créé, mot de passe provisoire à changer.`);
    } catch (error) {
      this.logger.error("Échec de la création du compte d'amorçage", error);
    }
  }

  /** Connexion par e-mail ou par matricule. */
  async login(identifier: string, password: string) {
    const id = identifier.trim();
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: id, mode: 'insensitive' } },
          { matricule: { equals: id, mode: 'insensitive' } },
        ],
      },
    });
    if (!user || !user.isActive || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Identifiant ou mot de passe incorrect.');
    }
    return this.session(user);
  }

  async me(userId: string) {
    return publicUser(await this.prisma.user.findUniqueOrThrow({ where: { id: userId } }));
  }

  async completeAccount(userId: string, email: string, newPassword: string) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (!user.mustChangePassword) {
      throw new BadRequestException('Ce compte est déjà complet.');
    }
    const normalized = email.trim().toLowerCase();
    const taken = await this.prisma.user.findFirst({
      where: { email: { equals: normalized, mode: 'insensitive' }, NOT: { id: userId } },
    });
    if (taken) {
      throw new ConflictException('Cette adresse e-mail est déjà utilisée par un autre compte.');
    }
    if (await bcrypt.compare(newPassword, user.passwordHash)) {
      throw new BadRequestException('Choisissez un mot de passe différent du mot de passe provisoire.');
    }
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { email: normalized, passwordHash: await bcrypt.hash(newPassword, 10), mustChangePassword: false },
    });
    await this.prisma.contentUpdateHistory.create({
      data: {
        entityType: 'user',
        entityId: userId,
        field: 'complete_account',
        newValue: displayName(updated),
        updatedBy: displayName(updated),
      },
    });
    return this.session(updated);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    // 400 et non 401 : une faute de frappe ne doit pas déconnecter l'utilisateur.
    if (!(await bcrypt.compare(currentPassword, user.passwordHash))) {
      throw new BadRequestException('Mot de passe actuel incorrect.');
    }
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: await bcrypt.hash(newPassword, 10) },
    });
    return { success: true };
  }

  private session(user: User) {
    return { access_token: this.jwtService.sign({ sub: user.id }), user: publicUser(user) };
  }
}
