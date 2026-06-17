import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app.module';
import { winstonLoggerOptions } from './core/logger/winston.config';

async function bootstrap() {
  // Initialize NestJS with the custom colorful Winston Logger
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonLoggerOptions),
  });

  const logger = new Logger('Bootstrap');

  // Enable CORS for frontend integration
  app.enableCors();

  // Set global API prefix
  app.setGlobalPrefix('api/v1');

  // Set global validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`CCIAMA Backend successfully initialized and running on: http://localhost:${port}/api/v1`);
}
bootstrap();
