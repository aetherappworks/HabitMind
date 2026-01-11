# 📡 Documentação da API

Referência completa de todos os endpoints da API HabitMind AI.

## Índice

- **[API Reference](API_REFERENCE.md)** - Referência completa de endpoints

## Endpoints Principais

### Autenticação
- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Fazer login

### Hábitos
- `GET /habits` - Listar hábitos
- `POST /habits` - Criar novo hábito
- `GET /habits/:id` - Obter hábito específico
- `PUT /habits/:id` - Atualizar hábito
- `DELETE /habits/:id` - Deletar hábito

### Check-ins
- `POST /habits/:id/checkins` - Registrar check-in
- `GET /habits/:id/checkins` - Listar check-ins
- `GET /habits/:id/checkins/range` - Check-ins em período

### IA
- `POST /ai/analyze` - Analisar hábito com IA
- `GET /ai/insights` - Obter insights de IA

### Usuários
- `GET /users/me` - Perfil atual
- `PUT /users/me` - Atualizar perfil

## 🌐 Suporte a Linguagens

Todos os endpoints suportam internacionalização:

- Query: `?lang=en-us`
- Cookie: `lang=pt-br`
- Header: `Accept-Language: es-ES`

Padrão: `pt-br`

## Documentação Interativa

Acesse a documentação Swagger em:
```
http://localhost:3000/api/docs
```

Para detalhes completos, consulte [API_REFERENCE.md](API_REFERENCE.md).
