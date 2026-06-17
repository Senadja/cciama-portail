import { Controller, Get, Post, Put, Delete, Param, Body, BadRequestException } from '@nestjs/common';
import { Unprotected } from 'nest-keycloak-connect';
import { ServicesService, UpsertServiceDto, UpdateFamilyDto } from './services.service';

@Controller('content/services')
@Unprotected()
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  /** Public catalogue grouped by family. */
  @Get()
  async getCatalogue() {
    return this.servicesService.getCatalogue();
  }

  @Get('families')
  async getFamilies() {
    return this.servicesService.getFamilies();
  }

  @Get('code/:code')
  async getByCode(@Param('code') code: string) {
    return this.servicesService.getServiceByCode(code);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.servicesService.getServiceById(id);
  }

  @Post()
  async create(@Body() dto: UpsertServiceDto) {
    try {
      return await this.servicesService.createService(dto);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put('reorder')
  async reorder(@Body('ids') ids: string[]) {
    if (!ids || !Array.isArray(ids)) {
      throw new BadRequestException('An array of ids is required');
    }
    try {
      await this.servicesService.reorderServices(ids);
      return { success: true };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put('families/:id')
  async updateFamily(@Param('id') id: string, @Body() dto: UpdateFamilyDto) {
    try {
      return await this.servicesService.updateFamily(id, dto);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<UpsertServiceDto>) {
    try {
      return await this.servicesService.updateService(id, dto);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.servicesService.deleteService(id);
      return { success: true };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }
}
