import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private static pool: pg.Pool;
  private static adapter: PrismaPg;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is not set in the environment');
    }

    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    // Call PrismaClient base constructor with the driver adapter
    super({ adapter });

    PrismaService.pool = pool;
    PrismaService.adapter = adapter;
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Successfully connected to PostgreSQL via Prisma 7 Driver Adapter');
    } catch (error) {
      this.logger.error('Failed to connect to PostgreSQL database', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await PrismaService.pool.end();
    this.logger.log('Disconnected from PostgreSQL');
  }
}
