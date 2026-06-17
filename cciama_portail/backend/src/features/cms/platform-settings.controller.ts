import { Controller, Get, Put, Param, Body, BadRequestException } from '@nestjs/common';
import { PlatformSettingsService } from './platform-settings.service';
import { Unprotected } from 'nest-keycloak-connect';

@Controller()
@Unprotected()
export class PlatformSettingsController {
  constructor(private readonly settingsService: PlatformSettingsService) {}

  @Get('settings/public')
  async getPublicSettings() {
    return this.settingsService.getPublicSettings();
  }

  @Get('admin/settings')
  async getAdminSettings() {
    return this.settingsService.getAllSettings();
  }

  @Put('admin/settings/:key')
  async updateSetting(
    @Param('key') key: string,
    @Body('value') value: string
  ) {
    if (value === undefined || value === null) {
      throw new BadRequestException('Value must be provided');
    }
    try {
      const updated = await this.settingsService.updateSetting(key, value);
      return { success: true, setting: updated };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }
}
