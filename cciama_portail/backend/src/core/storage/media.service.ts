import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { MinioService } from './minio.service';
import { ConfigService } from '@nestjs/config';
import sharp from 'sharp';
import crypto from 'crypto';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    private prisma: PrismaService,
    private minioService: MinioService,
    private configService: ConfigService
  ) {}

  private validateRealMimeType(buffer: Buffer, type: 'image' | 'document' | 'logo' | 'video') {
    if (buffer.length < 4) {
      throw new BadRequestException('File content is empty or invalid.');
    }
    const hex = buffer.toString('hex', 0, 4).toUpperCase();
    
    const isPng = hex.startsWith('89504E47');
    const isJpeg = hex.startsWith('FFD8FF');
    const isPdf = hex.startsWith('25504446'); // %PDF
    const isWebp = hex.startsWith('52494646'); // RIFF/WEBP

    if (type === 'image' || type === 'logo') {
      if (!isPng && !isJpeg && !isWebp) {
        throw new BadRequestException('Invalid binary file signature. Only PNG, JPEG, and WebP images are allowed.');
      }
    } else if (type === 'document') {
      if (!isPdf) {
        throw new BadRequestException('Invalid binary file signature. Only PDF documents are allowed.');
      }
    }
  }

  async uploadMedia(
    file: Express.Multer.File,
    type: 'image' | 'document' | 'logo' | 'video',
    altText?: string,
    username: string = 'admin'
  ) {
    const originalMimetype = file.mimetype;
    let fileBuffer = file.buffer;
    let mimeType = file.mimetype;
    let extension = file.originalname.split('.').pop() || '';

    // 1. Real MIME Validation via magic bytes
    this.validateRealMimeType(fileBuffer, type);

    // 2. Validate Size Limit
    const maxImageSize = parseInt(this.configService.get<string>('MAX_IMAGE_SIZE', '5242880'), 10);
    const maxDocSize = parseInt(this.configService.get<string>('MAX_DOC_SIZE', '15728640'), 10);
    
    if ((type === 'image' || type === 'logo') && fileBuffer.length > maxImageSize) {
      throw new BadRequestException(`Image size exceeds the maximum limit of ${maxImageSize / (1024 * 1024)}MB`);
    }
    if (type === 'document' && fileBuffer.length > maxDocSize) {
      throw new BadRequestException(`Document size exceeds the maximum limit of ${maxDocSize / (1024 * 1024)}MB`);
    }

    // 3. Image Optimization & WebP Conversion (via sharp)
    if (type === 'image' || type === 'logo') {
      try {
        let optimizer = sharp(fileBuffer);
        
        // Resize images if they are excessively large (max width 1920)
        const metadata = await optimizer.metadata();
        if (metadata.width && metadata.width > 1920) {
          optimizer = optimizer.resize({ width: 1920, withoutEnlargement: true });
        }

        // Convert to WebP and compress
        fileBuffer = await optimizer.webp({ quality: 80 }).toBuffer();
        mimeType = 'image/webp';
        extension = 'webp';
      } catch (err: any) {
        this.logger.warn(`Image compression failed, uploading original image instead. Error: ${err.message}`);
      }
    }

    // 4. Generate secure unique filename
    const uniqueId = crypto.randomUUID();
    const objectName = `${type}s/${uniqueId}.${extension}`;

    // 5. Upload to MinIO
    await this.minioService.uploadFile(objectName, fileBuffer, fileBuffer.length, mimeType);

    // 6. Save metadata to Database
    const media = await this.prisma.mediaAsset.create({
      data: {
        id: uniqueId,
        filename: file.originalname,
        mimeType,
        size: fileBuffer.length,
        path: objectName,
        type,
        altText: altText || null,
        uploadedBy: username,
      },
    });

    return media;
  }

  async getMediaUrl(id: string): Promise<string> {
    const media = await this.prisma.mediaAsset.findUnique({ where: { id } });
    if (!media) {
      throw new NotFoundException(`Media asset with ID ${id} not found`);
    }
    // En prod, le navigateur ne peut pas joindre MinIO interne : on sert le fichier
    // via le backend (MEDIA_PUBLIC_BASE, ex. "/api/v1/content/media/file").
    // Sinon (dev local), URL directe MinIO public-read (rétro-compatible).
    const publicBase = this.configService.get<string>('MEDIA_PUBLIC_BASE');
    if (publicBase) {
      return `${publicBase}/${media.id}`;
    }
    return this.minioService.getPublicUrl(media.path);
  }

  async deleteMedia(id: string): Promise<void> {
    const media = await this.prisma.mediaAsset.findUnique({ where: { id } });
    if (!media) {
      throw new NotFoundException(`Media asset with ID ${id} not found`);
    }

    // Delete from MinIO
    await this.minioService.deleteFile(media.path);

    // Delete from DB
    await this.prisma.mediaAsset.delete({ where: { id } });
  }

  async getAllMedia(type?: string) {
    return this.prisma.mediaAsset.findMany({
      where: type ? { type } : {},
      orderBy: { uploadedAt: 'desc' },
    });
  }
}
