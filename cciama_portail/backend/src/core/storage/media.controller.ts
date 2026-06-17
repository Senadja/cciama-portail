import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { Unprotected } from 'nest-keycloak-connect';

@Controller('admin/media')
@Unprotected() // Unprotected for easy dev testing and local execution
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('type') type: 'image' | 'document' | 'logo' | 'video',
    @Query('altText') altText?: string
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }
    if (!type || !['image', 'document', 'logo', 'video'].includes(type)) {
      throw new BadRequestException('Invalid media type. Must be: image, document, logo, or video.');
    }

    const media = await this.mediaService.uploadMedia(file, type, altText);
    const presignedUrl = await this.mediaService.getMediaUrl(media.id);

    return {
      success: true,
      media,
      url: presignedUrl,
    };
  }

  @Get()
  async getAllMedia(@Query('type') type?: string) {
    const assets = await this.mediaService.getAllMedia(type);
    
    // Resolve presigned URL for each asset dynamically
    const richAssets = await Promise.all(
      assets.map(async (asset: any) => {
        try {
          const url = await this.mediaService.getMediaUrl(asset.id);
          return { ...asset, url };
        } catch {
          return { ...asset, url: null };
        }
      })
    );

    return richAssets;
  }

  @Get(':id/url')
  async getMediaUrl(@Param('id') id: string) {
    const url = await this.mediaService.getMediaUrl(id);
    return { url };
  }

  @Delete(':id')
  async deleteMedia(@Param('id') id: string) {
    await this.mediaService.deleteMedia(id);
    return { success: true, message: `Media asset ${id} deleted successfully` };
  }
}
