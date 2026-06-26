import { Controller, Get, Param, Res } from '@nestjs/common';
import { Unprotected } from 'nest-keycloak-connect';
import { Response } from 'express';
import { PrismaService } from '../database/prisma.service';
import { MinioService } from './minio.service';

/**
 * Sert publiquement un média stocké dans MinIO (réseau interne) en le streamant
 * via le backend. Évite d'exposer MinIO sur Internet et réutilise le proxy
 * /api/v1/* déjà en place côté front (pas de mixed-content HTTPS→HTTP).
 */
@Controller('content/media')
@Unprotected()
export class MediaFileController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly minio: MinioService,
  ) {}

  @Get('file/:id')
  async serve(@Param('id') id: string, @Res() res: Response) {
    const media = await this.prisma.mediaAsset.findUnique({ where: { id } });
    if (!media) {
      res.status(404).json({ message: 'Média introuvable' });
      return;
    }

    try {
      const stream = await this.minio
        .getClient()
        .getObject(this.minio.getDefaultBucketName(), media.path);

      res.setHeader('Content-Type', media.mimeType);
      // Noms d'objets uniques (UUID) → cache long immuable
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      stream.on('error', () => {
        if (!res.headersSent) res.status(500).end();
      });
      stream.pipe(res);
    } catch {
      res.status(404).json({ message: 'Fichier introuvable' });
    }
  }
}
