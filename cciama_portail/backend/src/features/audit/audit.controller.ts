import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { Roles } from '../auth/auth.decorators';

@Controller('admin/logs')
@Roles('ADMIN')
export class AuditController {
  constructor(private readonly prisma: PrismaService) {}

  /** Journal d'activité, du plus récent au plus ancien. */
  @Get()
  async list(@Query('page') page = '1', @Query('pageSize') pageSize = '30') {
    const size = Math.min(Math.max(parseInt(pageSize, 10) || 30, 1), 100);
    const current = Math.max(parseInt(page, 10) || 1, 1);
    const [items, total] = await this.prisma.$transaction([
      this.prisma.contentUpdateHistory.findMany({
        orderBy: { updatedAt: 'desc' },
        skip: (current - 1) * size,
        take: size,
      }),
      this.prisma.contentUpdateHistory.count(),
    ]);
    return { items, total, page: current, pageSize: size };
  }
}
