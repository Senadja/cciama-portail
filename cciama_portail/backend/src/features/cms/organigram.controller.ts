import { Controller, Get, Post, Put, Delete, Param, Body, BadRequestException } from '@nestjs/common';
import { OrganigramService, CreateOrganigramNodeDto } from './organigram.service';
import { Unprotected } from 'nest-keycloak-connect';

@Controller('content/organigram')
@Unprotected()
export class OrganigramController {
  constructor(private readonly organigramService: OrganigramService) {}

  @Get()
  async getOrganigram() {
    return this.organigramService.getOrganigram();
  }

  @Get(':id/children-count')
  async getChildrenCount(@Param('id') id: string) {
    const count = await this.organigramService.getChildCountRecursive(id);
    return { count };
  }

  @Post()
  async createNode(@Body() dto: CreateOrganigramNodeDto) {
    try {
      return await this.organigramService.createNode(dto);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put(':id')
  async updateNode(@Param('id') id: string, @Body() dto: Partial<CreateOrganigramNodeDto>) {
    try {
      return await this.organigramService.updateNode(id, dto);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Delete(':id')
  async deleteNode(@Param('id') id: string) {
    try {
      const result = await this.organigramService.deleteNode(id);
      return { success: true, deletedChildrenCount: result.count };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }
}
