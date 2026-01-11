# 📚 Organização de Documentação - HabitMind AI

## Estrutura Completa de Pastas

```
docs/
│
├── README.md                          ← Índice principal
├── 00_INDEX.md                        ← Índice detalhado completo
├── ORGANIZATION.md                    ← Este arquivo (estrutura)
│
├── 📂 overview/                       ← Visão Geral do Projeto
│   └── 01_START_HERE.md              ← Ponto de entrada
│
├── 📂 setup/                          ← Instalação e Configuração
│   ├── 00_README.md                  ← Índice da seção
│   ├── 01_QUICK_START.md             ← Setup rápido
│   └── 02_SETUP_COMPLETE.md          ← Configuração completa
│
├── 📂 architecture/                   ← Arquitetura & Design
│   ├── 00_ARCHITECTURE.md            ← Design do sistema
│   ├── 01_IMPLEMENTATION.md          ← Detalhes de implementação
│   └── 02_BACKEND_SETUP.md           ← Específico do backend
│
├── 📂 planning/                       ← Planejamento & Roadmap
│   ├── 01_PHASE_0_CHECKLIST.md       ← Fase inicial
│   ├── 02_PRD.md                     ← Product Requirements
│   ├── 03_MONETIZATION.md            ← Estratégia de monetização
│   └── 04_CRONOGRAMA.md              ← Timeline do projeto
│
├── 📂 implementation/                 ← Detalhes Técnicos
│   ├── 00_FINAL_SUMMARY.md           ← Resumo final
│   ├── 01_I18N_CHECKLIST.md          ← Checklist i18n
│   ├── 02_I18N_START_HERE.md         ← Guia i18n
│   ├── 03_I18N_EXAMPLES.md           ← Exemplos de código
│   ├── 04_I18N_DIAGRAMS.md           ← Diagramas visuais
│   └── I18N_STATUS.md                ← Status de i18n
│
├── 📂 api/                            ← Documentação da API
│   ├── 00_README.md                  ← Índice da API
│   └── API_REFERENCE.md              ← Referência completa
│
├── 📂 billing/                        ← Bilhetagem & Monetização
│   ├── 00_README.md                  ← Índice da seção
│   ├── 01_CREDITS_SYSTEM.md          ← Sistema de créditos
│   └── 02_RATE_LIMITING.md           ← Rate limiting
│
└── 📂 frontend/                       ← Frontend & UI
    ├── 00_README.md                  ← Índice da seção
    ├── 01_FRONTEND_GUIDE.md          ← Guia do frontend
    └── 02_DELIVERABLES.md            ← Entregas finais
```

## 🏷️ Convenção de Nomes

### Prefixos Numéricos
- `00_` = README / Índice da seção
- `01_`, `02_`, `03_`, etc. = Documentos em ordem sequencial

### Exemplos
✅ `01_QUICK_START.md` - Primeira doc após índice
✅ `02_SETUP_COMPLETE.md` - Segunda doc
❌ `QUICK_START.md` - Sem prefixo (obsoleto)

## 📂 Hierarquia

### Nível 1: Pastas Principais
Cada pasta representa uma área do projeto:
- `overview/` - Comece aqui!
- `setup/` - Para configurar o ambiente
- `architecture/` - Para entender o design
- `planning/` - Para ver o roadmap
- `implementation/` - Para aspectos técnicos
- `api/` - Para integração
- `billing/` - Para monetização
- `frontend/` - Para interface

### Nível 2: Arquivos Individuais
Cada arquivo trata de um tópico específico

## 🔍 Como Navegar

### Para Iniciantes
1. Comece em: `overview/01_START_HERE.md`
2. Depois: `setup/01_QUICK_START.md`
3. Finalmente: `architecture/00_ARCHITECTURE.md`

### Para Desenvolvedores
1. `architecture/00_ARCHITECTURE.md` - Entenda o design
2. `implementation/` - Explore detalhes técnicos
3. `api/API_REFERENCE.md` - Conheça os endpoints

### Para Product Managers
1. `planning/02_PRD.md` - Requisitos do produto
2. `planning/03_MONETIZATION.md` - Modelo de negócio
3. `planning/04_CRONOGRAMA.md` - Timeline

## 📋 Manutenção

### Adicionar Novo Documento
1. Coloque na pasta apropriada
2. Use prefixo numérico (`XX_`)
3. Use UPPERCASE_WITH_UNDERSCORES para nomes
4. Adicione link em `README.md` da pasta

### Exemplo
```
docs/implementation/05_NEW_FEATURE.md
                    ↑
                 Próximo número
```

### Atualizar Índices
- `README.md` - Links principais
- `00_INDEX.md` - Índice completo
- `ORGANIZATION.md` - Este arquivo

## ✅ Status da Organização

- ✅ Estrutura de pastas criada
- ✅ Arquivos renomeados com prefixos
- ✅ Duplicatas removidas
- ✅ README.md raiz atualizado
- ✅ Índices criados/atualizados
- ✅ Convenção de nomes estabelecida

---

**Última atualização:** Janeiro 2026  
**Versão:** 1.0  
**Mantido por:** Documentação do Projeto
