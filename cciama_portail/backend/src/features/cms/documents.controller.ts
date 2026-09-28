import { Controller, Get, Post, Put, Delete, Param, Body, BadRequestException } from '@nestjs/common';
import { DocumentsService, CreateDocumentDto } from './documents.service';
import { CurrentUser, Public, Roles, AuthUser } from '../auth/auth.decorators';

@Controller('content/documents')
@Roles('ADMIN', 'EDITOR')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Public()
  @Get()
  async getDocuments() {
    return this.documentsService.getAll();
  }

  @Post()
  async createDocument(@Body() dto: CreateDocumentDto, @CurrentUser() user: AuthUser) {
    try {
      return await this.documentsService.create(dto, user.name);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put('reorder')
  async reorderDocuments(@Body('ids') ids: string[], @CurrentUser() user: AuthUser) {
    if (!ids || !Array.isArray(ids)) {
      throw new BadRequestException('An array of ids is required');
    }
    try {
      await this.documentsService.reorder(ids, user.name);
      return { success: true };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put(':id')
  async updateDocument(@Param('id') id: string, @Body() dto: Partial<CreateDocumentDto>, @CurrentUser() user: AuthUser) {
    try {
      return await this.documentsService.update(id, dto, user.name);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Delete(':id')
  async deleteDocument(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    try {
      await this.documentsService.delete(id, user.name);
      return { success: true };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }
}
