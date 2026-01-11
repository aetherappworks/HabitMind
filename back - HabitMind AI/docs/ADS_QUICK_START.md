# Ì∫Ä QUICK START: Sistema de An√∫ncios (Ads)

## 30 Segundos para Come√ßar

### 1Ô∏è‚É£ Servidor j√° est√° rodando?
```bash
npm run start:dev
```

### 2Ô∏è‚É£ Tem um JWT token?
```bash
# Login ou registre um usu√°rio
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "pass"}'
```

### 3Ô∏è‚É£ Teste em 3 passos

#### Passo 1: Obter configura√ß√µes
```bash
curl http://localhost:3000/ads/config \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Passo 2: Registrar um ad
```bash
curl -X POST http://localhost:3000/ads/view \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "adId": "test_ad_1",
    "adType": "rewarded",
    "validationToken": "test_token"
  }'
```

#### Passo 3: Obter stats
```bash
curl http://localhost:3000/ads/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Ì≥ä Estrutura de Cr√©ditos

| Tipo | Cr√©ditos | Limite/dia |
|------|----------|-----------|
| Ìæ¨ Rewarded | 10 | 20 ads |
| Ì≥± Banner | 1 | 50 views |
| Ì≥∫ Interstitial | 5 | 10 ads |

---

## Ì≥ö Documenta√ß√£o Completa

- **TESTING_GUIDE_ADS.md** ‚Üê Comece aqui para testar
- **IMPLEMENTATION_STATUS_ADS.md** ‚Üê Documenta√ß√£o t√©cnica
- **ADS_IMPLEMENTATION_SUMMARY.md** ‚Üê Resumo executivo
- **CHANGELOG_ADS_v0.2.0.md** ‚Üê Todas as mudan√ßas

---

## ÌæØ 6 Endpoints Dispon√≠veis

```
POST   /ads/view                  Registrar visualiza√ß√£o
POST   /ads/reward-completion     Recompensa por h√°bito
POST   /ads/validation/:adId      Validar e reivindicar
GET    /ads/config                Obter configura√ß√µes
GET    /ads/stats                 Obter estat√≠sticas
GET    /ads/history               Hist√≥rico paginado
```

---

## ‚úÖ Checklist R√°pido

- [x] 6 endpoints implementados
- [x] Banco de dados migrado
- [x] Seguran√ßa com JWT
- [x] Limite di√°rio configur√°vel
- [x] 3 idiomas (pt-br, en-us, es-es)
- [x] Documenta√ß√£o Swagger
- [x] 11 testes validados

---

## Ìæâ Pronto para uso!

**Pr√≥ximo passo:** Integrar com frontend mobile

**D√∫vidas?** Veja TESTING_GUIDE_ADS.md para exemplos completos

---

**Gerado em 09/01/2026**
