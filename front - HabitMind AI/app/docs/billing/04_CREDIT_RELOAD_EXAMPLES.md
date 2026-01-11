# 🧪 Exemplos Práticos de Uso - Sistema de Recarga de Créditos

## 📚 Índice

1. [Exemplos cURL](#exemplos-curl)
2. [Exemplos TypeScript](#exemplos-typescript)
3. [Exemplos JavaScript/Fetch](#exemplos-javascriptfetch)
4. [Cenários de Negócio](#cenários-de-negócio)
5. [Integração com Frontend](#integração-com-frontend)

---

## 📡 Exemplos cURL

### 1. Obter informações de créditos

```bash
curl -X GET http://localhost:3000/credits/info \
  -H "Authorization: Bearer TOKEN_JWT" \
  -H "Accept-Language: pt-br"
```

### 2. Recarregar créditos manualmente (100 créditos)

```bash
curl -X POST http://localhost:3000/credits/reload/manual \
  -H "Authorization: Bearer TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "reason": "Compra via Google Play Store"
  }'
```

### 3. Forçar recarga (Free: diário, Premium: horário)

```bash
curl -X POST http://localhost:3000/credits/reload/force \
  -H "Authorization: Bearer TOKEN_JWT"
```

### 4. Adicionar recompensa por anúncio (10 créditos, tipo rewarded)

```bash
curl -X POST http://localhost:3000/credits/reward/ad \
  -H "Authorization: Bearer TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 10,
    "adType": "rewarded",
    "validationToken": "token_from_ad_network"
  }'
```

### 5. Adicionar bônus promocional (50 créditos)

```bash
curl -X POST http://localhost:3000/credits/bonus/promo \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50,
    "reason": "Bônus de boas-vindas",
    "adminNote": "Novo usuário via referral"
  }'
```

### 6. Obter configuração de plano Free

```bash
curl -X GET http://localhost:3000/credits/config/free \
  -H "Authorization: Bearer TOKEN_JWT"
```

### 7. Atualizar configuração de créditos (Admin)

```bash
curl -X POST http://localhost:3000/credits/config \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "planType": "free",
    "dailyLimit": 30,
    "resetStrategy": "daily"
  }'
```

### 8. Adicionar bônus a usuário específico (Admin)

```bash
curl -X POST http://localhost:3000/credits/user/user123/bonus \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "reason": "Compensação por bug no app"
  }'
```

---

## 🔤 Exemplos TypeScript

### Classe de Serviço para API

```typescript
import axios, { AxiosInstance } from 'axios';

interface CreditInfo {
  user: {
    id: string;
    planType: string;
    availableCredits: number;
    totalCredits: number;
  };
  config: {
    limit: number;
    strategy: 'daily' | 'hourly' | 'manual';
  };
  nextReset: {
    time: Date;
    hoursUntilReset: number;
    minutesUntilReset: number;
  };
}

export class CreditService {
  private api: AxiosInstance;
  private token: string;

  constructor(baseURL: string, token: string) {
    this.token = token;
    this.api = axios.create({
      baseURL,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept-Language': 'pt-br',
      },
    });
  }

  /**
   * Obter informações de créditos
   */
  async getCreditsInfo(): Promise<CreditInfo> {
    const response = await this.api.get('/credits/info');
    return response.data;
  }

  /**
   * Recarregar créditos manualmente
   */
  async reloadManual(amount: number, reason?: string) {
    const response = await this.api.post('/credits/reload/manual', {
      amount,
      reason,
    });
    return response.data;
  }

  /**
   * Forçar recarga
   */
  async forceReload() {
    const response = await this.api.post('/credits/reload/force');
    return response.data;
  }

  /**
   * Adicionar recompensa por anúncio
   */
  async addAdReward(amount: number, adType: string, validationToken?: string) {
    const response = await this.api.post('/credits/reward/ad', {
      amount,
      adType,
      validationToken,
    });
    return response.data;
  }

  /**
   * Adicionar bônus promocional
   */
  async addPromoBonus(amount: number, reason: string, adminNote?: string) {
    const response = await this.api.post('/credits/bonus/promo', {
      amount,
      reason,
      adminNote,
    });
    return response.data;
  }

  /**
   * Obter configuração de um plano
   */
  async getCreditConfig(planType: 'free' | 'premium') {
    const response = await this.api.get(`/credits/config/${planType}`);
    return response.data;
  }

  /**
   * Atualizar configuração (Admin)
   */
  async updateCreditConfig(
    planType: 'free' | 'premium',
    dailyLimit: number,
    resetStrategy?: 'daily' | 'hourly' | 'manual',
  ) {
    const response = await this.api.post('/credits/config', {
      planType,
      dailyLimit,
      resetStrategy,
    });
    return response.data;
  }

  /**
   * Adicionar bônus a usuário específico (Admin)
   */
  async addBonusToUser(
    userId: string,
    amount: number,
    reason: string,
  ) {
    const response = await this.api.post(
      `/credits/user/${userId}/bonus`,
      { amount, reason },
    );
    return response.data;
  }
}

// ============================================
// Exemplo de Uso
// ============================================

async function main() {
  const creditService = new CreditService(
    'http://localhost:3000',
    'seu_token_jwt_aqui',
  );

  try {
    // 1. Obter informações
    const info = await creditService.getCreditsInfo();
    console.log('Créditos disponíveis:', info.user.availableCredits);

    // 2. Recarregar manualmente
    const reload = await creditService.reloadManual(50, 'Compra');
    console.log('Novo saldo:', reload.credits.availableCredits);

    // 3. Adicionar recompensa de anúncio
    const adReward = await creditService.addAdReward(10, 'rewarded');
    console.log('Recompensa adicionada:', adReward.credits.availableCredits);
  } catch (error) {
    console.error('Erro:', error.response?.data || error.message);
  }
}

main();
```

---

## 📦 Exemplos JavaScript/Fetch

### Hook React para Gerenciar Créditos

```typescript
import { useState, useEffect } from 'react';

interface UseCreditsReturn {
  credits: any;
  loading: boolean;
  error: any;
  reloadManual: (amount: number) => Promise<void>;
  forceReload: () => Promise<void>;
  addAdReward: (amount: number, adType: string) => Promise<void>;
}

export function useCredits(token: string): UseCreditsReturn {
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseURL = 'http://localhost:3000';
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept-Language': 'pt-br',
  };

  // Carregar informações de créditos
  useEffect(() => {
    fetchCreditsInfo();
  }, [token]);

  const fetchCreditsInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseURL}/credits/info`, { headers });
      const data = await response.json();
      setCredits(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const reloadManual = async (amount: number) => {
    try {
      const response = await fetch(`${baseURL}/credits/reload/manual`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ amount }),
      });
      const data = await response.json();
      setCredits((prev: any) => ({
        ...prev,
        user: data.credits,
      }));
    } catch (err) {
      setError(err);
    }
  };

  const forceReload = async () => {
    try {
      const response = await fetch(`${baseURL}/credits/reload/force`, {
        method: 'POST',
        headers,
      });
      const data = await response.json();
      await fetchCreditsInfo(); // Atualizar dados
    } catch (err) {
      setError(err);
    }
  };

  const addAdReward = async (amount: number, adType: string) => {
    try {
      const response = await fetch(`${baseURL}/credits/reward/ad`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ amount, adType }),
      });
      const data = await response.json();
      setCredits((prev: any) => ({
        ...prev,
        user: data.credits,
      }));
    } catch (err) {
      setError(err);
    }
  };

  return {
    credits,
    loading,
    error,
    reloadManual,
    forceReload,
    addAdReward,
  };
}

// ============================================
// Componente React de Exemplo
// ============================================

export function CreditsPanel({ token }: { token: string }) {
  const {
    credits,
    loading,
    error,
    reloadManual,
    forceReload,
    addAdReward,
  } = useCredits(token);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <div className="credits-panel">
      <h2>Meus Créditos</h2>

      {/* Saldo Atual */}
      <div className="credit-balance">
        <p>
          <strong>Créditos Disponíveis:</strong>{' '}
          {credits?.user?.availableCredits || 0}
        </p>
        <p>
          <strong>Total Acumulado:</strong>{' '}
          {credits?.user?.totalCredits || 0}
        </p>
      </div>

      {/* Próximo Reset */}
      <div className="next-reset">
        <p>
          <strong>Próximo Reset:</strong>{' '}
          {credits?.nextReset?.hoursUntilReset}h{' '}
          {credits?.nextReset?.minutesUntilReset}min
        </p>
        <p>
          <strong>Tipo:</strong> {credits?.config?.strategy}
        </p>
      </div>

      {/* Botões de Ação */}
      <div className="actions">
        <button onClick={() => forceReload()}>
          Forçar Recarga
        </button>
        <button onClick={() => reloadManual(50)}>
          Comprar 50 Créditos
        </button>
        <button onClick={() => addAdReward(10, 'rewarded')}>
          Assistir Anúncio
        </button>
      </div>

      {/* Histórico */}
      <div className="history">
        <h3>Histórico Recente</h3>
        <ul>
          {credits?.history?.map((h: any, i: number) => (
            <li key={i}>
              {h.reloadType}: +{h.amount} créditos (
              {new Date(h.timestamp).toLocaleDateString('pt-BR')})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

---

## 🎯 Cenários de Negócio

### Cenário 1: Novo Usuário - Bônus de Boas-vindas

```typescript
// No serviço de autenticação, após criar novo usuário

async function registerUser(email: string, password: string) {
  // 1. Criar usuário
  const user = await authService.createUser(email, password);

  // 2. Adicionar bônus de boas-vindas
  await creditReloadService.addPromoBonus(
    user.id,
    50, // 50 créditos
    'Bônus de boas-vindas',
  );

  return user;
}
```

### Cenário 2: Usuário Assiste Anúncio - Ganhar Créditos

```typescript
// Em um serviço de ads

@Injectable()
export class AdService {
  constructor(
    private creditReloadService: CreditReloadService,
    private adsService: AdsService,
  ) {}

  async handleAdCompletion(userId: string, adType: string) {
    // 1. Validar conclusão do anúncio
    const adConfig = await this.adsService.getAdConfig(adType);

    // 2. Adicionar recompensa ao usuário
    await this.creditReloadService.addAdReward(
      userId,
      adConfig.rewardAmount,
      adType,
    );

    // 3. Registrar visualização
    await this.adsService.recordAdView(userId, adType);

    return { success: true, reward: adConfig.rewardAmount };
  }
}
```

### Cenário 3: Compra de Créditos via In-App Purchase

```typescript
// Integração com Google Play ou Apple App Store

@Injectable()
export class PaymentService {
  constructor(
    private creditReloadService: CreditReloadService,
    private paymentProvider: PaymentProvider, // Stripe, etc
  ) {}

  async processPurchase(userId: string, packageId: string) {
    // 1. Validar pagamento com provider
    const receipt = await this.paymentProvider.verifyReceipt(
      packageId,
    );

    if (!receipt.valid) {
      throw new BadRequestException('Pagamento inválido');
    }

    // 2. Mapear pacote para quantidade de créditos
    const creditMap: Record<string, number> = {
      'package_50': 50,
      'package_100': 100,
      'package_250': 250,
      'package_500': 500,
    };

    const amount = creditMap[packageId];

    // 3. Adicionar créditos
    const result = await this.creditReloadService.reloadCreditsManual(
      userId,
      amount,
      `Compra de ${amount} créditos - ${packageId}`,
    );

    return result;
  }
}
```

### Cenário 4: Campanha Promocional - Bônus em Massa

```typescript
// Admin quer dar bônus de 100 créditos para todos os usuários

@Injectable()
export class AdminService {
  constructor(
    private creditReloadService: CreditReloadService,
    private prisma: PrismaService,
  ) {}

  async grantPromoToAllUsers(amount: number, reason: string) {
    // 1. Buscar todos os usuários
    const users = await this.prisma.user.findMany({
      select: { id: true },
    });

    // 2. Adicionar bônus para cada um
    const results = await Promise.all(
      users.map((user) =>
        this.creditReloadService.addPromoBonus(
          user.id,
          amount,
          reason,
        ),
      ),
    );

    return {
      success: true,
      usersAffected: results.length,
      totalCreditDistributed: results.length * amount,
    };
  }
}
```

### Cenário 5: Reset Manual para Manutenção

```typescript
// Admin precisa fazer reset manual dos créditos

@Injectable()
export class AdminService {
  constructor(
    private creditReloadService: CreditReloadService,
    private prisma: PrismaService,
  ) {}

  async manualResetForMaintenance() {
    // Atualizar configuração temporariamente
    this.creditReloadService.updateCreditConfig('free', {
      dailyLimit: 20,
      resetStrategy: 'daily',
    });

    // Resetar todos os usuários
    const freeUsers = await this.prisma.user.findMany({
      where: { planType: 'free' },
    });

    for (const user of freeUsers) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { availableCredits: 20 },
      });
    }

    return { success: true, usersReset: freeUsers.length };
  }
}
```

---

## 🎨 Integração com Frontend

### Exemplo: Tela de Créditos (React)

```typescript
import React, { useState, useEffect } from 'react';
import { useCredits } from './hooks/useCredits';

export function CreditsScreen({ token }: { token: string }) {
  const {
    credits,
    loading,
    error,
    reloadManual,
    forceReload,
    addAdReward,
  } = useCredits(token);

  const [showReloadOptions, setShowReloadOptions] = useState(false);

  if (loading) {
    return <div className="loading">⏳ Carregando...</div>;
  }

  if (error) {
    return <div className="error">❌ Erro ao carregar créditos</div>;
  }

  const { user, config, nextReset } = credits;
  const percentageUsed =
    ((config.limit - user.availableCredits) / config.limit) * 100;

  return (
    <div className="credits-screen">
      {/* Header */}
      <div className="header">
        <h1>🪙 Meus Créditos</h1>
        <p className="plan-badge">{user.planType === 'free' ? '🆓 Plano Free' : '⭐ Plano Premium'}</p>
      </div>

      {/* Main Balance */}
      <div className="balance-card">
        <div className="credit-amount">
          <h2>{user.availableCredits}</h2>
          <p>créditos disponíveis</p>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${percentageUsed}%` }}
          ></div>
        </div>

        <p className="balance-info">
          {user.availableCredits} de {config.limit} créditos usados
        </p>
      </div>

      {/* Next Reset */}
      <div className="reset-info">
        <div className="reset-time">
          <span className="label">⏰ Próximo Reset:</span>
          <span className="time">
            {nextReset.hoursUntilReset}h {nextReset.minutesUntilReset}min
          </span>
        </div>
        <p className="reset-type">
          Reset {config.strategy === 'daily' ? 'diário' : 'a cada hora'}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        {/* Forçar Recarga */}
        <button
          className="btn btn-secondary"
          onClick={forceReload}
          disabled={user.availableCredits === config.limit}
        >
          🔄 Forçar Recarga
        </button>

        {/* Comprar Créditos */}
        <button
          className="btn btn-primary"
          onClick={() => setShowReloadOptions(!showReloadOptions)}
        >
          ➕ Comprar Créditos
        </button>

        {/* Assistir Anúncio */}
        <button
          className="btn btn-secondary"
          onClick={() => addAdReward(10, 'rewarded')}
        >
          📺 Assistir Anúncio
        </button>
      </div>

      {/* Reload Options */}
      {showReloadOptions && (
        <div className="reload-options">
          {[
            { amount: 50, price: '$2.99' },
            { amount: 100, price: '$4.99' },
            { amount: 250, price: '$9.99' },
            { amount: 500, price: '$19.99' },
          ].map(({ amount, price }) => (
            <button
              key={amount}
              className="option"
              onClick={() => reloadManual(amount)}
            >
              <span className="amount">{amount} créditos</span>
              <span className="price">{price}</span>
            </button>
          ))}
        </div>
      )}

      {/* Histórico */}
      {credits.history && credits.history.length > 0 && (
        <div className="history">
          <h3>📋 Histórico Recente</h3>
          <ul>
            {credits.history.slice(0, 5).map((item: any, i: number) => (
              <li key={i} className="history-item">
                <span className="type">{item.reloadType}</span>
                <span className="amount">+{item.amount}</span>
                <span className="date">
                  {new Date(item.timestamp).toLocaleDateString('pt-BR', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* FAQ */}
      <div className="faq">
        <h3>❓ Dúvidas Frequentes</h3>
        <details>
          <summary>Como ganho créditos?</summary>
          <p>Você pode:</p>
          <ul>
            <li>Receber reset automático diário (Free)</li>
            <li>Comprar pacotes de créditos</li>
            <li>Assistir anúncios</li>
          </ul>
        </details>

        <details>
          <summary>O que são créditos?</summary>
          <p>
            Créditos são usados para acessar análises de IA e outras
            funcionalidades premium do HabitMind.
          </p>
        </details>

        <details>
          <summary>Posso fazer upgrade?</summary>
          <p>
            Sim! Upgrade para Premium e ganhe 300 créditos por hora com
            reset automático.
          </p>
        </details>
      </div>
    </div>
  );
}
```

### CSS Correspondente

```css
.credits-screen {
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.plan-badge {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}

.balance-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.credit-amount h2 {
  font-size: 48px;
  margin: 0;
  font-weight: bold;
}

.credit-amount p {
  margin: 5px 0 20px 0;
  opacity: 0.9;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress {
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  transition: width 0.3s;
}

.balance-info {
  margin: 0;
  font-size: 13px;
  opacity: 0.9;
}

.reset-info {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.reset-time {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.reset-time .label {
  font-weight: 600;
}

.reset-time .time {
  color: #667eea;
  font-weight: bold;
  font-size: 16px;
}

.reset-type {
  margin: 0;
  font-size: 13px;
  color: #666;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.btn {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5568d3;
  transform: translateY(-2px);
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

.reload-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
}

.option {
  display: flex;
  flex-direction: column;
  padding: 15px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.option:hover {
  border-color: #667eea;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
}

.option .amount {
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.option .price {
  color: #667eea;
  font-weight: bold;
}

.history {
  margin-top: 20px;
}

.history h3 {
  margin-bottom: 15px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.history-item .amount {
  color: #27ae60;
  font-weight: bold;
}

.history-item .date {
  color: #999;
  font-size: 13px;
}

.faq {
  margin-top: 20px;
}

.faq details {
  margin-bottom: 10px;
}

.faq summary {
  cursor: pointer;
  font-weight: 600;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 6px;
}

.faq summary:hover {
  background: #f0f0f0;
}

.faq p {
  padding: 10px 10px 0 10px;
  color: #666;
}

.faq ul {
  padding-left: 30px;
  margin: 10px 0;
}

.faq li {
  color: #666;
  margin-bottom: 5px;
}
```

---

Essa documentação fornece um kit completo de exemplos práticos para implementar o sistema de recargas de créditos! 🚀

