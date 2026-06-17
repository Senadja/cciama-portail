import { Controller, Get, Post, Put, Delete, Param, Body, BadRequestException } from '@nestjs/common';
import { FlashService, CreateFlashDto } from './flash.service';
import { Unprotected } from 'nest-keycloak-connect';

@Controller('content/flash')
@Unprotected()
export class FlashController {
  constructor(private readonly flashService: FlashService) {}

  @Get()
  async getFlash() {
    return this.flashService.getAll();
  }

  @Post()
  async createFlash(@Body() dto: CreateFlashDto) {
    try {
      return await this.flashService.create(dto);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put('reorder')
  async reorderFlash(@Body('ids') ids: string[]) {
    if (!ids || !Array.isArray(ids)) {
      throw new BadRequestException('An array of ids is required');
    }
    try {
      await this.flashService.reorder(ids);
      return { success: true };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put(':id')
  async updateFlash(@Param('id') id: string, @Body() dto: Partial<CreateFlashDto>) {
    try {
      return await this.flashService.update(id, dto);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Delete(':id')
  async deleteFlash(@Param('id') id: string) {
    try {
      await this.flashService.delete(id);
      return { success: true };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }
}
