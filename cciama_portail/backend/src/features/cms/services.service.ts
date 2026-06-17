import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../core/database/prisma.service';
import { SseService } from '../../core/sse/sse.service';

export interface ServiceScreen {
  name: string;
  description: string;
}

export interface ServiceDataField {
  name: string;
  type: string;
  source: string;
}

export interface ServiceIntegration {
  name: string;
  description: string;
}

export interface UpsertServiceDto {
  code: string;
  title: string;
  tagline: string;
  familyId: string;
  beneficiaries: string;
  channels: string;
  targetDelay: string;
  phase: string;
  description: string;
  processSteps: string[];
  screens: ServiceScreen[];
  dataFields: ServiceDataField[];
  integrations: ServiceIntegration[];
  kpis: string[];
  businessRules: string[];
  orderIndex?: number;
  published?: boolean;
}

export interface UpdateFamilyDto {
  name?: string;
  description?: string;
  orderIndex?: number;
}

const asJson = (value: unknown) => value as Prisma.InputJsonValue;

@Injectable()
export class ServicesService {
  private readonly logger = new Logger(ServicesService.name);

  constructor(
    private prisma: PrismaService,
    private sseService: SseService,
  ) {}

  /** Public catalogue: families (ordered) with their services (ordered) nested. */
  async getCatalogue(publishedOnly = false) {
    return this.prisma.serviceFamily.findMany({
      orderBy: { orderIndex: 'asc' },
      include: {
        services: {
          where: publishedOnly ? { published: true } : undefined,
          orderBy: { orderIndex: 'asc' },
        },
      },
    });
  }

  /** Flat list of families (for editor dropdowns). */
  async getFamilies() {
    return this.prisma.serviceFamily.findMany({ orderBy: { orderIndex: 'asc' } });
  }

  async getServiceById(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: { family: true },
    });
    if (!service) {
      throw new NotFoundException(`Service ${id} introuvable`);
    }
    return service;
  }

  async getServiceByCode(code: string) {
    const service = await this.prisma.service.findUnique({
      where: { code: code.toUpperCase() },
      include: { family: true },
    });
    if (!service) {
      throw new NotFoundException(`Service ${code} introuvable`);
    }
    return service;
  }

  async createService(dto: UpsertServiceDto, username = 'admin') {
    const count = await this.prisma.service.count();
    const service = await this.prisma.service.create({
      data: {
        code: dto.code.toUpperCase(),
        title: dto.title,
        tagline: dto.tagline,
        familyId: dto.familyId,
        beneficiaries: dto.beneficiaries,
        channels: dto.channels,
        targetDelay: dto.targetDelay,
        phase: dto.phase,
        description: dto.description,
        processSteps: asJson(dto.processSteps ?? []),
        screens: asJson(dto.screens ?? []),
        dataFields: asJson(dto.dataFields ?? []),
        integrations: asJson(dto.integrations ?? []),
        kpis: asJson(dto.kpis ?? []),
        businessRules: asJson(dto.businessRules ?? []),
        orderIndex: dto.orderIndex ?? count,
        published: dto.published ?? true,
        updatedBy: username,
      },
    });

    await this.recordHistory('service', service.id, 'create', null, service.title, username);
    this.sseService.emitContentUpdate('service', service.id);
    return service;
  }

  async updateService(id: string, dto: Partial<UpsertServiceDto>, username = 'admin') {
    const existing = await this.prisma.service.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Service ${id} introuvable`);
    }

    const data: Prisma.ServiceUncheckedUpdateInput = { updatedBy: username };
    if (dto.code !== undefined) data.code = dto.code.toUpperCase();
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.tagline !== undefined) data.tagline = dto.tagline;
    if (dto.familyId !== undefined) data.familyId = dto.familyId;
    if (dto.beneficiaries !== undefined) data.beneficiaries = dto.beneficiaries;
    if (dto.channels !== undefined) data.channels = dto.channels;
    if (dto.targetDelay !== undefined) data.targetDelay = dto.targetDelay;
    if (dto.phase !== undefined) data.phase = dto.phase;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.processSteps !== undefined) data.processSteps = asJson(dto.processSteps);
    if (dto.screens !== undefined) data.screens = asJson(dto.screens);
    if (dto.dataFields !== undefined) data.dataFields = asJson(dto.dataFields);
    if (dto.integrations !== undefined) data.integrations = asJson(dto.integrations);
    if (dto.kpis !== undefined) data.kpis = asJson(dto.kpis);
    if (dto.businessRules !== undefined) data.businessRules = asJson(dto.businessRules);
    if (dto.orderIndex !== undefined) data.orderIndex = dto.orderIndex;
    if (dto.published !== undefined) data.published = dto.published;

    const updated = await this.prisma.service.update({ where: { id }, data });

    await this.recordHistory('service', id, 'update', existing.title, updated.title, username);
    this.sseService.emitContentUpdate('service', id);
    return updated;
  }

  async deleteService(id: string, username = 'admin') {
    const existing = await this.prisma.service.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Service ${id} introuvable`);
    }

    await this.prisma.service.delete({ where: { id } });
    await this.recordHistory('service', id, 'delete', existing.title, null, username);
    this.sseService.emitContentUpdate('service', id);
  }

  async reorderServices(ids: string[], username = 'admin') {
    for (let i = 0; i < ids.length; i++) {
      await this.prisma.service.update({
        where: { id: ids[i] },
        data: { orderIndex: i, updatedBy: username },
      });
    }
    this.sseService.emitContentUpdate('service', 'reorder');
  }

  async updateFamily(id: string, dto: UpdateFamilyDto, username = 'admin') {
    const existing = await this.prisma.serviceFamily.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Famille ${id} introuvable`);
    }

    const updated = await this.prisma.serviceFamily.update({
      where: { id },
      data: { ...dto, updatedBy: username },
    });

    await this.recordHistory('service_family', id, 'update', existing.name, updated.name, username);
    this.sseService.emitContentUpdate('service_family', id);
    return updated;
  }

  private async recordHistory(
    entityType: string,
    entityId: string,
    field: string,
    oldValue: string | null,
    newValue: string | null,
    username: string,
  ) {
    await this.prisma.contentUpdateHistory.create({
      data: { entityType, entityId, field, oldValue, newValue, updatedBy: username },
    });
  }
}
