# 🌍 Internacionalização (i18n) - HabitMind Frontend

## 📑 Documentação Completa

### 1. 🚀 [README.md](./README.md) - Guia Principal
- Visão geral do sistema i18n
- Estrutura de diretórios
- Como usar em componentes
- Gerenciamento de idioma
- Integração com API
- Persistência de dados
- Boas práticas

**Para quem**: Desenvolvedores que vão usar i18n pela primeira vez

---

### 2. 🔧 [INTEGRATION_EXAMPLE.md](./INTEGRATION_EXAMPLE.md) - Exemplos de Integração
- Como inicializar i18n na App.tsx
- Exemplos em componentes de tela
- Integração com Settings
- Função AppInitializer

**Para quem**: Desenvolvedores implementando i18n em telas existentes

---

### 3. ✅ [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Guia de Testes
- Checklist de implementação
- 6 testes principais com passos
- Métricas de qualidade
- Troubleshooting
- Checklist de código
- Verificação antes de deploy

**Para quem**: QA, developers testando e DevOps

---

### 4. 📊 [BACKEND_COMPARISON.md](./BACKEND_COMPARISON.md) - Backend vs Frontend
- Comparação de arquitetura
- Fluxo de dados entre camadas
- Sincronização de chaves
- Formatos compatíveis
- Checklist de manutenção
- Best practices

**Para quem**: Desenvolvedores full-stack, arquitectos

---

## 📁 Estrutura de Arquivos

```
src/i18n/
├── 📄 README.md                    ← Comece aqui
├── 📄 INTEGRATION_EXAMPLE.md       ← Exemplos práticos
├── 📄 TESTING_GUIDE.md             ← Testes e validação
├── 📄 BACKEND_COMPARISON.md        ← Sincronização com backend
├── 📄 INDEX.md                     ← Este arquivo
│
├── 💾 locales/
│   ├── pt-br.json                  ← Português (padrão)
│   ├── en-us.json                  ← Inglês
│   └── es-es.json                  ← Espanhol
│
├── ⚙️  i18n.ts                     ← Funções utilitárias
├── ⚙️  useI18n.ts                  ← Hook React
└── ✔️  validate.ts                 ← Script de validação

src/store/
└── 🗂️  languageStore.ts           ← Zustand store

src/components/
└── 🎨 LanguageSelector.tsx         ← Componente UI
```

---

## 🎯 Guia Rápido por Papel

### 👨‍💻 Developer Frontend

1. Leia [README.md](./README.md) - Seção "Como Usar"
2. Veja exemplos em [LoginScreenWithI18nExample.tsx](../screens/auth/LoginScreenWithI18nExample.tsx)
3. Integre em sua tela:
```typescript
import { useI18n } from '../i18n/useI18n';

const MyScreen = () => {
  const { t } = useI18n();
  return <Text>{t('auth.messages.logged_in_successfully')}</Text>;
};
```

---

### 🧪 QA / Tester

1. Leia [TESTING_GUIDE.md](./TESTING_GUIDE.md) 
2. Execute os 6 testes principais
3. Validate sincronização:
```bash
npx ts-node src/i18n/validate.ts
```
4. Checklist antes de releasedeployar

---

### 👷 DevOps / Backend Developer

1. Leia [BACKEND_COMPARISON.md](./BACKEND_COMPARISON.md)
2. Sincronize chaves entre backend e frontend
3. Configure CI/CD para validar i18n em PRs
4. Monitore chaves não traduzidas

---

### 🏗️ Architect / Tech Lead

1. Leia [README.md](./README.md) - Seção "Arquitetura"
2. Leia [BACKEND_COMPARISON.md](./BACKEND_COMPARISON.md)
3. Planeje integração com features futuras:
   - [ ] Mais idiomas
   - [ ] Tradução dinâmica
   - [ ] Sincronização de settings do usuário
   - [ ] Suporte RTL (árabe, hebraico)

---

## 🔍 Referência Rápida

### Usar em Componente
```typescript
import { useI18n } from '../i18n/useI18n';

const { t, language } = useI18n();
const text = t('auth.messages.logged_in_successfully');
```

### Mudar Idioma
```typescript
import { useLanguageStore } from '../store/languageStore';

const { setLanguage } = useLanguageStore();
await setLanguage('en-us');
```

### Usar Componente Seletor
```typescript
import { LanguageSelector } from '../components/LanguageSelector';

<LanguageSelector onLanguageChange={(lang) => console.log(lang)} />
```

### Tradução com Parâmetros
```typescript
const { tParams } = useI18n();
const msg = tParams('messages.welcome', { name: 'João' });
```

### Validar Sincronização
```bash
npx ts-node src/i18n/validate.ts
```

---

## 📌 Idiomas Suportados

| Código   | Nome             | Status | Chaves |
|----------|------------------|--------|--------|
| `pt-br`  | Português Brasil | ✅     | 100%   |
| `en-us`  | English          | ✅     | 100%   |
| `es-es`  | Español          | ✅     | 100%   |

---

## 🚀 Checklist de Implementação

- [x] Estrutura i18n criada
- [x] 3 idiomas implementados
- [x] Hook `useI18n` criado
- [x] Store `languageStore` criado
- [x] Integração no `apiClient`
- [x] Componente `LanguageSelector`
- [x] Documentação completa
- [ ] Integração em todas as telas (em progresso)
- [ ] Testes automatizados em CI/CD (futuro)
- [ ] Monitoramento de chaves faltantes (futuro)

---

## ❓ FAQ

**P: Como adicionar novo idioma?**
- A: Crie novo arquivo JSON em `/locales/`, adicione type em i18n.ts, atualize AVAILABLE_LANGUAGES

**P: Como fazer tradução com variáveis?**
- A: Use `tParams('key', { param: 'value' })`, certifique-se que tradução tem `:param`

**P: Idioma não está sendo salvo?**
- A: Verifique se `secureStorage` funciona, check permissões do app

**P: Como saber quais chaves faltam?**
- A: Execute `npx ts-node src/i18n/validate.ts`

**P: Preciso adicionar string nova, por onde começo?**
- A: Leia [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Seção "Adicionando Novas Traduções"

---

## 📞 Suporte

### Problema com I18n?

1. Procure em [TESTING_GUIDE.md](./TESTING_GUIDE.md#-troubleshooting) - Seção Troubleshooting
2. Verifique [README.md](./README.md) - Seção Boas Práticas
3. Execute script de validação

### Novo projeto? 

Leia [INTEGRATION_EXAMPLE.md](./INTEGRATION_EXAMPLE.md)

### Dúvida sobre backend?

Leia [BACKEND_COMPARISON.md](./BACKEND_COMPARISON.md)

---

## 📊 Estatísticas

- **Total de chaves**: 80+
- **Idiomas**: 3 (pt-br, en-us, es-es)
- **Módulos**: 6 (auth, habits, users, ai, ads, common)
- **Componentes i18n**: 1 (LanguageSelector)
- **Documentação**: 5 arquivos
- **Linhas de código**: 500+

---

## 🔄 Versioning

| Versão | Data | Mudanças |
|--------|------|----------|
| 1.0    | 11/01/2026 | Release inicial |

---

## 📝 Próximas Melhorias

- [ ] Testes automatizados
- [ ] CI/CD validation
- [ ] Suporte a novo idioma (francês)
- [ ] Sincronização com preferências do usuário
- [ ] Plural forms handling
- [ ] Date/Number localization

---

**Última atualização**: 11/01/2026  
**Responsável**: Frontend Team  
**Status**: ✅ Implementado e Documentado
