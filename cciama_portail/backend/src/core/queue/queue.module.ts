import { Module, Global } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        exchanges: [
          {
            name: 'cciama-exchange',
            type: 'topic',
          },
        ],
        uri: configService.get<string>('RABBITMQ_URI', 'amqp://guest:guest@localhost:5672'),
        connectionInitOptions: { wait: false },
      }),
    }),
  ],
  exports: [RabbitMQModule],
})
export class QueueModule {}
