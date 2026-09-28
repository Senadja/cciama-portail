import { Controller, Get, Put, Body, BadRequestException } from '@nestjs/common';
import { MinisterContentService, UpdateMinisterContentDto } from './minister-content.service';
import { CurrentUser, Public, Roles, AuthUser } from '../auth/auth.decorators';

@Controller('content/minister')
@Roles('ADMIN', 'EDITOR')
export class MinisterContentController {
  constructor(private readonly ministerService: MinisterContentService) {}

  @Public()
  @Get()
  async getMinisterContent() {
    return this.ministerService.getMinisterContent();
  }

  @Put()
  async updateMinisterContent(@Body() dto: UpdateMinisterContentDto, @CurrentUser() user: AuthUser) {
    try {
      const updated = await this.ministerService.updateMinisterContent(dto, user.name);
      return { success: true, content: updated };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }
}
