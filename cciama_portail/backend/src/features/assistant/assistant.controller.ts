import { Body, Controller, Post } from '@nestjs/common';
import { Unprotected } from 'nest-keycloak-connect';
import { AssistantService } from './assistant.service';
import { ChatRequestDto } from './assistant.dto';

@Controller('assistant')
@Unprotected()
export class AssistantController {
  constructor(private readonly assistant: AssistantService) {}

  @Post('chat')
  async chat(@Body() dto: ChatRequestDto) {
    const reply = await this.assistant.chat(dto.messages);
    return { reply };
  }
}
