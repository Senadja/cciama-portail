import { Controller, Get, Post, Put, Delete, Param, Body, BadRequestException } from '@nestjs/common';
import { DocumentsService, CreateDocumentDto } from './documents.service';
import { Unprotected } from 'nest-keycloak-connect';

@Controller('content/documents')
@Unprotected()
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  async getDocuments() {
    return this.documentsService.getAll();
  }

  @Post()
  async createDocument(@Body() dto: CreateDocumentDto) {
    try {
      return await this.documentsService.create(dto);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put('reorder')
  async reorderDocuments(@Body('ids') ids: string[]) {
    if (!ids || !Array.isArray(ids)) {
      throw new BadRequestException('An array of ids is required');
    }
    try {
      await this.documentsService.reorder(ids);
      return { success: true };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Put(':id')
  async updateDocument(@Param('id') id: string, @Body() dto: Partial<CreateDocumentDto>) {
    try {
      return await this.documentsService.update(id, dto);
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  @Delete(':id')
  async deleteDocument(@Param('id') id: string) {
    try {
      await this.documentsService.delete(id);
      return { success: true };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }
}
