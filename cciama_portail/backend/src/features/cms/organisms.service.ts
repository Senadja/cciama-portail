import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { SseService } from '../../core/sse/sse.service';

export interface CreateOrganismDto {
  kind: string;
  name: string;
  short: string;
  url: string;
  color: string;
  mark: string;
  published?: boolean;
  orderIndex?: number;
}

@Injectable()
export class OrganismsService {
  constructor(
    private prisma: PrismaService,
    private sseService: SseService
  ) {}

  async getAll() {
    return this.prisma.organism.findMany({
      orderBy: { orderIndex: 'asc' }
    });
  }

  async create(dto: CreateOrganismDto, username: string = 'admin') {
    const orderIndex = dto.orderIndex ?? (await this.prisma.organism.count());

    const item = await this.prisma.organism.create({
      data: {
        ...dto,
        orderIndex,
        updatedBy: username
      }
    });

    await this.prisma.contentUpdateHistory.create({
      data: {
        entityType: 'organism',
        entityId: item.id,
        field: 'create',
        newValue: item.name,
        updatedBy: username
      }
    });

    this.sseService.emitContentUpdate('organism', item.id);
    return item;
  }

  async update(id: string, dto: Partial<CreateOrganismDto>, username: string = 'admin') {
    const existing = await this.prisma.organism.findUnique({ where: { id } });
    if (!existing) {
      throw new Error(`Organism with ID ${id} not found`);
    }

    const updated = await this.prisma.organism.update({
      where: { id },
      data: {
        ...dto,
        updatedBy: username
      }
    });

    await this.prisma.contentUpdateHistory.create({
      data: {
        entityType: 'organism',
        entityId: id,
        field: 'update',
        oldValue: existing.name,
        newValue: updated.name,
        updatedBy: username
      }
    });

    this.sseService.emitContentUpdate('organism', id);
    return updated;
  }

  async delete(id: string, username: string = 'admin') {
    const existing = await this.prisma.organism.findUnique({ where: { id } });
    if (!existing) {
      throw new Error(`Organism with ID ${id} not found`);
    }

    await this.prisma.organism.delete({ where: { id } });

    await this.prisma.contentUpdateHistory.create({
      data: {
        entityType: 'organism',
        entityId: id,
        field: 'delete',
        oldValue: existing.name,
        updatedBy: username
      }
    });

    this.sseService.emitContentUpdate('organism', id);
  }

  async reorder(ids: string[], username: string = 'admin') {
    for (let i = 0; i < ids.length; i++) {
      await this.prisma.organism.update({
        where: { id: ids[i] },
        data: {
          orderIndex: i,
          updatedBy: username
        }
      });
    }
    this.sseService.emitContentUpdate('organism', 'reorder');
  }
}
