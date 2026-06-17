import { Controller, Get, Post, Put, Delete, Param, Body, BadRequestException } from '@nestjs/common';
import { MissionsService, CreateMissionDto } from './missions.service';
import { Unprotected } from 'nest-keycloak-connect';

@Controller('content/missions')
@Unprotected()
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @Get()
  async getMissions() {
    return this.missionsService.getAllMissions();
  }

  @Post()
  async createMission(@Body() dto: CreateMissionDto) {
    try {
      return await this.missionsService.createMission(dto);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put('reorder')
  async reorderMissions(@Body('ids') ids: string[]) {
    if (!ids || !Array.isArray(ids)) {
      throw new BadRequestException('An array of ids is required');
    }
    try {
      await this.missionsService.reorderMissions(ids);
      return { success: true };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put(':id')
  async updateMission(@Param('id') id: string, @Body() dto: Partial<CreateMissionDto>) {
    try {
      return await this.missionsService.updateMission(id, dto);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Delete(':id')
  async deleteMission(@Param('id') id: string) {
    try {
      await this.missionsService.deleteMission(id);
      return { success: true };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }
}
