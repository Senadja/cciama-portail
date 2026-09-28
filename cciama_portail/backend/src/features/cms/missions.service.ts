import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { SseService } from '../../core/sse/sse.service';

export interface CreateMissionDto {
  num: string;
  title: string;
  desc: string;
  orderIndex: number;
}

@Injectable()
export class MissionsService {
  constructor(
    private prisma: PrismaService,
    private sseService: SseService
  ) {}

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
