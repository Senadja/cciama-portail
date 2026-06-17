import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Meilisearch } from 'meilisearch' assert { 'resolution-mode': 'import' };

@Injectable()
export class SearchService implements OnModuleInit {
  private readonly logger = new Logger(SearchService.name);
  private client: Meilisearch;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const host = this.configService.get<string>('MEILI_HOST', 'http://localhost:7700');
    const apiKey = this.configService.get<string>('MEILI_API_KEY');

    try {
      // Dynamic import to support ESM-only Meilisearch package in CJS NestJS
      const { Meilisearch } = await import('meilisearch');
      
      this.client = new Meilisearch({
        host,
        apiKey: apiKey || undefined,
      });

      // Check health to log connection status
      const healthy = await this.client.isHealthy();
      if (healthy) {
        this.logger.log('Successfully connected to Meilisearch');
      } else {
        this.logger.warn('Meilisearch reported unhealthy status');
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Meilisearch startup connection check failed: ${errMsg}`);
    }
  }

  getClient(): Meilisearch {
    return this.client;
  }
}
