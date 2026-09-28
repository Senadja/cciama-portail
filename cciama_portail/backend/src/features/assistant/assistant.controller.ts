import { Body, Controller, Post } from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { ChatRequestDto } from './assistant.dto';
import { Public } from '../auth/auth.decorators';

@Controller('assistant')
@Public()
export class AssistantController {
  constructor(private readonly assistant: AssistantService) {}

  @Post('chat')
  async chat(@Body() dto: ChatRequestDto) {
    const reply = await this.assistant.chat(dto.messages);
    return { reply };
  }
}
