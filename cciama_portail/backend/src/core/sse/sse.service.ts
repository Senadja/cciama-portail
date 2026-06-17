import { Injectable, Logger } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';

export interface SseMessage {
  data: {
    entityType: string;
    entityId: string;
  };
  type?: string;
}

@Injectable()
export class SseService {
  private readonly logger = new Logger(SseService.name);
  private readonly sseSubject = new Subject<SseMessage>();

  getEventStream(): Observable<SseMessage> {
    return this.sseSubject.asObservable();
  }

  emitContentUpdate(entityType: string, entityId: string) {
    this.logger.log(`Emitting SSE content update: ${entityType} -> ${entityId}`);
    this.sseSubject.next({
      type: 'content_updated',
      data: {
        entityType,
        entityId,
      },
    });
  }
}
