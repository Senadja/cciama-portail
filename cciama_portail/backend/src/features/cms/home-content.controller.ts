import { Controller, Get, Put, Body, BadRequestException } from '@nestjs/common';
import { HomeContentService, UpdateHomeContentDto } from './home-content.service';
import { HomePageContent } from '@prisma/client';
import { CurrentUser, Public, Roles, AuthUser } from '../auth/auth.decorators';

@Controller('content/home')
@Roles('ADMIN', 'EDITOR')
export class HomeContentController {
  constructor(private readonly homeService: HomeContentService) {}

  @Public()
  @Get()
  async getHomeContent(): Promise<HomePageContent | null> {
    return this.homeService.getHomeContent();
  }

  @Put()
  async updateHomeContent(
    @Body() dto: UpdateHomeContentDto,
    @CurrentUser() user: AuthUser,
  ): Promise<{ success: boolean; content: HomePageContent }> {
    try {
      const updated = await this.homeService.updateHomeContent(dto, user.name);
      return { success: true, content: updated };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }
}

