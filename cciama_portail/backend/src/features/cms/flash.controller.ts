import { Controller, Get, Post, Put, Delete, Param, Body, BadRequestException } from '@nestjs/common';
import { FlashService, CreateFlashDto } from './flash.service';
import { CurrentUser, Public, Roles, AuthUser } from '../auth/auth.decorators';

@Controller('content/flash')
@Roles('ADMIN', 'EDITOR')
export class FlashController {
  constructor(private readonly flashService: FlashService) {}

  @Public()
  @Get()
  async getFlash() {
    return this.flashService.getAll();
  }

  @Post()
  async createFlash(@Body() dto: CreateFlashDto, @CurrentUser() user: AuthUser) {
    try {
      return await this.flashService.create(dto, user.name);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put('reorder')
  async reorderFlash(@Body('ids') ids: string[], @CurrentUser() user: AuthUser) {
    if (!ids || !Array.isArray(ids)) {
      throw new BadRequestException('An array of ids is required');
    }
    try {
      await this.flashService.reorder(ids, user.name);
      return { success: true };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put(':id')
  async updateFlash(@Param('id') id: string, @Body() dto: Partial<CreateFlashDto>, @CurrentUser() user: AuthUser) {
    try {
      return await this.flashService.update(id, dto, user.name);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Delete(':id')
  async deleteFlash(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    try {
      await this.flashService.delete(id, user.name);
      return { success: true };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }
}
