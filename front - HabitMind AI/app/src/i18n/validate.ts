/**
 * Script de Validação - i18n
 * 
 * Execute este script para validar que todas as chaves estão sincronizadas
 * entre os 3 idiomas (pt-br, en-us, es-es)
 * 
 * Uso:
 * node src/i18n/validate.js
 * 
 * ou no TypeScript:
 * ts-node src/i18n/validate.ts
 */

import * as ptBR from './locales/pt-br.json';
import * as enUS from './locales/en-us.json';
import * as esES from './locales/es-es.json';

interface ValidationResult {
  language: string;
  missingKeys: string[];
  extraKeys: string[];
  totalKeys: number;
  isValid: boolean;
}

/**
 * Extrai todas as chaves de um objeto aninhado
 */
function extractKeys(obj: any, prefix = ''): string[] {
  const keys: string[] = [];

  Object.keys(obj).forEach(key => {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      keys.push(...extractKeys(obj[key], fullKey));
    } else if (typeof obj[key] === 'string') {
      keys.push(fullKey);
    }
  });

  return keys;
}

/**
 * Valida um idioma contra uma lista de chaves de referência
 */
function validateLanguage(
  locale: any,
  referenceKeys: string[],
  languageName: string
): ValidationResult {
  const localeKeys = extractKeys(locale);
  const localeKeySet = new Set(localeKeys);
  const referenceKeySet = new Set(referenceKeys);

  const missingKeys = referenceKeys.filter(key => !localeKeySet.has(key));
  const extraKeys = localeKeys.filter(key => !referenceKeySet.has(key));

  return {
    language: languageName,
    missingKeys,
    extraKeys,
    totalKeys: localeKeys.length,
    isValid: missingKeys.length === 0 && extraKeys.length === 0,
  };
}

/**
 * Executa validação completa
 */
function validateAll(): void {
  console.log('🔍 Validando sincronização de idiomas...\n');

  const referenceKeys = extractKeys(ptBR);
  console.log(`📊 Total de chaves de referência (pt-br): ${referenceKeys.length}\n`);

  const results = [
    validateLanguage(enUS, referenceKeys, 'English (en-us)'),
    validateLanguage(esES, referenceKeys, 'Español (es-es)'),
  ];

  let allValid = true;

  results.forEach(result => {
    console.log(`\n📋 ${result.language}`);
    console.log(`   Total de chaves: ${result.totalKeys}`);

    if (result.missingKeys.length > 0) {
      console.log(`   ❌ Chaves faltando (${result.missingKeys.length}):`);
      result.missingKeys.forEach(key => {
        console.log(`      - ${key}`);
      });
      allValid = false;
    } else {
      console.log(`   ✅ Todas as chaves presentes`);
    }

    if (result.extraKeys.length > 0) {
      console.log(`   ⚠️  Chaves extras (${result.extraKeys.length}):`);
      result.extraKeys.forEach(key => {
        console.log(`      - ${key}`);
      });
      allValid = false;
    }
  });

  console.log('\n' + '='.repeat(50));
  if (allValid) {
    console.log('✅ Validação PASSOU - Todos os idiomas estão sincronizados!');
  } else {
    console.log('❌ Validação FALHOU - Sincronize os idiomas acima');
  }
  console.log('='.repeat(50) + '\n');

  return allValid ? undefined : process.exit(1);
}

/**
 * Gera relatório detalhado
 */
function generateReport(): void {
  const keys = {
    'pt-br': extractKeys(ptBR),
    'en-us': extractKeys(enUS),
    'es-es': extractKeys(esES),
  };

  const report = {
    timestamp: new Date().toISOString(),
    totalKeysPerLanguage: {
      'pt-br': keys['pt-br'].length,
      'en-us': keys['en-us'].length,
      'es-es': keys['es-es'].length,
    },
    sync: {
      'pt-br_vs_en-us': {
        missing: keys['en-us'].filter(k => !keys['pt-br'].includes(k)),
        extra: keys['en-us'].filter(k => keys['pt-br'].includes(k)),
      },
      'pt-br_vs_es-es': {
        missing: keys['es-es'].filter(k => !keys['pt-br'].includes(k)),
        extra: keys['es-es'].filter(k => keys['pt-br'].includes(k)),
      },
    },
  };

  console.log(JSON.stringify(report, null, 2));

  // Salvar em arquivo
  const fs = require('fs');
  fs.writeFileSync(
    'i18n-validation-report.json',
    JSON.stringify(report, null, 2)
  );
  console.log('\n📄 Relatório salvo em i18n-validation-report.json');
}

// Exportar funções para uso em outros arquivos
export { extractKeys, validateLanguage, validateAll, generateReport };

// Executar se chamado diretamente
if (require.main === module) {
  validateAll();
}
