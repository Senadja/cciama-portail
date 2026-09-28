import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { SseService } from '../../core/sse/sse.service';

export interface CreateOrganigramNodeDto {
  role: string;
  name: string;
  parentId?: string | null;
  orderIndex: number;
}

@Injectable()
export class OrganigramService {
  constructor(
    private prisma: PrismaService,
    private sseService: SseService
  ) {}

  async getOrganigram() {
    return this.prisma.organigramNode.findMany({
      orderBy: { orderIndex: 'asc' }
    });
  }

  async getChildCountRecursive(id: string): Promise<number> {
    const children = await this.prisma.organigramNode.findMany({
      where: { parentId: id }
    });
    
    let count = children.length;
    for (const child of children) {
      count += await this.getChildCountRecursive(child.id);
    }
    return count;
  }

  async createNode(dto: CreateOrganigramNodeDto, username: string = 'admin') {
    const node = await this.prisma.organigramNode.create({
      data: {
        role: dto.role,
        name: dto.name,
        parentId: dto.parentId || null,
        orderIndex: dto.orderIndex,
        updatedBy: username
      }
    });

    await this.prisma.contentUpdateHistory.create({
      data: {
        entityType: 'organigram_node',
        entityId: node.id,
        field: 'create',
        newValue: `${node.role} - ${node.name}`,
        updatedBy: username
      }
    });

    this.sseService.emitContentUpdate('organigram_node', node.id);
    return node;
  }

  async updateNode(id: string, dto: Partial<CreateOrganigramNodeDto>, username: string = 'admin') {
    const existing = await this.prisma.organigramNode.findUnique({ where: { id } });
    if (!existing) {
      throw new Error(`Organigram node with ID ${id} not found`);
    }

    const updated = await this.prisma.organigramNode.update({
      where: { id },
      data: {
        role: dto.role,
        name: dto.name,
        parentId: dto.parentId === undefined ? existing.parentId : (dto.parentId || null),
        orderIndex: dto.orderIndex === undefined ? existing.orderIndex : dto.orderIndex,
        updatedBy: username
      }
    });

    await this.prisma.contentUpdateHistory.create({
      data: {
        entityType: 'organigram_node',
        entityId: id,
        field: 'update',
        oldValue: `${existing.role} - ${existing.name}`,
        newValue: `${updated.role} - ${updated.name}`,
        updatedBy: username
      }
    });

    this.sseService.emitContentUpdate('organigram_node', id);
    return updated;
  }

  async deleteNode(id: string, username: string = 'admin') {
    const existing = await this.prisma.organigramNode.findUnique({ where: { id } });
    if (!existing) {
      throw new Error(`Organigram node with ID ${id} not found`);
    }

    // Capture the count of children that will be deleted
    const count = await this.getChildCountRecursive(id);

    // Delete node (onDelete: Cascade in schema will handle recursive DB deletion of child nodes)
    await this.prisma.organigramNode.delete({ where: { id } });

    await this.prisma.contentUpdateHistory.create({
      data: {
        entityType: 'organigram_node',
        entityId: id,
        field: 'delete',
        oldValue: `${existing.role} - ${existing.name} (deleted along with ${count} children)`,
        updatedBy: username
      }
    });

    this.sseService.emitContentUpdate('organigram_node', id);
    return { count };
  }
}
