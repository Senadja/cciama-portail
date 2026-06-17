import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { SseService } from '../../core/sse/sse.service';

export interface CreateProjectDto {
  status: string;
  statusLabel: string;
  title: string;
  period: string;
  budget: string;
  partner: string;
  progress: number;
  desc: string;
  published?: boolean;
  orderIndex?: number;
}

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private sseService: SseService
  ) {}

  async getAll() {
    return this.prisma.project.findMany({
      orderBy: { orderIndex: 'asc' }
    });
  }

  async create(dto: CreateProjectDto, username: string = 'admin') {
    const orderIndex = dto.orderIndex ?? (await this.prisma.project.count());

    const item = await this.prisma.project.create({
      data: {
        ...dto,
        orderIndex,
        updatedBy: username
      }
    });

    await this.prisma.contentUpdateHistory.create({
      data: {
        entityType: 'project',
        entityId: item.id,
        field: 'create',
        newValue: item.title,
        updatedBy: username
      }
    });

    this.sseService.emitContentUpdate('project', item.id);
    return item;
  }

  async update(id: string, dto: Partial<CreateProjectDto>, username: string = 'admin') {
    const existing = await this.prisma.project.findUnique({ where: { id } });
    if (!existing) {
      throw new Error(`Project with ID ${id} not found`);
    }

    const updated = await this.prisma.project.update({
      where: { id },
      data: {
        ...dto,
        updatedBy: username
      }
    });

    await this.prisma.contentUpdateHistory.create({
      data: {
        entityType: 'project',
        entityId: id,
        field: 'update',
        oldValue: existing.title,
        newValue: updated.title,
        updatedBy: username
      }
    });

    this.sseService.emitContentUpdate('project', id);
    return updated;
  }

  async delete(id: string, username: string = 'admin') {
    const existing = await this.prisma.project.findUnique({ where: { id } });
    if (!existing) {
      throw new Error(`Project with ID ${id} not found`);
    }

    await this.prisma.project.delete({ where: { id } });

    await this.prisma.contentUpdateHistory.create({
      data: {
        entityType: 'project',
        entityId: id,
        field: 'delete',
        oldValue: existing.title,
        updatedBy: username
      }
    });

    this.sseService.emitContentUpdate('project', id);
  }

  async reorder(ids: string[], username: string = 'admin') {
    for (let i = 0; i < ids.length; i++) {
      await this.prisma.project.update({
        where: { id: ids[i] },
        data: {
          orderIndex: i,
          updatedBy: username
        }
      });
    }
    this.sseService.emitContentUpdate('project', 'reorder');
  }
}
