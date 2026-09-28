import { Controller, Get, Post, Put, Delete, Param, Body, BadRequestException } from '@nestjs/common';
import { OrganigramService, CreateOrganigramNodeDto } from './organigram.service';
import { CurrentUser, Public, Roles, AuthUser } from '../auth/auth.decorators';

@Controller('content/organigram')
@Roles('ADMIN', 'EDITOR')
export class OrganigramController {
  constructor(private readonly organigramService: OrganigramService) {}

  @Public()
  @Get()
  async getOrganigram() {
    return this.organigramService.getOrganigram();
  }

  @Public()
  @Get(':id/children-count')
  async getChildrenCount(@Param('id') id: string) {
    const count = await this.organigramService.getChildCountRecursive(id);
    return { count };
  }

  @Post()
  async createNode(@Body() dto: CreateOrganigramNodeDto, @CurrentUser() user: AuthUser) {
    try {
      return await this.organigramService.createNode(dto, user.name);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put(':id')
  async updateNode(@Param('id') id: string, @Body() dto: Partial<CreateOrganigramNodeDto>, @CurrentUser() user: AuthUser) {
    try {
      return await this.organigramService.updateNode(id, dto, user.name);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Delete(':id')
  async deleteNode(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    try {
      const result = await this.organigramService.deleteNode(id, user.name);
      return { success: true, deletedChildrenCount: result.count };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }
}
