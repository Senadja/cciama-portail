import { Controller, Get, Post, Put, Delete, Param, Body, BadRequestException } from '@nestjs/common';
import { ServicesService, UpsertServiceDto, UpdateFamilyDto } from './services.service';
import { CurrentUser, Public, Roles, AuthUser } from '../auth/auth.decorators';

@Controller('content/services')
@Roles('ADMIN', 'EDITOR')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  /** Public catalogue grouped by family. */
  @Public()
  @Get()
  async getCatalogue() {
    return this.servicesService.getCatalogue();
  }

  @Public()
  @Get('families')
  async getFamilies() {
    return this.servicesService.getFamilies();
  }

  @Public()
  @Get('code/:code')
  async getByCode(@Param('code') code: string) {
    return this.servicesService.getServiceByCode(code);
  }

  @Public()
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.servicesService.getServiceById(id);
  }

  @Post()
  async create(@Body() dto: UpsertServiceDto, @CurrentUser() user: AuthUser) {
    try {
      return await this.servicesService.createService(dto, user.name);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put('reorder')
  async reorder(@Body('ids') ids: string[], @CurrentUser() user: AuthUser) {
    if (!ids || !Array.isArray(ids)) {
      throw new BadRequestException('An array of ids is required');
    }
    try {
      await this.servicesService.reorderServices(ids, user.name);
      return { success: true };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put('families/:id')
  async updateFamily(@Param('id') id: string, @Body() dto: UpdateFamilyDto, @CurrentUser() user: AuthUser) {
    try {
      return await this.servicesService.updateFamily(id, dto, user.name);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<UpsertServiceDto>, @CurrentUser() user: AuthUser) {
    try {
      return await this.servicesService.updateService(id, dto, user.name);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    try {
      await this.servicesService.deleteService(id, user.name);
      return { success: true };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }
}
