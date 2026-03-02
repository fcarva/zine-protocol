# Zine Protocol

MVP editorial para Artizen: leitura aberta de zines + apoio direto (Wallet, Email, Pix sandbox), com curadoria Git-first.

## Stack

- Next.js 15 (App Router)
- TypeScript + Tailwind (Flexoki)
- Wagmi + Viem (Base Sepolia)
- Prisma (PostgreSQL, com fallback local em memória)
- Vitest

## Estrutura do projeto

- `src/app/`: rotas da aplicação (home, manifesto, zines, checkout, APIs)
- `src/components/`: UI e fluxos de apoio
- `src/lib/`: parser de zines, env, pix, revnet, storage
- `content/zines/`: zines em Markdown com frontmatter
- `public/images/zines/`: capas e páginas
- `scripts/import-antmag.cjs`: importador de páginas do antmag para Markdown + imagens

## Frontmatter obrigatório

```yaml
slug: "nome-do-zine"
title: "Título"
artist_name: "Nome"
artist_wallet: "0x..."
cover_image: "/images/zines/capa.jpg"
excerpt: "Resumo"
tags: ["arte", "zine"]
revnet_project_id: 123
funding_mode: "campaign" # campaign | continuous
target_usdc: 500         # obrigatório se campaign
deadline_iso: "2026-06-30T23:59:59Z" # obrigatório se campaign
status: "published"      # draft | published
sort_order: 10
```

## Como rodar

```bash
corepack pnpm install
npm run dev -- --port 3000
```

## Qualidade

```bash
npm run typecheck
npm run lint
npm run test
```

Ou tudo de uma vez:

```bash
npm run check:all
```

## Importação de referências antmag

O importador usa arquivos HTML em `antmag_fetch/` (diretório local) e gera:

- `content/zines/<slug>/index.md`
- `public/images/zines/antmag/<slug>/...`

Comando:

```bash
npm run import:antmag
```

## Otimização de imagens (antes do push)

Para reduzir peso do repositório sem quebrar paths do conteúdo:

```bash
npm run optimize:antmag
```

O script reprocessa JPG/JPEG/PNG em `public/images/zines/antmag`, redimensiona imagens muito grandes e substitui somente quando o arquivo final fica menor.

## Banco de dados (Supabase + Prisma)

1. Configure `DATABASE_URL` local (ou em CI) com SSL:
   - `postgresql://postgres:<senha-encoded>@db.<project-ref>.supabase.co:5432/postgres?sslmode=require`
2. Aplique migrações:

```bash
npx prisma migrate deploy
```

3. Verifique status:

```bash
npx prisma migrate status
```

## Build e deploy

- O build executa `prisma generate` antes do `next build`.
- Em produção (Vercel), configure obrigatoriamente:
  - `NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL`
  - `NEXT_PUBLIC_USDC_ADDRESS`
  - `NEXT_PUBLIC_REVNET_TERMINAL_ADDRESS`
  - `NEXT_PUBLIC_REVNET_APP_URL`
  - `ABACATEPAY_API_KEY`
  - `ABACATEPAY_WEBHOOK_SECRET`
  - `DATABASE_URL`

## Pronto para merge (checklist)

1. `npm run check:all`
2. `npm run build`
3. Validar home, `/manifesto`, `/zines/[slug]`, `/checkout` no desktop e mobile
4. Revisar `.env.example` e segredos antes de push
5. Fazer commit em lotes lógicos (layout, conteúdo, pagamentos, docs)

## Observações do MVP

- Sem NFT no MVP
- Linguagem principal do CTA: `Apoiar este zine`
- Pix em sandbox (sem liquidação BRL -> USDC em produção)
- Curadoria por convite

## KPI: apoio iniciado

`Apoio iniciado` agora e medido por evento de intencao persistido no banco por metodo e por zine.

### Evento de intencao

- Rota: `POST /api/support/intent/log`
- Superficies: `support_panel` e `checkout`
- Metodos: `wallet`, `pix`, `email`
- Idempotencia: `intentId` unico (duplicado retorna `409`)

Payload exemplo:

```json
{
  "zineSlug": "rua-das-copias",
  "method": "wallet",
  "surface": "support_panel",
  "sessionId": "8f2d1f7f-2ab6-4bf1-9a25-f9431264d6b4",
  "intentId": "f7168d5e-938f-4dc7-b0ec-a57e95b0d8f2",
  "amountInput": "10",
  "currencyInput": "usd",
  "chainId": 84532,
  "walletConnected": true
}
```

### Metricas de funil

- Rota: `GET /api/metrics/funnel?from=...&to=...`
- Resposta: `starts_total`, `starts_by_method`, `starts_by_zine`, `starts_by_surface`
- Se `from`/`to` nao forem enviados, o endpoint usa janela padrao dos ultimos 7 dias.
