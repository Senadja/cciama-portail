import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { SseService } from '../../core/sse/sse.service';

export interface CreateDocumentDto {
  type: string;
  typeLabel: string;
  ref: string;
  date: string;
  title: string;
  summary: string;
  pages: number;
  size: string;
  fileUrl?: string;
  published?: boolean;
  orderIndex?: number;
}

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private sseService: SseService
  ) {}

  async getAll() {
    return this.prisma.officialDocument.findMany({
      orderBy: { orderIndex: 'asc' }
    });
  }

  async create(dto: CreateDocumentDto, username: string = 'admin') {
    const orderIndex = dto.orderIndex ?? (await this.prisma.officialDocument.count());

    const item = await this.prisma.officialDocument.create({
      data: {
        ...dto,
        orderIndex,
        updatedBy: username
      }
    });

    await this.prisma.contentUpdateHistory.create({
      data: {
        entityType: 'official_document',
        entityId: item.id,
        field: 'create',
        newValue: item.title,
        updatedBy: username
      }
    });

    this.sseService.emitContentUpdate('official_document', item.id);
    return item;
  }

  async update(id: string, dto: Partial<CreateDocumentDto>, username: string = 'admin') {
    const existing = await this.prisma.officialDocument.findUnique({ where: { id } });
    if (!existing) {
      throw new Error(`OfficialDocument with ID ${id} not found`);
    }

    const updated = await this.prisma.officialDocument.update({
      where: { id },
      data: {
        ...dto,
        updatedBy: username
      }
    });

    await this.prisma.contentUpdateHistory.create({
      data: {
        entityType: 'official_document',
        entityId: id,
        field: 'update',
        oldValue: existing.title,
        newValue: updated.title,
        updatedBy: username
      }
    });

    this.sseService.emitContentUpdate('official_document', id);
    return updated;
  }

  async delete(id: string, username: string = 'admin') {
    const existing = await this.prisma.officialDocument.findUnique({ where: { id } });
    if (!existing) {
      throw new Error(`OfficialDocument with ID ${id} not found`);
    }

    await this.prisma.officialDocument.delete({ where: { id } });

    await this.prisma.contentUpdateHistory.create({
      data: {
        entityType: 'official_document',
        entityId: id,
        field: 'delete',
        oldValue: existing.title,
        updatedBy: username
      }
    });

    this.sseService.emitContentUpdate('official_document', id);
  }

  async reorder(ids: string[], username: string = 'admin') {
    for (let i = 0; i < ids.length; i++) {
      await this.prisma.officialDocument.update({
        where: { id: ids[i] },
        data: {
          orderIndex: i,
          updatedBy: username
        }
      });
    }
    this.sseService.emitContentUpdate('official_document', 'reorder');
  }
}
