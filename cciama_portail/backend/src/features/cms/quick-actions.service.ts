import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { SseService } from '../../core/sse/sse.service';

export interface CreateQuickActionDto {
  ic: string;
  title: string;
  desc: string;
  link?: string;
  published?: boolean;
  orderIndex?: number;
}

@Injectable()
export class QuickActionsService {
  constructor(
    private prisma: PrismaService,
    private sseService: SseService
  ) {}

  async getAll() {
    return this.prisma.quickAction.findMany({
      orderBy: { orderIndex: 'asc' }
    });
  }

  async create(dto: CreateQuickActionDto, username: string = 'admin') {
    const orderIndex = dto.orderIndex ?? (await this.prisma.quickAction.count());

    const item = await this.prisma.quickAction.create({
      data: {
        ...dto,
        orderIndex,
        updatedBy: username
      }
    });

    await this.prisma.contentUpdateHistory.create({
      data: {
        entityType: 'quick_action',
        entityId: item.id,
        field: 'create',
        newValue: item.title,
        updatedBy: username
      }
    });

    this.sseService.emitContentUpdate('quick_action', item.id);
    return item;
  }

  async update(id: string, dto: Partial<CreateQuickActionDto>, username: string = 'admin') {
    const existing = await this.prisma.quickAction.findUnique({ where: { id } });
    if (!existing) {
      throw new Error(`QuickAction with ID ${id} not found`);
    }

    const updated = await this.prisma.quickAction.update({
      where: { id },
      data: {
        ...dto,
        updatedBy: username
      }
    });

    await this.prisma.contentUpdateHistory.create({
      data: {
        entityType: 'quick_action',
        entityId: id,
        field: 'update',
        oldValue: existing.title,
        newValue: updated.title,
        updatedBy: username
      }
    });

    this.sseService.emitContentUpdate('quick_action', id);
    return updated;
  }

  async delete(id: string, username: string = 'admin') {
    const existing = await this.prisma.quickAction.findUnique({ where: { id } });
    if (!existing) {
      throw new Error(`QuickAction with ID ${id} not found`);
    }

    await this.prisma.quickAction.delete({ where: { id } });

    await this.prisma.contentUpdateHistory.create({
      data: {
        entityType: 'quick_action',
        entityId: id,
        field: 'delete',
        oldValue: existing.title,
        updatedBy: username
      }
    });

    this.sseService.emitContentUpdate('quick_action', id);
  }

  async reorder(ids: string[], username: string = 'admin') {
    for (let i = 0; i < ids.length; i++) {
      await this.prisma.quickAction.update({
        where: { id: ids[i] },
        data: {
          orderIndex: i,
          updatedBy: username
        }
      });
    }
    this.sseService.emitContentUpdate('quick_action', 'reorder');
  }
}
