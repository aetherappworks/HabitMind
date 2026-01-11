# Guia de Implementação e Testes - i18n Frontend

## ✅ Checklist de Implementação

### 1. Instalação e Configuração

- [x] Criar estrutura de diretórios `/src/i18n/`
- [x] Criar arquivos de locale JSON (`pt-br.json`, `en-us.json`, `es-es.json`)
- [x] Criar arquivo `i18n.ts` com funções utilitárias
- [x] Criar hook `useI18n.ts` para React
- [x] Criar Zustand store `languageStore.ts`
- [x] Integrar idioma no `apiClient.ts`
- [x] Criar componente `LanguageSelector.tsx`
- [x] Criar documentação `README.md`

### 2. Integração na App

Você precisa fazer as seguintes integrações no seu projeto:

#### 2.1 Adicionar inicialização na App.tsx

```typescript
import { useEffect } from 'react';
import { useLanguageStore } from './src/store/languageStore';

export default function App() {
  useEffect(() => {
    // Carregar idioma salvo ao iniciar
    useLanguageStore.getState().loadLanguage();
  }, []);

  return (
    // Seu código de navegação aqui
  );
}
```

#### 2.2 Usar i18n em uma tela de autenticação

```typescript
import { useI18n } from '../i18n/useI18n';

export default function LoginScreen() {
  const { t } = useI18n();

  return (
    <View>
      <TextInput
        placeholder={t('ui.placeholders.email')}
      />
      <Button title={t('ui.buttons.login')} />
    </View>
  );
}
```

#### 2.3 Adicionar seletor de idioma em Settings

```typescript
import { LanguageSelector } from '../components/LanguageSelector';

export default function SettingsScreen() {
  return (
    <ScrollView>
      <LanguageSelector />
      {/* Outros componentes */}
    </ScrollView>
  );
}
```

## 🧪 Testes de Funcionalidade

### Teste 1: Carregar Idioma Salvo

**Objetivo**: Verificar que o idioma é persistido e carregado na próxima sessão

**Passos**:
1. Abrir o app
2. Ir para Settings
3. Mudar para Inglês
4. Fechar o app completamente
5. Reabrir o app

**Resultado esperado**: Interface em Inglês

**Verificação de código**:
```typescript
// Verificar se o idioma foi salvo
const savedLanguage = await secureStorage.getItem('app_language');
console.log('Idioma salvo:', savedLanguage); // Deve ser 'en-us'
```

### Teste 2: Mudança de Idioma em Tempo Real

**Objetivo**: Verificar que a mudança de idioma afeta todos os componentes em tempo real

**Passos**:
1. Abrir tela de Settings
2. Clicar em diferentes idiomas
3. Observar UI mudar

**Resultado esperado**: Todos os textos mudam imediatamente

**Verificação de código**:
```typescript
// No componente
const { t, language } = useI18n();
console.log('Idioma atual:', language);
console.log('Texto traduzido:', t('auth.messages.logged_in_successfully'));
```

### Teste 3: Headers de Requisição

**Objetivo**: Verificar que o idioma é enviado nas requisições à API

**Passos**:
1. Abrir DevTools/Network Inspector
2. Fazer uma requisição (ex: login, criar hábito)
3. Verificar headers

**Resultado esperado**: Requisição contém:
- Header `Accept-Language: pt-br` (ou outro idioma)
- Query param `?lang=pt-br` (fallback)

**Verificação de código**:
```typescript
// Verificar interceptor de request
const config = await apiClient.client.interceptors.request.handlers[0].fulfilled({
  headers: {},
  url: '/api/habits',
  // ...
});
console.log('Headers:', config.headers);
// Deve conter: Accept-Language: 'pt-br'
```

### Teste 4: Chaves de Tradução Faltantes

**Objetivo**: Verificar que a app não quebra se uma chave não existir

**Passos**:
1. Abrir console
2. Chamar `t('chave.inexistente')`

**Resultado esperado**: 
- Retorna a chave como string
- Log de warning no console

**Verificação de código**:
```typescript
import { getTranslation } from './i18n/i18n';

const result = getTranslation('chave.inexistente', 'pt-br');
console.log(result); // Deve ser 'chave.inexistente'
// Verificar console por warning
```

### Teste 5: Sincronização Entre Idiomas

**Objetivo**: Verificar que todos os idiomas têm as mesmas chaves

**Script de teste**:
```typescript
import ptBR from './i18n/locales/pt-br.json';
import enUS from './i18n/locales/en-us.json';
import esES from './i18n/locales/es-es.json';

const keysEqual = (obj1: any, obj2: any, prefix = ''): string[] => {
  const missingKeys: string[] = [];
  
  Object.keys(obj1).forEach(key => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj1[key] === 'object') {
      if (!obj2[key]) {
        missingKeys.push(`Missing object: ${fullKey}`);
      } else {
        missingKeys.push(...keysEqual(obj1[key], obj2[key] || {}, fullKey));
      }
    } else {
      if (!obj2[key]) {
        missingKeys.push(`Missing key: ${fullKey}`);
      }
    }
  });
  
  return missingKeys;
};

const ptBRvsEN = keysEqual(ptBR, enUS);
const ptBRvsES = keysEqual(ptBR, esES);

console.log('Chaves faltando em en-us:', ptBRvsEN);
console.log('Chaves faltando em es-es:', ptBRvsES);

if (ptBRvsEN.length === 0 && ptBRvsES.length === 0) {
  console.log('✅ Todos os idiomas têm as mesmas chaves!');
}
```

### Teste 6: Erro de Rede e Fallback

**Objetivo**: Verificar que mensagens de erro são localizadas

**Passos**:
1. Desativar internet
2. Tentar fazer login
3. Observar mensagem de erro

**Resultado esperado**: Mensagem de erro em português (ou idioma selecionado)

**Verificação de código**:
```typescript
try {
  await apiClient.post('/auth/login', { email, password });
} catch (error) {
  const errorMessage = error.response?.data?.message;
  const localizedError = t(errorMessage);
  console.log('Erro traduzido:', localizedError);
}
```

## 📊 Métricas de Qualidade

### Cobertura de Tradução

Verifique a porcentagem de strings traduzidas:

```typescript
// Contar total de strings
const countStrings = (obj: any): number => {
  let count = 0;
  Object.values(obj).forEach(value => {
    if (typeof value === 'string') count++;
    else if (typeof value === 'object') count += countStrings(value);
  });
  return count;
};

const total = countStrings(ptBR);
console.log(`Total de strings traduzidas: ${total}`);
// Meta: > 80% de cobertura
```

### Performance

Verifique que mudanças de idioma são rápidas:

```typescript
const startTime = performance.now();
await setLanguage('en-us');
const endTime = performance.now();

console.log(`Tempo para mudar idioma: ${endTime - startTime}ms`);
// Meta: < 100ms
```

## 🐛 Troubleshooting

### Problema: Idioma não é salvo

**Solução**:
1. Verificar se `secureStorage` está funcionando
2. Executar: `await secureStorage.getItem('app_language')`
3. Verificar permissões do app no device

### Problema: Chaves não encontradas

**Solução**:
1. Adicionar chave em TODOS os 3 arquivos JSON
2. Usar ponto em chaves: `auth.errors.key`
3. Não usar caracteres especiais

### Problema: API retorna erro em português

**Solução**:
1. Backend está com idioma default como 'pt-br'
2. Frontend está enviando header corretamente
3. Verificar query param `?lang=pt-br`

### Problema: Store não atualiza componente

**Solução**:
1. Usar `useLanguageStore()` dentro do componente
2. Certificar que o store é exportado corretamente
3. Usar `const { language } = useLanguageStore()` não `useLanguageStore.getState()`

## 📝 Checklist de Código

- [ ] Nenhuma string hardcoded em telas
- [ ] Todas as telas usam `useI18n()` hook
- [ ] Formulários usam labels traduzidos
- [ ] Mensagens de erro são traduzidas
- [ ] Placeholders de input são traduzidos
- [ ] Botões têm textos traduzidos
- [ ] Alertas/modais usam `t()`

## 🚀 Deploy

Antes de fazer deploy:

1. Executar teste de sincronização de chaves
2. Verificar cobertura de tradução > 80%
3. Testar mudança de idioma em device real
4. Verificar performance
5. Testar com slow network (3G)

---

**Última atualização**: 11/01/2026
**Status**: ✅ Pronto para uso
