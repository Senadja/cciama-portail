import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { SseService } from '../../core/sse/sse.service';
import { HomePageContent } from '@prisma/client';

export interface UpdateHomeContentDto {
  heroEyebrow: string;
  heroTitle: string;
  heroDesc: string;
  heroCtaText: string;
  heroCtaLink: string;
  heroImage: string;
  missionEye: string;
  missionTitle: string;
  missionDesc: string;
  stats: any[];
}

@Injectable()
export class HomeContentService implements OnModuleInit {
  private readonly logger = new Logger(HomeContentService.name);

  constructor(
    private prisma: PrismaService,
    private sseService: SseService
  ) {}

  async onModuleInit() {
    try {
      await this.seedDefaultContent();
    } catch (err) {
      this.logger.warn(`seedDefaultContent skipped: ${err?.message ?? err}`);
    }
  }

  private async seedDefaultContent() {
    const exists = await this.prisma.homePageContent.findUnique({
      where: { id: 'singleton' }
    });

    if (!exists) {
      await this.prisma.homePageContent.create({
        data: {
          id: 'singleton',
          heroEyebrow: "Chambre de Commerce, d'Industrie, d'Agriculture, des Mines et de l'Artisanat du Tchad",
          heroTitle: "La voix institutionnelle du secteur privé tchadien.",
          heroDesc: "La CCIAMA accompagne, représente et défend les acteurs économiques du Tchad pour bâtir un secteur privé fort, structuré, compétitif et connecté aux opportunités.",
          heroCtaText: "Découvrir les services",
          heroCtaLink: "/services",
          heroImage: "/cciama-logo.png",
          missionEye: "Notre mission",
          missionTitle: "Représenter, Défendre et Accompagner",
          missionDesc: "La CCIAMA a pour mission de représenter et défendre les intérêts du secteur privé, servir d’interface avec l’État, et contribuer à l’amélioration du climat des affaires. Nous accompagnons le développement du commerce, de l'agriculture, de l'artisanat et de l'industrie.",
          stats: [
            { num: '23', sup: '', label: 'Délégations en province' },
            { num: '86', sup: '', label: "Membres élus (N'Djamena)" },
            { num: '5', sup: '', label: "Secteurs d'activité" },
            { num: '15', sup: 'k+', label: 'Entreprises accompagnées' }
          ],
          updatedBy: 'system'
        }
      });
      this.logger.log('Seeded default home page content singleton');
    }
  }

  async getHomeContent(): Promise<HomePageContent | null> {
    const content = await this.prisma.homePageContent.findUnique({
      where: { id: 'singleton' }
    });
    return content;
  }

  async updateHomeContent(dto: UpdateHomeContentDto, username: string = 'admin'): Promise<HomePageContent> {
    const existing = await this.prisma.homePageContent.findUnique({
      where: { id: 'singleton' }
    });

    const updated = await this.prisma.homePageContent.update({
      where: { id: 'singleton' },
      data: {
        ...dto,
        updatedBy: username
      }
    });

    // Audit logs for critical fields changed
    if (existing) {
      const fields: (keyof UpdateHomeContentDto)[] = [
        'heroEyebrow',
        'heroTitle',
        'heroDesc',
        'heroCtaText',
        'heroCtaLink',
        'heroImage',
        'missionEye',
        'missionTitle',
        'missionDesc'
      ];
      
      for (const field of fields) {
        if (existing[field] !== dto[field]) {
          await this.prisma.contentUpdateHistory.create({
            data: {
              entityType: 'home_page_content',
              entityId: 'singleton',
              field,
              oldValue: String(existing[field]),
              newValue: String(dto[field]),
              updatedBy: username
            }
          });
        }
      }
    }

    // Trigger SSE visitors refresh
    this.sseService.emitContentUpdate('home_page_content', 'singleton');

    return updated;
  }
}
