import { Controller, Get, Post, Put, Delete, Param, Body, BadRequestException } from '@nestjs/common';
import { OrganismsService, CreateOrganismDto } from './organisms.service';
import { CurrentUser, Public, Roles, AuthUser } from '../auth/auth.decorators';

@Controller('content/organisms')
@Roles('ADMIN', 'EDITOR')
export class OrganismsController {
  constructor(private readonly organismsService: OrganismsService) {}

  @Public()
  @Get()
  async getOrganisms() {
    return this.organismsService.getAll();
  }

  @Post()
  async createOrganism(@Body() dto: CreateOrganismDto, @CurrentUser() user: AuthUser) {
    try {
      return await this.organismsService.create(dto, user.name);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put('reorder')
  async reorderOrganisms(@Body('ids') ids: string[], @CurrentUser() user: AuthUser) {
    if (!ids || !Array.isArray(ids)) {
      throw new BadRequestException('An array of ids is required');
    }
    try {
      await this.organismsService.reorder(ids, user.name);
      return { success: true };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put(':id')
  async updateOrganism(@Param('id') id: string, @Body() dto: Partial<CreateOrganismDto>, @CurrentUser() user: AuthUser) {
    try {
      return await this.organismsService.update(id, dto, user.name);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Delete(':id')
  async deleteOrganism(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    try {
      await this.organismsService.delete(id, user.name);
      return { success: true };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }
}
