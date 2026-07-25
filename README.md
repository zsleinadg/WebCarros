# WebCarros 🚗

Plataforma para compra e venda de veículos no Brasil.

## Funcionalidades

- Catálogo de veículos com busca e filtros avançados
- Anúncio de veículo para venda (formulário público)
- Dashboard do vendedor (gerenciar anúncios)
- Autenticação de usuários
- Favoritos
- Páginas: Home, Estoque, Vender, Favoritos, Carro, Agendar Test-Drive, Login, Cadastro, Dashboard

## Tecnologias

- React 19 + TypeScript
- Tailwind CSS v4
- Vite 7
- React Router v7
- React Hook Form + Zod
- Radix UI (Select)
- Supabase (auth, banco PostgreSQL, storage)
- Swiper
- WebP com fallback PNG (imagens otimizadas)

## Começar

```bash
npm install
cp .env.example .env   # preencher vars
npm run dev
```

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `VITE_SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave anônima do Supabase |
| `VITE_WHATSAPP_NUMBER` | Número do WhatsApp |

## Build

```bash
npm run build   # tsc -b && vite build
npm run preview # preview local do build
```

## Deploy

Vercel (configurado com `vercel.json` para SPA routing).

## Estrutura

```
src/
  assets/        # imagens (PNG + WebP)
  components/    # componentes reutilizáveis
  constants/     # listas fixas (combustível, UF)
  contexts/      # AuthContext, FavoritesContext
  pages/         # páginas da aplicação
  services/      # Supabase client
  types/         # schemas Zod e tipos TS
  utils/         # formatadores
```
