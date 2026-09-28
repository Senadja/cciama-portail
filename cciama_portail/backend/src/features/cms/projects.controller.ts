import { Controller, Get, Post, Put, Delete, Param, Body, BadRequestException } from '@nestjs/common';
import { ProjectsService, CreateProjectDto } from './projects.service';
import { CurrentUser, Public, Roles, AuthUser } from '../auth/auth.decorators';

@Controller('content/projects')
@Roles('ADMIN', 'EDITOR')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Public()
  @Get()
  async getProjects() {
    return this.projectsService.getAll();
  }

  @Post()
  async createProject(@Body() dto: CreateProjectDto, @CurrentUser() user: AuthUser) {
    try {
      return await this.projectsService.create(dto, user.name);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put('reorder')
  async reorderProjects(@Body('ids') ids: string[], @CurrentUser() user: AuthUser) {
    if (!ids || !Array.isArray(ids)) {
      throw new BadRequestException('An array of ids is required');
    }
    try {
      await this.projectsService.reorder(ids, user.name);
      return { success: true };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put(':id')
  async updateProject(@Param('id') id: string, @Body() dto: Partial<CreateProjectDto>, @CurrentUser() user: AuthUser) {
    try {
      return await this.projectsService.update(id, dto, user.name);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Delete(':id')
  async deleteProject(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    try {
      await this.projectsService.delete(id, user.name);
      return { success: true };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }
}
