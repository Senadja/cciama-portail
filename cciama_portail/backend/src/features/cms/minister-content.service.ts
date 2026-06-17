import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { SseService } from '../../core/sse/sse.service';

export interface UpdateMinisterContentDto {
  eyebrow: string;
  title: string;
  lead: string;
  name: string;
  role: string;
  portrait: string;
  welcomeTitle: string;
  para1: string;
  para2: string;
  quote: string;
  para3: string;
  bioFile: string;
}

@Injectable()
export class MinisterContentService implements OnModuleInit {
  private readonly logger = new Logger(MinisterContentService.name);

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
    const exists = await this.prisma.ministerWordContent.findUnique({
      where: { id: 'singleton' }
    });

    if (!exists) {
      await this.prisma.ministerWordContent.create({
        data: {
          id: 'singleton',
          eyebrow: "La CCIAMA",
          title: "Mot de l'Administrateur Provisoire",
          lead: "Message officiel à destination des opérateurs économiques et partenaires du Tchad.",
          name: "Abderrahmane Gademi",
          role: "Administrateur Provisoire",
          portrait: "/cciama-logo.png",
          welcomeTitle: "Bienvenue sur le portail institutionnel",
          para1: "Chers acteurs du secteur privé, chers partenaires, c'est avec un profond sentiment de responsabilité que je m'adresse à vous à travers ce portail, qui se veut le reflet de notre engagement commun pour bâtir un secteur privé fort, structuré, compétitif et connecté aux opportunités.",
          para2: "La Chambre de Commerce, d'Industrie, d'Agriculture, des Mines et de l'Artisanat traverse une période de modernisation. L'amélioration du climat des affaires, l'accompagnement des entrepreneurs, le développement des filières stratégiques et la promotion des jeunes et des femmes constituent les piliers de cette transformation.",
          quote: "Notre ambition est claire : faire de la CCIAMA un véritable levier de développement économique, au service de chaque entrepreneur.",
          para3: "Ce portail est le vôtre. Il vous permet d'accéder aux formalités, de suivre vos démarches, de consulter les opportunités d'affaires et de vous informer sur l'action consulaire. Je vous invite à l'explorer et à rejoindre notre réseau d'acteurs économiques.",
          bioFile: "#",
          updatedBy: 'system'
        }
      });
      this.logger.log('Seeded default minister/admin word content singleton');
    }
  }

  async getMinisterContent() {
    const content = await this.prisma.ministerWordContent.findUnique({
      where: { id: 'singleton' }
    });
    return content;
  }

  async updateMinisterContent(dto: UpdateMinisterContentDto, username: string = 'admin') {
    const existing = await this.prisma.ministerWordContent.findUnique({
      where: { id: 'singleton' }
    });

    const updated = await this.prisma.ministerWordContent.update({
      where: { id: 'singleton' },
      data: {
        ...dto,
        updatedBy: username
      }
    });

    if (existing) {
      const fields: (keyof UpdateMinisterContentDto)[] = [
        'eyebrow',
        'title',
        'lead',
        'name',
        'role',
        'portrait',
        'welcomeTitle',
        'para1',
        'para2',
        'quote',
        'para3',
        'bioFile'
      ];
      
      for (const field of fields) {
        if (existing[field] !== dto[field]) {
          await this.prisma.contentUpdateHistory.create({
            data: {
              entityType: 'minister_word_content',
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
    this.sseService.emitContentUpdate('minister_word_content', 'singleton');

    return updated;
  }
}
