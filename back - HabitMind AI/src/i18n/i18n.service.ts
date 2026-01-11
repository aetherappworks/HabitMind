import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class I18nService {
  private translations: Map<string, any> = new Map();

  constructor() {
    this.loadTranslations();
  }

  private loadTranslations() {
    const localesPath = path.join(process.cwd(), 'dist', 'i18n', 'locales');
    const languages = ['pt-br', 'en-us', 'es-es'];

    languages.forEach(lang => {
      try {
        const filePath = path.join(localesPath, `${lang}.json`);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf-8');
          this.translations.set(lang, JSON.parse(content));
        }
      } catch (error) {
        console.error(`Failed to load translations for ${lang}:`, error);
      }
    });
  }

  /**
   * Traduz uma chave
   * @param key Chave da tradução (ex: 'auth.errors.user_not_found')
   * @param lang Idioma (ex: 'pt-br', 'en-us')
   */
  t(key: string, lang: string = 'pt-br'): string {
    try {
      const trans = this.translations.get(lang);
      if (!trans) {
        return key;
      }

      const keys = key.split('.');
      let value: any = trans;

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return key;
        }
      }

      return typeof value === 'string' ? value : key;
    } catch (error) {
      return key;
    }
  }

  /**
   * Traduz com parâmetros
   * @param key Chave da tradução
   * @param params Parâmetros para interpolação
   * @param lang Idioma
   */
  tParams(key: string, params: any, lang: string = 'pt-br'): string {
    let translation = this.t(key, lang);

    if (params && typeof params === 'object') {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`:${param}`, String(value));
      });
    }

    return translation;
  }

  /**
   * Retorna todos os idiomas disponíveis
   */
  getAvailableLanguages(): string[] {
    return ['pt-br', 'en-us', 'es-es'];
  }
}
