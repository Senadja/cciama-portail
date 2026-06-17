import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { SseService } from '../../core/sse/sse.service';

@Injectable()
export class PlatformSettingsService implements OnModuleInit {
  private readonly logger = new Logger(PlatformSettingsService.name);

  constructor(
    private prisma: PrismaService,
    private sseService: SseService
  ) {}

  async onModuleInit() {
    try {
      await this.seedDefaultSettings();
    } catch (err) {
      this.logger.warn(`seedDefaultSettings skipped: ${err?.message ?? err}`);
    }
  }

  private async seedDefaultSettings() {
    const defaults = [
      { key: 'logo', value: '/cciama-logo.png', type: 'image', label: 'Logo officiel' },
      { key: 'site_name', value: "Chambre de Commerce, d'Industrie, d'Agriculture, des Mines et de l'Artisanat du Tchad", type: 'text', label: "Nom officiel de l'Institution" },
      { key: 'favicon', value: '/cciama-logo.png', type: 'image', label: 'Favicon du navigateur' },
      { key: 'modal_duration', value: '5', type: 'number', label: 'Durée du modal visiteur (secondes)' },
      { key: 'marquee_speed', value: '40', type: 'number', label: 'Vitesse de défilement des logos' },
      { key: 'footer_address', value: "Avenue MOLL, B.P. 458 · N'Djamena, République du Tchad", type: 'text', label: 'Adresse physique' },
      { key: 'footer_phones', value: '+235 22 52 52 64\n+235 63 58 01 83', type: 'text', label: 'Téléphones standards' },
      { key: 'footer_email', value: 'contact@cciama-tchad.com', type: 'text', label: 'Email de contact officiel' },
      { key: 'meta_desc', value: "Portail officiel de la Chambre de Commerce, d'Industrie, d'Agriculture, des Mines et de l'Artisanat (CCIAMA) de la République du Tchad. Espace d'information, formalités d'entreprises et accompagnement des acteurs économiques.", type: 'text', label: 'Description SEO (Meta Description)' },
      {
        key: 'footer_socials',
        value: JSON.stringify([
          { platform: 'Facebook', url: '#' },
          { platform: 'Twitter', url: '#' },
          { platform: 'YouTube', url: '#' },
          { platform: 'LinkedIn', url: '#' }
        ]),
        type: 'json',
        label: 'Réseaux Sociaux'
      }
    ];

    for (const d of defaults) {
      const exists = await this.prisma.platformSetting.findUnique({ where: { key: d.key } });
      if (!exists) {
        await this.prisma.platformSetting.create({
          data: {
            ...d,
            updatedBy: 'system'
          }
        });
        this.logger.log(`Seeded default platform setting: ${d.key}`);
      }
    }
  }

  async getAllSettings() {
    return this.prisma.platformSetting.findMany();
  }

  async getPublicSettings() {
    const keys = ['logo', 'site_name', 'favicon', 'modal_duration', 'marquee_speed', 'footer_address', 'footer_phones', 'footer_email', 'footer_socials', 'meta_desc'];
    const settings = await this.prisma.platformSetting.findMany({
      where: { key: { in: keys } }
    });
    
    // Map as a direct key-value dictionary for frontend ease
    const dict: Record<string, any> = {};
    settings.forEach((s: any) => {
      if (s.type === 'json') {
        try {
          dict[s.key] = JSON.parse(s.value);
        } catch {
          dict[s.key] = s.value;
        }
      } else if (s.type === 'number') {
        dict[s.key] = Number(s.value);
      } else {
        dict[s.key] = s.value;
      }
    });
    return dict;
  }

  async updateSetting(key: string, value: string, username: string = 'admin') {
    const setting = await this.prisma.platformSetting.findUnique({ where: { key } });
    if (!setting) {
      throw new Error(`Setting with key ${key} not found`);
    }

    const oldValue = setting.value;

    // 1. Update PlatformSetting
    const updated = await this.prisma.platformSetting.update({
      where: { key },
      data: {
        value,
        updatedBy: username
      }
    });

    // 2. Track in history
    await this.prisma.contentUpdateHistory.create({
      data: {
        entityType: 'platform_setting',
        entityId: setting.id,
        field: key,
        oldValue,
        newValue: value,
        updatedBy: username
      }
    });

    // 3. Emit SSE Event for instant visitor sync!
    this.sseService.emitContentUpdate('platform_setting', key);

    return updated;
  }
}
