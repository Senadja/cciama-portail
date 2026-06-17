import { Controller, Get, Post, Put, Delete, Param, Body, BadRequestException } from '@nestjs/common';
import { NewsService, CreateNewsDto } from './news.service';
import { Unprotected } from 'nest-keycloak-connect';

@Controller('content/news')
@Unprotected()
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async getNews() {
    return this.newsService.getAll();
  }

  @Post()
  async createNews(@Body() dto: CreateNewsDto) {
    try {
      return await this.newsService.create(dto);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put('reorder')
  async reorderNews(@Body('ids') ids: string[]) {
    if (!ids || !Array.isArray(ids)) {
      throw new BadRequestException('An array of ids is required');
    }
    try {
      await this.newsService.reorder(ids);
      return { success: true };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put(':id')
  async updateNews(@Param('id') id: string, @Body() dto: Partial<CreateNewsDto>) {
    try {
      return await this.newsService.update(id, dto);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Delete(':id')
  async deleteNews(@Param('id') id: string) {
    try {
      await this.newsService.delete(id);
      return { success: true };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }
}
