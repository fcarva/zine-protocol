# Merge Plan (Private Repo)

## Objetivo

Publicar o estado atual do MVP com polish de performance + qualidade editorial, mantendo baixo risco de regressão.

## Ordem recomendada de commits

1. `feat(perf): next image formats + sizes tuning`
2. `feat(editorial): copy pt-BR + framing de apoio`
3. `chore(release): docs, build prisma, vercel env checklist`

## Risco conhecido

1. `markdown-renderer` usa `<img>` para preservar fluxo editorial de páginas abertas.
2. `next lint` mantém warning `no-img-element` (esperado por decisão de produto).

## Checklist de release

1. `npm run check:all`
2. `npm run build`
3. Smoke manual:
   - `/`
   - `/manifesto`
   - `/zines/[slug]`
   - `/checkout`
4. Smoke API:
   - `POST /api/pix/checkout`
   - `GET /api/pix/status/:chargeId`
   - `POST /api/webhooks/abacatepay`
   - `POST /api/support/web3/log`
   - `POST /api/checkout/email`

## Configuração Vercel (obrigatória)

1. Definir variáveis em `Preview` e `Production`:
   - `NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL`
   - `NEXT_PUBLIC_USDC_ADDRESS`
   - `NEXT_PUBLIC_REVNET_TERMINAL_ADDRESS`
   - `NEXT_PUBLIC_REVNET_APP_URL`
   - `ABACATEPAY_API_KEY`
   - `ABACATEPAY_WEBHOOK_SECRET`
   - `DATABASE_URL`
2. Confirmar `vercel env ls` com todas as variáveis.

## Pós-release

1. Registrar URL de produção e SHA do commit no histórico do projeto.
2. Validar fluxo de apoio Wallet + Pix sandbox em produção.
