import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { SseService } from '../../core/sse/sse.service';

export interface CreateMissionDto {
  num: string;
  title: string;
  desc: string;
  orderIndex: number;
}

@Injectable()
export class MissionsService implements OnModuleInit {
  private readonly logger = new Logger(MissionsService.name);

  constructor(
    private prisma: PrismaService,
    private sseService: SseService
  ) {}

  async onModuleInit() {
    try {
      await this.seedDefaultContent();
    } catch (err) {
      this.logger.warn(`seedDefaultContent skipped: ${err?.message ?? err}`);
    }
  }

  private async seedDefaultContent() {
    const count = await this.prisma.institutionMission.count();
    if (count === 0) {
      const defaults = [
        { num: '01', title: 'Représentation et Défense', desc: "Représenter et défendre les intérêts des commerçants, industriels, agriculteurs, miniers et artisans auprès des pouvoirs publics.", orderIndex: 0 },
        { num: '02', title: 'Interface Publique/Privée', desc: "Servir d'interface entre l'État et les opérateurs économiques pour un dialogue constructif et permanent.", orderIndex: 1 },
        { num: '03', title: 'Avis et Recommandations', desc: "Fournir aux pouvoirs publics des avis sur les questions économiques, sociales, juridiques, fiscales et administratives.", orderIndex: 2 },
        { num: '04', title: 'Climat des Affaires', desc: "Contribuer activement à l'amélioration du climat des affaires et à la création d'emplois au niveau national.", orderIndex: 3 },
        { num: '05', title: 'Développement Durable', desc: "Appuyer le développement économique durable dans les secteurs de l'agriculture, du commerce et des industries extractives.", orderIndex: 4 },
        { num: '06', title: 'Accompagnement', desc: "Soutenir la structuration des PME/PMI, avec une attention particulière pour les femmes et les jeunes entrepreneurs.", orderIndex: 5 }
      ];

      for (const d of defaults) {
        await this.prisma.institutionMission.create({
          data: {
            ...d,
            updatedBy: 'system'
          }
        });
      }
      this.logger.log('Seeded default missions list');
    }
  }

  async getAllMissions() {
    return this.prisma.institutionMission.findMany({
      orderBy: { orderIndex: 'asc' }
    });
  }

  async createMission(dto: CreateMissionDto, username: string = 'admin') {
    const mission = await this.prisma.institutionMission.create({
      data: {
        ...dto,
        updatedBy: username
      }
    });

    await this.prisma.contentUpdateHistory.create({
      data: {
        entityType: 'institution_mission',
        entityId: mission.id,
        field: 'create',
        newValue: mission.title,
        updatedBy: username
      }
    });

    this.sseService.emitContentUpdate('institution_mission', mission.id);
    return mission;
  }

  async updateMission(id: string, dto: Partial<CreateMissionDto>, username: string = 'admin') {
    const existing = await this.prisma.institutionMission.findUnique({ where: { id } });
    if (!existing) {
      throw new Error(`Mission with ID ${id} not found`);
    }

    const updated = await this.prisma.institutionMission.update({
      where: { id },
      data: {
        ...dto,
        updatedBy: username
      }
    });

    await this.prisma.contentUpdateHistory.create({
      data: {
        entityType: 'institution_mission',
        entityId: id,
        field: 'update',
        oldValue: existing.title,
        newValue: updated.title,
        updatedBy: username
      }
    });

    this.sseService.emitContentUpdate('institution_mission', id);
    return updated;
  }

  async deleteMission(id: string, username: string = 'admin') {
    const existing = await this.prisma.institutionMission.findUnique({ where: { id } });
    if (!existing) {
      throw new Error(`Mission with ID ${id} not found`);
    }

    await this.prisma.institutionMission.delete({ where: { id } });

    await this.prisma.contentUpdateHistory.create({
      data: {
        entityType: 'institution_mission',
        entityId: id,
        field: 'delete',
        oldValue: existing.title,
        updatedBy: username
      }
    });

    this.sseService.emitContentUpdate('institution_mission', id);
  }

  async reorderMissions(ids: string[], username: string = 'admin') {
    for (let i = 0; i < ids.length; i++) {
      await this.prisma.institutionMission.update({
        where: { id: ids[i] },
        data: {
          orderIndex: i,
          updatedBy: username
        }
      });
    }
    this.sseService.emitContentUpdate('institution_mission', 'reorder');
  }
}
