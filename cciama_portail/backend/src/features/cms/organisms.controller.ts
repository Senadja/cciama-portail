import { Controller, Get, Post, Put, Delete, Param, Body, BadRequestException } from '@nestjs/common';
import { OrganismsService, CreateOrganismDto } from './organisms.service';
import { Unprotected } from 'nest-keycloak-connect';

@Controller('content/organisms')
@Unprotected()
export class OrganismsController {
  constructor(private readonly organismsService: OrganismsService) {}

  @Get()
  async getOrganisms() {
    return this.organismsService.getAll();
  }

  @Post()
  async createOrganism(@Body() dto: CreateOrganismDto) {
    try {
      return await this.organismsService.create(dto);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put('reorder')
  async reorderOrganisms(@Body('ids') ids: string[]) {
    if (!ids || !Array.isArray(ids)) {
      throw new BadRequestException('An array of ids is required');
    }
    try {
      await this.organismsService.reorder(ids);
      return { success: true };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put(':id')
  async updateOrganism(@Param('id') id: string, @Body() dto: Partial<CreateOrganismDto>) {
    try {
      return await this.organismsService.update(id, dto);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Delete(':id')
  async deleteOrganism(@Param('id') id: string) {
    try {
      await this.organismsService.delete(id);
      return { success: true };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }
}
