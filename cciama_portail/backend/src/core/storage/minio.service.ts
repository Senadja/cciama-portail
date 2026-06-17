import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private client: Minio.Client;
  private defaultBucketName: string;
  private endPoint: string;
  private port: number;
  private useSSL: boolean;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.endPoint = this.configService.get<string>('MINIO_ENDPOINT', 'localhost');
    this.port = Number(this.configService.get<string>('MINIO_PORT', '9000'));
    this.useSSL = this.configService.get<string>('MINIO_USE_SSL') === 'true';
    const accessKey = this.configService.get<string>('MINIO_ACCESS_KEY', 'minioadmin');
    const secretKey = this.configService.get<string>('MINIO_SECRET_KEY', 'minioadmin');
    this.defaultBucketName = this.configService.get<string>('MINIO_BUCKET_NAME', 'cciama-uploads');

    this.client = new Minio.Client({
      endPoint: this.endPoint,
      port: this.port,
      useSSL: this.useSSL,
      accessKey,
      secretKey,
    });

    // Make sure bucket exists, then enforce public read access (permanent URLs)
    try {
      const bucketExists = await this.client.bucketExists(this.defaultBucketName);
      if (!bucketExists) {
        await this.client.makeBucket(this.defaultBucketName);
        this.logger.log(`Created default MinIO bucket: ${this.defaultBucketName}`);
      } else {
        this.logger.log(`Default MinIO bucket already exists: ${this.defaultBucketName}`);
      }
      await this.ensurePublicReadPolicy();
      this.logger.log('Successfully configured MinIO Object Storage');
    } catch (err: any) {
      this.logger.warn(`MinIO startup check failed. Make sure MinIO service is running. Error: ${err.message}`);
    }
  }

  /** Allow anonymous read on objects so stored URLs are permanent (public portal assets). */
  private async ensurePublicReadPolicy() {
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${this.defaultBucketName}/*`],
        },
      ],
    };
    try {
      await this.client.setBucketPolicy(this.defaultBucketName, JSON.stringify(policy));
      this.logger.log(`Public-read policy applied to bucket: ${this.defaultBucketName}`);
    } catch (err: any) {
      this.logger.warn(`Could not set public-read policy on bucket: ${err.message}`);
    }
  }

  /** Permanent public URL (bucket is public-read). */
  getPublicUrl(objectName: string): string {
    const protocol = this.useSSL ? 'https' : 'http';
    return `${protocol}://${this.endPoint}:${this.port}/${this.defaultBucketName}/${objectName}`;
  }

  getClient(): Minio.Client {
    return this.client;
  }

  getDefaultBucketName(): string {
    return this.defaultBucketName;
  }

  async uploadFile(objectName: string, buffer: Buffer, size: number, mimeType: string): Promise<string> {
    try {
      await this.client.putObject(
        this.defaultBucketName,
        objectName,
        buffer,
        size,
        { 'Content-Type': mimeType }
      );
      this.logger.log(`Successfully uploaded file: ${objectName} to MinIO`);
      return objectName;
    } catch (err: any) {
      this.logger.error(`Failed to upload file to MinIO: ${err.message}`);
      throw err;
    }
  }

  async deleteFile(objectName: string): Promise<void> {
    try {
      await this.client.removeObject(this.defaultBucketName, objectName);
      this.logger.log(`Successfully deleted file from MinIO: ${objectName}`);
    } catch (err: any) {
      this.logger.error(`Failed to delete file from MinIO: ${err.message}`);
      throw err;
    }
  }

  async getPresignedUrl(objectName: string, expirySeconds: number = 86400): Promise<string> {
    try {
      const url = await this.client.presignedGetObject(
        this.defaultBucketName,
        objectName,
        expirySeconds
      );
      return url;
    } catch (err: any) {
      this.logger.error(`Failed to generate presigned URL for MinIO: ${err.message}`);
      throw err;
    }
  }
}
