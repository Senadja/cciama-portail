import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { SseService } from '../../core/sse/sse.service';

export interface CreateNewsDto {
  cat: string;
  catLabel: string;
  date: string;
  dateShort: string;
  title: string;
  excerpt: string;
  body: string;
  author: string;
  readTime: string;
  image?: string;
  published?: boolean;
  orderIndex?: number;
}

@Injectable()
export class NewsService {
  constructor(
    private prisma: PrismaService,
    private sseService: SseService
  ) {}

  async getAll() {
    return this.prisma.newsArticle.findMany({
      orderBy: { orderIndex: 'asc' }
    });
  }

  async create(dto: CreateNewsDto, username: string = 'admin') {
    const orderIndex = dto.orderIndex ?? (await this.prisma.newsArticle.count());

    const item = await this.prisma.newsArticle.create({
      data: {
        ...dto,
        orderIndex,
        updatedBy: username
      }
    });

    await this.prisma.contentUpdateHistory.create({
      data: {
        entityType: 'news_article',
        entityId: item.id,
        field: 'create',
        newValue: item.title,
        updatedBy: username
      }
    });

    this.sseService.emitContentUpdate('news_article', item.id);
    return item;
  }

  async update(id: string, dto: Partial<CreateNewsDto>, username: string = 'admin') {
    const existing = await this.prisma.newsArticle.findUnique({ where: { id } });
    if (!existing) {
      throw new Error(`NewsArticle with ID ${id} not found`);
    }

    const updated = await this.prisma.newsArticle.update({
      where: { id },
      data: {
        ...dto,
        updatedBy: username
      }
    });

    await this.prisma.contentUpdateHistory.create({
      data: {
        entityType: 'news_article',
        entityId: id,
        field: 'update',
        oldValue: existing.title,
        newValue: updated.title,
        updatedBy: username
      }
    });

    this.sseService.emitContentUpdate('news_article', id);
    return updated;
  }

  async delete(id: string, username: string = 'admin') {
    const existing = await this.prisma.newsArticle.findUnique({ where: { id } });
    if (!existing) {
      throw new Error(`NewsArticle with ID ${id} not found`);
    }

    await this.prisma.newsArticle.delete({ where: { id } });

    await this.prisma.contentUpdateHistory.create({
      data: {
        entityType: 'news_article',
        entityId: id,
        field: 'delete',
        oldValue: existing.title,
        updatedBy: username
      }
    });

    this.sseService.emitContentUpdate('news_article', id);
  }

  async reorder(ids: string[], username: string = 'admin') {
    for (let i = 0; i < ids.length; i++) {
      await this.prisma.newsArticle.update({
        where: { id: ids[i] },
        data: {
          orderIndex: i,
          updatedBy: username
        }
      });
    }
    this.sseService.emitContentUpdate('news_article', 'reorder');
  }
}
