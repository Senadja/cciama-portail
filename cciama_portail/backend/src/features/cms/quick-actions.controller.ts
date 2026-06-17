import { Controller, Get, Post, Put, Delete, Param, Body, BadRequestException } from '@nestjs/common';
import { QuickActionsService, CreateQuickActionDto } from './quick-actions.service';
import { Unprotected } from 'nest-keycloak-connect';

@Controller('content/quick-actions')
@Unprotected()
export class QuickActionsController {
  constructor(private readonly quickActionsService: QuickActionsService) {}

  @Get()
  async getQuickActions() {
    return this.quickActionsService.getAll();
  }

  @Post()
  async createQuickAction(@Body() dto: CreateQuickActionDto) {
    try {
      return await this.quickActionsService.create(dto);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put('reorder')
  async reorderQuickActions(@Body('ids') ids: string[]) {
    if (!ids || !Array.isArray(ids)) {
      throw new BadRequestException('An array of ids is required');
    }
    try {
      await this.quickActionsService.reorder(ids);
      return { success: true };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put(':id')
  async updateQuickAction(@Param('id') id: string, @Body() dto: Partial<CreateQuickActionDto>) {
    try {
      return await this.quickActionsService.update(id, dto);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Delete(':id')
  async deleteQuickAction(@Param('id') id: string) {
    try {
      await this.quickActionsService.delete(id);
      return { success: true };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }
}
