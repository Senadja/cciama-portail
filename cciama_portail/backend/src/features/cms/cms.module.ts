import { Module } from '@nestjs/common';
import { PlatformSettingsController } from './platform-settings.controller';
import { PlatformSettingsService } from './platform-settings.service';
import { HomeContentController } from './home-content.controller';
import { HomeContentService } from './home-content.service';
import { MinisterContentController } from './minister-content.controller';
import { MinisterContentService } from './minister-content.service';
import { MissionsController } from './missions.controller';
import { MissionsService } from './missions.service';
import { OrganigramController } from './organigram.controller';
import { OrganigramService } from './organigram.service';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { OrganismsController } from './organisms.controller';
import { OrganismsService } from './organisms.service';
import { FlashController } from './flash.controller';
import { FlashService } from './flash.service';
import { QuickActionsController } from './quick-actions.controller';
import { QuickActionsService } from './quick-actions.service';

@Module({
  controllers: [
    PlatformSettingsController,
    HomeContentController,
    MinisterContentController,
    MissionsController,
    OrganigramController,
    ServicesController,
    NewsController,
    DocumentsController,
    ProjectsController,
    OrganismsController,
    FlashController,
    QuickActionsController
  ],
  providers: [
    PlatformSettingsService,
    HomeContentService,
    MinisterContentService,
    MissionsService,
    OrganigramService,
    ServicesService,
    NewsService,
    DocumentsService,
    ProjectsService,
    OrganismsService,
    FlashService,
    QuickActionsService
  ],
})
export class CmsModule {}
