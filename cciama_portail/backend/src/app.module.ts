import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module';
import { CacheModule } from './core/cache/cache.module';
import { StorageModule } from './core/storage/storage.module';
import { QueueModule } from './core/queue/queue.module';
import { SearchModule } from './core/search/search.module';
import { SecurityModule } from './core/security/security.module';
import { SseModule } from './core/sse/sse.module';
import { CmsModule } from './features/cms/cms.module';
import { AuthModule } from './features/auth/auth.module';
import { HttpLoggerMiddleware } from './core/logger/http-logger.middleware';

@Module({
  imports: [
    // Global Config Module (dotenv)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Global Infrastructure Core Modules
    DatabaseModule,
    CacheModule,
    StorageModule,
    QueueModule,
    SearchModule,
    SecurityModule,
    SseModule,
    AuthModule,
    CmsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply HTTP logger middleware globally to all routes
    consumer.apply(HttpLoggerMiddleware).forRoutes('*path');
  }
}
// Trigger database reload/seeding.
