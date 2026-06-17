import { Controller, Get, Post, Put, Delete, Param, Body, BadRequestException } from '@nestjs/common';
import { ProjectsService, CreateProjectDto } from './projects.service';
import { Unprotected } from 'nest-keycloak-connect';

@Controller('content/projects')
@Unprotected()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async getProjects() {
    return this.projectsService.getAll();
  }

  @Post()
  async createProject(@Body() dto: CreateProjectDto) {
    try {
      return await this.projectsService.create(dto);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put('reorder')
  async reorderProjects(@Body('ids') ids: string[]) {
    if (!ids || !Array.isArray(ids)) {
      throw new BadRequestException('An array of ids is required');
    }
    try {
      await this.projectsService.reorder(ids);
      return { success: true };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put(':id')
  async updateProject(@Param('id') id: string, @Body() dto: Partial<CreateProjectDto>) {
    try {
      return await this.projectsService.update(id, dto);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Delete(':id')
  async deleteProject(@Param('id') id: string) {
    try {
      await this.projectsService.delete(id);
      return { success: true };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }
}
