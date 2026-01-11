# 🎯 IMPLEMENTAÇÃO FRONTEND - SISTEMA DE RECARGA DE CRÉDITOS

## 📋 INSTRUÇÕES DE IMPLEMENTAÇÃO

### 1️⃣ Copiar Arquivos
Copie os componentes e serviços para seu projeto frontend.

### 2️⃣ Instalar Dependências
```bash
npm install axios react-query react-icons
```

### 3️⃣ Estrutura Sugerida
```
src/
├── services/
│   └── creditService.ts
├── hooks/
│   └── useCredits.ts
└── components/
    └── CreditsScreen/
        ├── CreditsScreen.tsx
        └── styles.css
```

### 4️⃣ Usar no App
```tsx
import { CreditsScreen } from './components/CreditsScreen';

<CreditsScreen token={userToken} />
```

---

## 📦 TIPOS TYPESCRIPT

```typescript
export interface UserCredits {
  id: string;
  availableCredits: number;
  totalCredits: number;
  planType: 'free' | 'premium';
  lastCreditRefillAt?: Date;
}

export interface CreditConfig {
  limit: number;
  strategy: 'daily' | 'hourly' | 'manual';
}

export interface NextReset {
  time: Date;
  hoursUntilReset: number;
  minutesUntilReset: number;
}

export interface ReloadInfo {
  user: UserCredits;
  config: CreditConfig;
  nextReset: NextReset;
  history: ReloadHistory[];
}

export interface ReloadHistory {
  reloadType: string;
  amount: number;
  timestamp: Date;
}

export interface ReloadResponse {
  success: boolean;
  message?: string;
  credits: UserCredits;
  reloadAmount?: number;
  nextReset?: NextReset;
}
```

---

## 🔗 SERVIÇO DE API - creditService.ts

```typescript
import axios, { AxiosInstance } from 'axios';

class CreditService {
  private api: AxiosInstance;

  constructor(baseURL: string, token: string) {
    this.api = axios.create({
      baseURL,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept-Language': 'pt-br',
      },
    });
  }

  // Obter informações de créditos
  async getCreditsInfo(): Promise<ReloadInfo> {
    const response = await this.api.get('/credits/info');
    return response.data;
  }

  // Recarregar manualmente (comprar créditos)
  async reloadManual(amount: number, reason?: string): Promise<ReloadResponse> {
    const response = await this.api.post('/credits/reload/manual', {
      amount,
      reason,
    });
    return response.data;
  }

  // Forçar recarga antecipada
  async forceReload(): Promise<ReloadResponse> {
    const response = await this.api.post('/credits/reload/force');
    return response.data;
  }

  // Adicionar reward de anúncio
  async addAdReward(
    amount: number,
    adType: string,
    validationToken?: string,
  ): Promise<ReloadResponse> {
    const response = await this.api.post('/credits/reward/ad', {
      amount,
      adType,
      validationToken,
    });
    return response.data;
  }

  // Adicionar bônus promocional
  async addPromoBonus(
    amount: number,
    reason: string,
    adminNote?: string,
  ): Promise<ReloadResponse> {
    const response = await this.api.post('/credits/bonus/promo', {
      amount,
      reason,
      adminNote,
    });
    return response.data;
  }

  // Obter configuração de créditos
  async getCreditConfig(planType: 'free' | 'premium'): Promise<CreditConfig> {
    const response = await this.api.get(`/credits/config/${planType}`);
    return response.data;
  }

  // Atualizar configuração de créditos
  async updateCreditConfig(
    planType: 'free' | 'premium',
    dailyLimit: number,
    resetStrategy?: 'daily' | 'hourly' | 'manual',
  ): Promise<any> {
    const response = await this.api.post('/credits/config', {
      planType,
      dailyLimit,
      resetStrategy,
    });
    return response.data;
  }
}

export default CreditService;
```

---

## 🪝 HOOK CUSTOMIZADO - useCredits.ts

```typescript
import { useState, useEffect, useCallback } from 'react';
import CreditService from '../services/creditService';
import { ReloadInfo, ReloadResponse } from '../services/creditService';

export function useCredits(
  token: string,
  baseURL: string = 'http://localhost:3000',
) {
  const [credits, setCredits] = useState<ReloadInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [creditService] = useState(() => new CreditService(baseURL, token));

  // Carregar informações iniciais
  useEffect(() => {
    fetchCreditsInfo();
  }, [token]);

  const fetchCreditsInfo = useCallback(async () => {
    try {
      setLoading(true);
      const data = await creditService.getCreditsInfo();
      setCredits(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  }, [creditService]);

  const reloadManual = useCallback(
    async (amount: number): Promise<ReloadResponse> => {
      try {
        const result = await creditService.reloadManual(amount);
        await fetchCreditsInfo();
        return result;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao recarregar'));
        throw err;
      }
    },
    [creditService, fetchCreditsInfo],
  );

  const forceReload = useCallback(
    async (): Promise<ReloadResponse> => {
      try {
        const result = await creditService.forceReload();
        await fetchCreditsInfo();
        return result;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao forçar recarga'));
        throw err;
      }
    },
    [creditService, fetchCreditsInfo],
  );

  const addAdReward = useCallback(
    async (amount: number, adType: string): Promise<ReloadResponse> => {
      try {
        const result = await creditService.addAdReward(amount, adType);
        await fetchCreditsInfo();
        return result;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao adicionar reward'));
        throw err;
      }
    },
    [creditService, fetchCreditsInfo],
  );

  return {
    credits,
    loading,
    error,
    reloadManual,
    forceReload,
    addAdReward,
    refresh: fetchCreditsInfo,
  };
}

export default useCredits;
```

---

## 💻 COMPONENTE PRINCIPAL - CreditsScreen.tsx

```typescript
import React, { useState } from 'react';
import { FiRefreshCw, FiShoppingCart, FiTV } from 'react-icons/fi';
import useCredits from '../hooks/useCredits';
import './styles.css';

interface CreditsScreenProps {
  token: string;
  baseURL?: string;
}

export function CreditsScreen({
  token,
  baseURL = 'http://localhost:3000',
}: CreditsScreenProps) {
  const {
    credits,
    loading,
    error,
    reloadManual,
    forceReload,
    addAdReward,
    refresh,
  } = useCredits(token, baseURL);

  const [showReloadOptions, setShowReloadOptions] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (loading) {
    return (
      <div className="credits-loading">
        <div className="spinner"></div>
        <p>Carregando créditos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="credits-error">
        <p>❌ Erro ao carregar créditos</p>
        <p className="error-message">{error.message}</p>
        <button onClick={() => refresh()}>Tentar novamente</button>
      </div>
    );
  }

  if (!credits) {
    return <div className="credits-empty">Nenhum dado disponível</div>;
  }

  const { user, config, nextReset } = credits;
  const percentageUsed = ((config.limit - user.availableCredits) / config.limit) * 100;

  const handleForceReload = async () => {
    try {
      setIsProcessing(true);
      await forceReload();
    } catch (err) {
      console.error('Erro ao forçar recarga:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReload = async (amount: number) => {
    try {
      setIsProcessing(true);
      await reloadManual(amount);
      setShowReloadOptions(false);
    } catch (err) {
      console.error('Erro ao recarregar:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAdReward = async () => {
    try {
      setIsProcessing(true);
      await addAdReward(10, 'rewarded');
    } catch (err) {
      console.error('Erro ao adicionar reward:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="credits-screen">
      {/* Header */}
      <div className="credits-header">
        <h1>🪙 Meus Créditos</h1>
        <span className="plan-badge">
          {user.planType === 'free' ? '🆓 Plano Free' : '⭐ Plano Premium'}
        </span>
      </div>

      {/* Main Balance Card */}
      <div className="balance-card">
        <div className="credit-amount">
          <h2>{user.availableCredits}</h2>
          <p>créditos disponíveis</p>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${percentageUsed}%` }}
            ></div>
          </div>
          <p className="progress-text">
            {user.availableCredits} de {config.limit} créditos
          </p>
        </div>
      </div>

      {/* Next Reset Info */}
      <div className="reset-info">
        <div className="reset-item">
          <span className="label">⏰ Próximo Reset:</span>
          <span className="time">
            {nextReset.hoursUntilReset}h {nextReset.minutesUntilReset}min
          </span>
        </div>
        <p className="reset-type">
          Reset {config.strategy === 'daily' ? 'diário (00:00 UTC)' : 'a cada hora'}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          className="btn btn-secondary"
          onClick={handleForceReload}
          disabled={isProcessing || user.availableCredits === config.limit}
          title={
            user.availableCredits === config.limit
              ? 'Seus créditos estão no máximo'
              : 'Força recarga antecipada'
          }
        >
          <FiRefreshCw size={18} />
          Forçar Recarga
        </button>

        <button
          className="btn btn-primary"
          onClick={() => setShowReloadOptions(!showReloadOptions)}
          disabled={isProcessing}
        >
          <FiShoppingCart size={18} />
          Comprar Créditos
        </button>

        <button
          className="btn btn-secondary"
          onClick={handleAdReward}
          disabled={isProcessing}
        >
          <FiTV size={18} />
          Assistir Anúncio
        </button>
      </div>

      {/* Reload Options */}
      {showReloadOptions && (
        <div className="reload-options">
          <div className="options-grid">
            {[
              { amount: 50, price: '$2.99' },
              { amount: 100, price: '$4.99' },
              { amount: 250, price: '$9.99' },
              { amount: 500, price: '$19.99' },
            ].map(({ amount, price }) => (
              <button
                key={amount}
                className="option-card"
                onClick={() => handleReload(amount)}
                disabled={isProcessing}
              >
                <span className="amount">{amount}</span>
                <span className="label">créditos</span>
                <span className="price">{price}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <div className="faq-section">
        <h3>❓ Dúvidas Frequentes</h3>
        <details>
          <summary>Como ganho créditos?</summary>
          <div className="faq-content">
            <p>Você pode ganhar créditos de várias formas:</p>
            <ul>
              <li>📅 <strong>Reset Diário:</strong> 20 créditos todos os dias</li>
              <li>📺 <strong>Assistir Anúncios:</strong> +10 créditos por anúncio</li>
              <li>🛒 <strong>Comprar:</strong> Pacotes personalizados</li>
            </ul>
          </div>
        </details>

        <details>
          <summary>Para que servem créditos?</summary>
          <div className="faq-content">
            <p>Créditos são usados para acessar funcionalidades premium do HabitMind:</p>
            <ul>
              <li>🤖 Análise profunda de hábitos com IA</li>
              <li>💡 Insights personalizados</li>
              <li>📊 Relatórios detalhados</li>
            </ul>
          </div>
        </details>

        <details>
          <summary>Como fazer upgrade para Premium?</summary>
          <div className="faq-content">
            <p>Upgrade para Premium e ganhe <strong>300 créditos por hora</strong>!</p>
            <button className="btn btn-primary">Upgrade Agora</button>
          </div>
        </details>
      </div>
    </div>
  );
}

export default CreditsScreen;
```

---

## 🎨 ESTILOS CSS - styles.css

```css
/* LOADING & ERROR STATES */
.credits-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.credits-error {
  background: #fee;
  border: 2px solid #f44;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  margin: 20px;
}

.error-message {
  color: #666;
  margin: 10px 0;
  font-size: 14px;
}

/* MAIN SCREEN */
.credits-screen {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* HEADER */
.credits-header {
  text-align: center;
  margin-bottom: 30px;
}

.credits-header h1 {
  margin: 0 0 10px 0;
  font-size: 28px;
}

.plan-badge {
  display: inline-block;
  background: #f5f5f5;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  color: #666;
}

/* BALANCE CARD */
.balance-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  padding: 40px 30px;
  margin-bottom: 20px;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.credit-amount h2 {
  font-size: 56px;
  margin: 0 0 5px 0;
  font-weight: 700;
}

.credit-amount p {
  margin: 0 0 25px 0;
  opacity: 0.95;
  font-size: 15px;
}

/* PROGRESS BAR */
.progress-container {
  margin-top: 20px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  transition: width 0.3s ease;
}

.progress-text {
  margin: 12px 0 0 0;
  font-size: 13px;
  opacity: 0.9;
}

/* RESET INFO */
.reset-info {
  background: #f9f9f9;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.reset-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.reset-item .label {
  font-weight: 600;
}

.reset-item .time {
  color: #667eea;
  font-weight: 700;
  font-size: 16px;
}

.reset-type {
  margin: 0;
  font-size: 13px;
  color: #666;
}

/* BUTTONS */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 20px;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: #e0e0e0;
  color: #333;
}

.btn-secondary:hover:not(:disabled) {
  background: #d0d0d0;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* RELOAD OPTIONS */
.reload-options {
  margin-bottom: 20px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.option-card {
  display: flex;
  flex-direction: column;
  padding: 20px 15px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  font-size: 14px;
}

.option-card:hover:not(:disabled) {
  border-color: #667eea;
  background: #f9f9ff;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.option-card:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.option-card .amount {
  font-weight: 700;
  color: #333;
  font-size: 18px;
  margin-bottom: 5px;
}

.option-card .label {
  font-size: 12px;
  color: #999;
  margin-bottom: 5px;
}

.option-card .price {
  color: #667eea;
  font-weight: 600;
  font-size: 14px;
}

/* FAQ */
.faq-section {
  border-top: 1px solid #e0e0e0;
  padding-top: 20px;
}

.faq-section h3 {
  margin: 0 0 15px 0;
  font-size: 16px;
}

.faq-section details {
  margin-bottom: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.faq-section summary {
  cursor: pointer;
  padding: 14px;
  background: #f9f9f9;
  font-weight: 600;
  user-select: none;
}

.faq-section summary:hover {
  background: #f0f0f0;
}

.faq-section details[open] summary {
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.faq-content {
  padding: 15px;
  color: #666;
  font-size: 14px;
}

.faq-content p {
  margin: 0 0 10px 0;
}

.faq-content ul {
  margin: 10px 0;
  padding-left: 25px;
}

.faq-content li {
  margin-bottom: 8px;
}

/* RESPONSIVE */
@media (max-width: 480px) {
  .credits-screen {
    padding: 16px;
  }

  .balance-card {
    padding: 30px 20px;
  }

  .credit-amount h2 {
    font-size: 42px;
  }

  .action-buttons {
    gap: 10px;
  }

  .btn {
    font-size: 14px;
    padding: 12px 16px;
  }
}
```

---

## 📱 EXEMPLO DE USO NO APP

```typescript
// App.tsx ou main component

import React, { useState, useEffect } from 'react';
import CreditsScreen from './components/CreditsScreen/CreditsScreen';

function App() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Obter token do localStorage ou contexto de autenticação
    const savedToken = localStorage.getItem('auth_token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  if (!token) {
    return <div>Faça login para ver seus créditos</div>;
  }

  return (
    <div>
      <CreditsScreen 
        token={token} 
        baseURL="http://localhost:3000"
      />
    </div>
  );
}

export default App;
```

---

## 🔌 INTEGRAÇÃO COM CONTEXTO DE AUTENTICAÇÃO

```typescript
// useAuth.ts (exemplo com React Context)
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// App.tsx
import { useAuth } from './hooks/useAuth';
import CreditsScreen from './components/CreditsScreen';

function App() {
  const { token, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <CreditsScreen token={token} />;
}
```

---

## 📡 ENDPOINTS DISPONÍVEIS

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/credits/info` | Obter informações de créditos |
| POST | `/credits/reload/manual` | Recarregar manualmente |
| POST | `/credits/reload/force` | Forçar recarga antecipada |
| POST | `/credits/reward/ad` | Adicionar reward de anúncio |
| POST | `/credits/bonus/promo` | Adicionar bônus promocional |
| GET | `/credits/config/:planType` | Obter configuração |
| POST | `/credits/config` | Atualizar configuração |
| POST | `/credits/user/:userId/bonus` | Bonus para usuário específico |

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Criar arquivo `src/services/creditService.ts`
- [ ] Criar arquivo `src/hooks/useCredits.ts`
- [ ] Criar arquivo `src/components/CreditsScreen/CreditsScreen.tsx`
- [ ] Criar arquivo `src/components/CreditsScreen/styles.css`
- [ ] Instalar dependências: `npm install axios react-query react-icons`
- [ ] Importar `CreditsScreen` no app principal
- [ ] Passar token válido como prop
- [ ] Testar endpoints com API rodando
- [ ] Customizar preços/valores de créditos
- [ ] Integrar com gateway de pagamento
- [ ] Configurar retry logic e error handling

---

## 🚀 PRÓXIMOS PASSOS

1. **Integração de Pagamento**: Integrar com Stripe ou Google Play
2. **Notificações**: Notificar quando créditos estão baixos
3. **Dashboard Admin**: Criar painel para monitorar uso
4. **Expiration**: Implementar expiração de créditos
5. **Analytics**: Rastrear comportamento de compra
6. **Multi-idioma**: Expandir suporte i18n

---

## 📞 SUPORTE

Para dúvidas sobre a implementação, consulte:
- Documentação do backend: `/docs/billing/`
- API Reference: `/docs/api/API_REFERENCE.md`
- Exemplos de código: `/docs/implementation/04_CREDIT_RELOAD_EXAMPLES.md`
