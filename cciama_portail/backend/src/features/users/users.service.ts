import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../core/database/prisma.service';
import { AuthUser } from '../auth/auth.decorators';
import { displayName, publicUser } from '../auth/auth.service';
import { CreateUserDto, UpdateUserDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    const users = await this.prisma.user.findMany({ orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }] });
    return users.map(publicUser);
  }

  /** Le compte est créé avec un mot de passe provisoire ; l'e-mail est saisi à la première connexion. */
  async create(dto: CreateUserDto, actor: AuthUser) {
    const matricule = dto.matricule.trim();
    await this.assertMatriculeFree(matricule);
    const user = await this.prisma.user.create({
      data: {
        firstName: dto.firstName.trim(),
        lastName: dto.lastName.trim(),
        matricule,
        role: dto.role,
        passwordHash: await bcrypt.hash(dto.temporaryPassword, 10),
        mustChangePassword: true,
      },
    });
    await this.log(user.id, 'create', null, displayName(user), actor);
    return publicUser(user);
  }

  async update(id: string, dto: UpdateUserDto, actor: AuthUser) {
    const user = await this.get(id);
    const losesAdmin =
      user.role === 'ADMIN' && user.isActive && ((dto.role !== undefined && dto.role !== 'ADMIN') || dto.isActive === false);
    if (id === actor.id && (losesAdmin || dto.isActive === false)) {
      throw new BadRequestException('Vous ne pouvez pas retirer vos propres droits ni désactiver votre compte.');
    }
    if (losesAdmin) await this.assertAnotherAdmin(id);
    const matricule = dto.matricule?.trim();
    if (matricule !== undefined && matricule !== user.matricule) await this.assertMatriculeFree(matricule, id);

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        firstName: dto.firstName?.trim(),
        lastName: dto.lastName?.trim(),
        matricule,
        role: dto.role,
        isActive: dto.isActive,
      },
    });
    await this.log(id, 'update', displayName(user), displayName(updated), actor);
    return publicUser(updated);
  }

  /** Nouveau mot de passe provisoire : l'utilisateur devra le remplacer à sa prochaine connexion. */
  async resetPassword(id: string, temporaryPassword: string, actor: AuthUser) {
    const user = await this.get(id);
    await this.prisma.user.update({
      where: { id },
      data: { passwordHash: await bcrypt.hash(temporaryPassword, 10), mustChangePassword: true },
    });
    await this.log(id, 'reset_password', null, displayName(user), actor);
    return { success: true };
  }

  async remove(id: string, actor: AuthUser) {
    if (id === actor.id) {
      throw new BadRequestException('Vous ne pouvez pas supprimer votre propre compte.');
    }
    const user = await this.get(id);
    if (user.role === 'ADMIN' && user.isActive) await this.assertAnotherAdmin(id);
    await this.prisma.user.delete({ where: { id } });
    await this.log(id, 'delete', displayName(user), null, actor);
    return { success: true };
  }

  private async get(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');
    return user;
  }

  private async assertMatriculeFree(matricule: string, exceptId?: string) {
    const taken = await this.prisma.user.findFirst({
      where: { matricule: { equals: matricule, mode: 'insensitive' }, ...(exceptId ? { NOT: { id: exceptId } } : {}) },
    });
    if (taken) throw new ConflictException(`Le matricule ${matricule} est déjà attribué.`);
  }

  /** Empêche de se retrouver sans aucun administrateur actif. */
  private async assertAnotherAdmin(exceptId: string) {
    const others = await this.prisma.user.count({ where: { role: 'ADMIN', isActive: true, NOT: { id: exceptId } } });
    if (others === 0) throw new BadRequestException('Il doit rester au moins un administrateur actif.');
  }

  private log(entityId: string, field: string, oldValue: string | null, newValue: string | null, actor: AuthUser) {
    return this.prisma.contentUpdateHistory.create({
      data: { entityType: 'user', entityId, field, oldValue, newValue, updatedBy: actor.name },
    });
  }
}
