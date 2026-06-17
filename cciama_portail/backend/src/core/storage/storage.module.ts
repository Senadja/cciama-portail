import { Module, Global } from '@nestjs/common';
import { MinioService } from './minio.service';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';

@Global()
@Module({
  controllers: [MediaController],
  providers: [MinioService, MediaService],
  exports: [MinioService, MediaService],
})
export class StorageModule {}
