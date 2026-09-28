import { Controller, Get, Post, Put, Delete, Param, Body, BadRequestException } from '@nestjs/common';
import { NewsService, CreateNewsDto } from './news.service';
import { CurrentUser, Public, Roles, AuthUser } from '../auth/auth.decorators';

@Controller('content/news')
@Roles('ADMIN', 'EDITOR')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Public()
  @Get()
  async getNews() {
    return this.newsService.getAll();
  }

  @Post()
  async createNews(@Body() dto: CreateNewsDto, @CurrentUser() user: AuthUser) {
    try {
      return await this.newsService.create(dto, user.name);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put('reorder')
  async reorderNews(@Body('ids') ids: string[], @CurrentUser() user: AuthUser) {
    if (!ids || !Array.isArray(ids)) {
      throw new BadRequestException('An array of ids is required');
    }
    try {
      await this.newsService.reorder(ids, user.name);
      return { success: true };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put(':id')
  async updateNews(@Param('id') id: string, @Body() dto: Partial<CreateNewsDto>, @CurrentUser() user: AuthUser) {
    try {
      return await this.newsService.update(id, dto, user.name);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Delete(':id')
  async deleteNews(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    try {
      await this.newsService.delete(id, user.name);
      return { success: true };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }
}
