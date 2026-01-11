import { Module } from '@nestjs/common';
import { Global } from '@nestjs/common';
import { I18nModule, QueryResolver, CookieResolver, AcceptLanguageResolver } from 'nestjs-i18n';
import * as path from 'path';
import { I18nService } from './i18n.service';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'pt-br',
      loaderOptions: {
        path: path.join(process.cwd(), 'dist', 'i18n', 'locales'),
        watch: false,
      },
      resolvers: [
        AcceptLanguageResolver,
        { use: QueryResolver, options: ['lang', 'language'] },
        { use: CookieResolver, options: ['lang'] },
      ],
    }),
  ],
  providers: [I18nService],
  exports: [I18nService],
})
@Global()
export class I18nCustomModule {}
