# Zine Protocol

Plataforma de curadoria e apoio para zines independentes, focada no MVP de demonstracao para Artizen.

## Escopo do MVP

- Catalogo com zines em Markdown (Git-first)
- Leitura aberta de cada zine em `/zines/[slug]`
- Apoio Web3 em Base Sepolia apontando para `revnet_project_id`
- Pix sandbox com QR code + webhook assinado + status
- Log de apoios em `support_events`

## Stack

- Next.js 14 (App Router)
- TypeScript + Tailwind CSS
- Wagmi + Viem
- Prisma (PostgreSQL) com fallback em memoria no ambiente local
- Vitest

## Estrutura de conteudo

Cada zine fica em `content/zines/<slug>/index.md` com frontmatter obrigatorio:

```yaml
slug: "nome-do-zine"
title: "Titulo"
artist_name: "Nome"
artist_wallet: "0x..."
cover_image: "/images/zines/capa.svg"
excerpt: "Resumo"
tags: ["arte", "zine"]
revnet_project_id: 123
funding_mode: "campaign" # campaign | continuous
target_usdc: 500         # obrigatorio se campaign
deadline_iso: "2026-06-30T23:59:59Z" # obrigatorio se campaign
status: "published"     # draft | published
sort_order: 1
```

## API endpoints

- `POST /api/pix/checkout`
- `GET /api/pix/status/:chargeId`
- `POST /api/webhooks/abacatepay`
- `POST /api/support/web3/log`

## Como rodar

1. Copie `.env.example` para `.env`.
2. Instale dependencias:

```bash
corepack pnpm install
```

3. Gere Prisma client:

```bash
corepack pnpm prisma:generate
```

4. Suba em dev:

```bash
corepack pnpm dev
```

## Testes

```bash
corepack pnpm test
```

## Observacoes

- O termo "mint" nao aparece na interface do MVP.
- Curadoria e fechada por convite no momento.
- Pix esta em modo sandbox, sem liquidacao BRL->USDC em producao.

