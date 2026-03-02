# Merge Plan (Private Repo)

## Objetivo

Consolidar o MVP do Zine Protocol para demo Artizen com foco em:

1. performance real de front;
2. copy/editorial consistente em pt-BR;
3. checkout funcional (Wallet + Email + Pix sandbox);
4. baixo risco de regressão em produção.

## Status atual (mapeamento)

### Concluído

1. `feat: polish performance config and pt-BR editorial UX` (`ddd74e4`)
   - `next.config.mjs` com `images.formats` (`avif/webp`) + `deviceSizes` + `imageSizes`;
   - `package.json` com `build: prisma generate && next build` e `engines.node: 20.x`;
   - tipografia com `fontFamily` via `next/font` no Tailwind;
   - revisão de framing/copy principal para apoio.
2. `fix(storage): prevent prisma init on localhost db url in production` (`1e86a9a`)
   - evita loop de `PrismaClientInitializationError` quando `DATABASE_URL` inválida;
   - reduz spam de fallback para log único por instância.
3. `feat(ui): refresh payment CTA to clean coffee-style buttons` (`68cd26f`)
   - redesign do CTA de apoio no `SupportPanel`;
   - padronização de botões de checkout (`Wallet`, `Email`, `Pix`) com estilo clean.
4. Deploy de produção publicado:
   - URL: `https://zine-protocol.vercel.app`
   - Deployment: `https://zine-protocol-9qqsp57o8-fcarvas-projects.vercel.app`
5. CI de validação criado:
   - arquivo: `.github/workflows/ci.yml`
   - executa `pnpm install --frozen-lockfile`, `npm run check:all` e `npm run build`.

### Validado

1. `npm run check:all` passando.
2. `npm run build` passando.
3. Smoke API em produção (`GET /api/pix/status/:chargeId`) respondendo normalmente.

### Pendente crítico

1. `DATABASE_URL` de produção ainda precisa apontar para Postgres real.
   - com URL local/placeholder, o app permanece em fallback de memória (sem persistência durável).

## Riscos conhecidos

1. `markdown-renderer` usa `<img>` por decisão editorial (fidelidade visual).
2. `next lint` mantém warning `@next/next/no-img-element` esperado.
3. sem Postgres real em Vercel, eventos de apoio não persistem entre cold starts.

## Continuação do plano (próxima sessão)

### Bloco 1 — Persistência real (prioridade máxima, 45-60 min)

1. Provisionar Postgres gerenciado (Neon/Supabase/Railway).
2. Atualizar `DATABASE_URL` em `Preview` e `Production`.
3. Rodar `vercel env ls` e `vercel --prod --yes`.
4. Critério de pronto: criação Pix + logs Web3 persistindo após novo deploy.

### Bloco 2 — QA de checkout (60-90 min)

1. Smoke manual completo:
   - `/`
   - `/manifesto`
   - `/zines/[slug]`
   - `/checkout`
2. Smoke APIs:
   - `POST /api/pix/checkout`
   - `GET /api/pix/status/:chargeId`
   - `POST /api/webhooks/abacatepay` (assinatura inválida e válida)
   - `POST /api/support/web3/log`
   - `POST /api/checkout/email`
3. Registrar resultados no histórico desta doc.

### Bloco 3 — Qualidade contínua (60-90 min)

1. Adicionar workflow CI (`check:all` + `build`) no GitHub Actions.
2. Criar 2 testes de UI smoke com Testing Library:
   - `SupportPanel` render + CTA;
   - `CheckoutPage` troca de método (`wallet/email/pix`).
3. Critério de pronto: PR falha automaticamente em regressão básica.

## Checklist de release (atual)

1. `npm run check:all`
2. `npm run build`
3. `vercel env ls` completo
4. deploy `vercel --prod --yes`
5. validar produção e registrar:
   - URL
   - SHA
   - data/hora
