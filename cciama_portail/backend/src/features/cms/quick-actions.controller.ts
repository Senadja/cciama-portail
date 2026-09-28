import { Controller, Get, Post, Put, Delete, Param, Body, BadRequestException } from '@nestjs/common';
import { QuickActionsService, CreateQuickActionDto } from './quick-actions.service';
import { CurrentUser, Public, Roles, AuthUser } from '../auth/auth.decorators';

@Controller('content/quick-actions')
@Roles('ADMIN', 'EDITOR')
export class QuickActionsController {
  constructor(private readonly quickActionsService: QuickActionsService) {}

  @Public()
  @Get()
  async getQuickActions() {
    return this.quickActionsService.getAll();
  }

  @Post()
  async createQuickAction(@Body() dto: CreateQuickActionDto, @CurrentUser() user: AuthUser) {
    try {
      return await this.quickActionsService.create(dto, user.name);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put('reorder')
  async reorderQuickActions(@Body('ids') ids: string[], @CurrentUser() user: AuthUser) {
    if (!ids || !Array.isArray(ids)) {
      throw new BadRequestException('An array of ids is required');
    }
    try {
      await this.quickActionsService.reorder(ids, user.name);
      return { success: true };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put(':id')
  async updateQuickAction(@Param('id') id: string, @Body() dto: Partial<CreateQuickActionDto>, @CurrentUser() user: AuthUser) {
    try {
      return await this.quickActionsService.update(id, dto, user.name);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Delete(':id')
  async deleteQuickAction(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    try {
      await this.quickActionsService.delete(id, user.name);
      return { success: true };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }
}
