import { Controller, Get, Put, Body, BadRequestException } from '@nestjs/common';
import { HomeContentService, UpdateHomeContentDto } from './home-content.service';
import { Unprotected } from 'nest-keycloak-connect';
import { HomePageContent } from '@prisma/client';

@Controller('content/home')
@Unprotected()
export class HomeContentController {
  constructor(private readonly homeService: HomeContentService) {}

  @Get()
  async getHomeContent(): Promise<HomePageContent | null> {
    return this.homeService.getHomeContent();
  }

  @Put()
  async updateHomeContent(@Body() dto: UpdateHomeContentDto): Promise<{ success: boolean; content: HomePageContent }> {
    try {
      const updated = await this.homeService.updateHomeContent(dto);
      return { success: true, content: updated };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }
}

