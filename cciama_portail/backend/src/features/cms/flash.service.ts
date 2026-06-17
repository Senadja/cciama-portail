import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { SseService } from '../../core/sse/sse.service';

export interface CreateFlashDto {
  severity: string;
  label: string;
  text: string;
  active?: boolean;
  orderIndex?: number;
}

@Injectable()
export class FlashService {
  constructor(
    private prisma: PrismaService,
    private sseService: SseService
  ) {}

  async getAll() {
    return this.prisma.flashInfo.findMany({
      orderBy: { orderIndex: 'asc' }
    });
  }

  async create(dto: CreateFlashDto, username: string = 'admin') {
    const orderIndex = dto.orderIndex ?? (await this.prisma.flashInfo.count());

    const item = await this.prisma.flashInfo.create({
      data: {
        ...dto,
        orderIndex,
        updatedBy: username
      }
    });

    await this.prisma.contentUpdateHistory.create({
      data: {
        entityType: 'flash_info',
        entityId: item.id,
        field: 'create',
        newValue: item.label,
        updatedBy: username
      }
    });

    this.sseService.emitContentUpdate('flash_info', item.id);
    return item;
  }

  async update(id: string, dto: Partial<CreateFlashDto>, username: string = 'admin') {
    const existing = await this.prisma.flashInfo.findUnique({ where: { id } });
    if (!existing) {
      throw new Error(`FlashInfo with ID ${id} not found`);
    }

    const updated = await this.prisma.flashInfo.update({
      where: { id },
      data: {
        ...dto,
        updatedBy: username
      }
    });

    await this.prisma.contentUpdateHistory.create({
      data: {
        entityType: 'flash_info',
        entityId: id,
        field: 'update',
        oldValue: existing.label,
        newValue: updated.label,
        updatedBy: username
      }
    });

    this.sseService.emitContentUpdate('flash_info', id);
    return updated;
  }

  async delete(id: string, username: string = 'admin') {
    const existing = await this.prisma.flashInfo.findUnique({ where: { id } });
    if (!existing) {
      throw new Error(`FlashInfo with ID ${id} not found`);
    }

    await this.prisma.flashInfo.delete({ where: { id } });

    await this.prisma.contentUpdateHistory.create({
      data: {
        entityType: 'flash_info',
        entityId: id,
        field: 'delete',
        oldValue: existing.label,
        updatedBy: username
      }
    });

    this.sseService.emitContentUpdate('flash_info', id);
  }

  async reorder(ids: string[], username: string = 'admin') {
    for (let i = 0; i < ids.length; i++) {
      await this.prisma.flashInfo.update({
        where: { id: ids[i] },
        data: {
          orderIndex: i,
          updatedBy: username
        }
      });
    }
    this.sseService.emitContentUpdate('flash_info', 'reorder');
  }
}
