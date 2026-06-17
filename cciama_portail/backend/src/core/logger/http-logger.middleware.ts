import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl } = request;
    const startTime = process.hrtime();

    response.on('finish', () => {
      const { statusCode } = response;
      const diff = process.hrtime(startTime);
      const durationMs = Math.round(diff[0] * 1e3 + diff[1] * 1e-6);

      this.logger.log({
        method,
        url: originalUrl,
        status: statusCode,
        duration: durationMs,
      });
    });

    next();
  }
}
