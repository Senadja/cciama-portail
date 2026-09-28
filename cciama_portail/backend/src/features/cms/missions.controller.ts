import { Controller, Get, Post, Put, Delete, Param, Body, BadRequestException } from '@nestjs/common';
import { MissionsService, CreateMissionDto } from './missions.service';
import { CurrentUser, Public, Roles, AuthUser } from '../auth/auth.decorators';

@Controller('content/missions')
@Roles('ADMIN', 'EDITOR')
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @Public()
  @Get()
  async getMissions() {
    return this.missionsService.getAllMissions();
  }

  @Post()
  async createMission(@Body() dto: CreateMissionDto, @CurrentUser() user: AuthUser) {
    try {
      return await this.missionsService.createMission(dto, user.name);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put('reorder')
  async reorderMissions(@Body('ids') ids: string[], @CurrentUser() user: AuthUser) {
    if (!ids || !Array.isArray(ids)) {
      throw new BadRequestException('An array of ids is required');
    }
    try {
      await this.missionsService.reorderMissions(ids, user.name);
      return { success: true };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put(':id')
  async updateMission(@Param('id') id: string, @Body() dto: Partial<CreateMissionDto>, @CurrentUser() user: AuthUser) {
    try {
      return await this.missionsService.updateMission(id, dto, user.name);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Delete(':id')
  async deleteMission(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    try {
      await this.missionsService.deleteMission(id, user.name);
      return { success: true };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }
}
