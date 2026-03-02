# Zine Protocol

MVP editorial para Artizen: leitura aberta de zines + apoio direto (Wallet, Email, Pix sandbox), com curadoria Git-first.

## Stack

- Next.js 15 (App Router)
- TypeScript + Tailwind (Flexoki)
- Wagmi + Viem (Base Sepolia)
- Prisma (PostgreSQL, com fallback local em memoria)
- Vitest

## Estrutura do projeto

- `src/app/` rotas da aplicacao (home, manifesto, zines, checkout, APIs)
- `src/components/` UI e fluxos de apoio
- `src/lib/` parser de zines, env, pix, revnet, storage
- `content/zines/` zines em Markdown com frontmatter
- `public/images/zines/` capas e paginas
- `scripts/import-antmag.cjs` importador de paginas do antmag para Markdown + imagens

## Frontmatter obrigatorio

```yaml
slug: "nome-do-zine"
title: "Titulo"
artist_name: "Nome"
artist_wallet: "0x..."
cover_image: "/images/zines/capa.jpg"
excerpt: "Resumo"
tags: ["arte", "zine"]
revnet_project_id: 123
funding_mode: "campaign" # campaign | continuous
target_usdc: 500         # obrigatorio se campaign
deadline_iso: "2026-06-30T23:59:59Z" # obrigatorio se campaign
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

## Importacao de referencias antmag

O importador usa arquivos HTML em `antmag_fetch/` (diretorio local, ignorado pelo Git) e gera:

- `content/zines/<slug>/index.md`
- `public/images/zines/antmag/<slug>/...`

Comando:

```bash
npm run import:antmag
```

## Otimizacao de imagens (antes do push)

Para reduzir peso do repositorio sem quebrar paths do conteudo:

```bash
npm run optimize:antmag
```

O script reprocessa JPG/JPEG/PNG em `public/images/zines/antmag`, redimensiona imagens muito grandes e substitui somente quando o arquivo final fica menor.

## Pronto para merge (checklist)

1. `npm run check:all`
2. `npm run build`
3. Validar home, `/manifesto`, `/zines/[slug]`, `/checkout` no desktop e mobile
4. Revisar `.env.example` e segredos antes de push
5. Fazer commit em lotes logicos (layout, conteudo, pagamentos, docs)

## Observacoes do MVP

- Sem NFT no MVP
- Linguagem principal do CTA: `Apoiar este zine`
- Pix em sandbox (sem liquidacao BRL -> USDC em producao)
- Curadoria por convite
