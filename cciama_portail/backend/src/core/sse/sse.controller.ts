import { Controller, Sse, MessageEvent } from '@nestjs/common';
import { SseService } from './sse.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Public } from '../../features/auth/auth.decorators';

@Controller('content')
@Public()
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Sse('sse')
  sseStream(): Observable<MessageEvent> {
    return this.sseService.getEventStream().pipe(
      map((message) => ({
        data: message.data,
        type: message.type || 'message',
      } as MessageEvent)),
    );
  }
}
