import { Injectable } from '@nestjs/common';
import { I18nRequestScopeService, I18nService } from 'nestjs-i18n';

@Injectable()
export class AppService {
  constructor(
    private readonly i18nRequestScopeService: I18nRequestScopeService,
    private readonly i18nService: I18nService,
  ) {}
  getHello(): { message: string } {
    return {
      message: this.i18nRequestScopeService.t('errors.HELLO'),
    };
  }

  getSupportedLanguages(): string[] {
    return this.i18nService.getSupportedLanguages();
  }
}
