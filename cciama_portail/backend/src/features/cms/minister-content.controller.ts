import { Controller, Get, Put, Body, BadRequestException } from '@nestjs/common';
import { MinisterContentService, UpdateMinisterContentDto } from './minister-content.service';
import { Unprotected } from 'nest-keycloak-connect';

@Controller('content/minister')
@Unprotected()
export class MinisterContentController {
  constructor(private readonly ministerService: MinisterContentService) {}

  @Get()
  async getMinisterContent() {
    return this.ministerService.getMinisterContent();
  }

  @Put()
  async updateMinisterContent(@Body() dto: UpdateMinisterContentDto) {
    try {
      const updated = await this.ministerService.updateMinisterContent(dto);
      return { success: true, content: updated };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }
}
