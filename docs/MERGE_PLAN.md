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
   - Deployment: `https://zine-protocol-qyyqa0gxc-fcarvas-projects.vercel.app`
5. CI de validação criado:
   - arquivo: `.github/workflows/ci.yml`
   - executa `pnpm install --frozen-lockfile`, `npm run check:all` e `npm run build`.
6. Persistência real no Supabase conectada:
   - `DATABASE_URL` configurada em `Preview` e `Production` na Vercel;
   - migração Prisma `0001_init` criada e aplicada com sucesso;
   - fallback local deixou de ser dependência para persistência em produção.

### Validado

1. `npm run check:all` passando.
2. `npm run build` passando.
3. Smoke API em produção (`GET /api/pix/status/:chargeId`) respondendo normalmente.
4. Testes UI smoke adicionados e verdes:
   - `src/test/ui/support-panel.test.tsx`
   - `src/test/ui/checkout-page.test.tsx`

### Pendente crítico

1. Executar QA manual em produção dos fluxos com interação real de carteira/webhook Pix.

## Riscos conhecidos

1. `markdown-renderer` usa `<img>` por decisão editorial (fidelidade visual).
2. `next lint` mantém warning `@next/next/no-img-element` esperado.
3. webhook Pix precisa ser validado com evento real sandbox após deploy final.

## Continuação do plano (próxima sessão)

### Bloco 1 — Persistência real (prioridade máxima, 45-60 min)

1. Concluído em 2026-03-02 com Supabase (`db.vlpsoqxeixmxdiqhijzf.supabase.co`).
2. Próximo: validar escrita/leitura real no fluxo do app após deploy de produção.

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
3. Status:
   - cobertura automatizada de API já existente e verde;
   - pendente apenas validação manual final em produção (wallet + webhook sandbox real).

### Atualização sprint conversão UX (apoio iniciado)

1. Instrumentação de intenção adicionada:
   - `POST /api/support/intent/log`
   - persistência em banco via `SupportIntentEvent`
   - deduplicação por `intentId` com retorno `409` em duplicidade
2. Métricas de funil adicionadas:
   - `GET /api/metrics/funnel?from=...&to=...`
   - retorno de `starts_total`, `starts_by_method`, `starts_by_zine`, `starts_by_surface`
3. UI de apoio instrumentada:
   - `support-panel` e `checkout` agora registram evento de `apoio iniciado`
     nos CTAs primários de `wallet`, `pix` e `email`.
4. Qualidade:
   - teste UI quebrado do `support-panel` atualizado para o layout atual
   - novos testes para as rotas de intenção e métricas de funil

### Bloco 3 — Qualidade contínua (60-90 min)

1. Adicionar workflow CI (`check:all` + `build`) no GitHub Actions.
2. Criar 2 testes de UI smoke com Testing Library:
   - `SupportPanel` render + CTA;
   - `CheckoutPage` troca de método (`wallet/email/pix`).
3. Status:
   - CI implementado em `.github/workflows/ci.yml`;
   - testes UI smoke implementados;
   - `check:all` + `build` passando localmente.

## Checklist de release (atual)

1. `npm run check:all`
2. `npm run build`
3. `vercel env ls` completo
4. deploy `vercel --prod --yes`
5. validar produção e registrar:
   - URL
   - SHA
   - data/hora

## Mega Sprint Barnard -> Zine Protocol

Referência de contexto: `research/barnard/BARNARD_CONTEXT.md`

### Objetivo

Evoluir o MVP de "catalogo com apoio" para um produto editorial completo com 4 camadas:

1. Arquivo (zines e leitura aberta)
2. Apoio (wallet/email/pix)
3. Editorial (series e narrativa recorrente)
4. Ecossistema (ensino, recursos, rede de zines)

### Janela sugerida

6 semanas (3 blocos de 2 semanas), mantendo produção deployavel ao fim de cada bloco.

### Bloco A - Editorial Core (Semanas 1-2)

1. Home com bloco "Series editoriais" (1 destaque + 3 relacionados).
2. Pagina `/curadoria` com politica de convite, criterios e fluxo de submissao.
3. Pagina `/como-apoiar` com explicacao clara de wallet/email/pix sem jargao.
4. CTA e framing consistentes com "Apoiar este zine".

Definicao de pronto:

1. Conteudo de curadoria e apoio publicado em pt-BR.
2. Navegacao principal aponta para as novas paginas.
3. Teste guiado de 5 minutos sem bloqueios do fluxo catalogo -> apoio.

### Bloco B - Metadata + Descoberta (Semanas 3-4)

1. Expandir frontmatter com campos:
   - `language`
   - `city`
   - `year`
   - `format`
   - `themes_controlled`
2. Validacao de schema para novos campos no parser.
3. Filtros novos na home e pagina de arquivo (tema controlado, cidade, idioma).
4. Melhorar cards e pagina de zine para exibir metadados editoriais.

Definicao de pronto:

1. Parser rejeita markdown com campos invalidos.
2. Filtros funcionam sem regressao dos filtros atuais.
3. Pelo menos 12 zines com metadados novos preenchidos.

### Bloco C - Ecossistema (Semanas 5-6)

1. Secao `/ensino` com kits de uso (aula, oficina, leitura guiada).
2. Secao `/recursos` com links de zineotecas, bibliografia e ferramentas.
3. Secao `/eventos` com grade editorial de workshops/convocatorias.
4. Landing com calendario editorial mensal (news + eventos + chamadas).

Definicao de pronto:

1. 3 trilhas de conteudo publicadas (ensino, recursos, eventos).
2. Estrutura navegavel desktop/mobile com mesma linguagem visual.
3. Conteudo operacional apto para demo/pitch (sem lorem ipsum).

### Metricas do mega sprint

1. Tempo medio catalogo -> apoio < 2 minutos.
2. >= 20 apoios registrados em ambiente demo.
3. >= 30 zines com metadados completos (campos novos).
4. >= 2 publicacoes editoriais por semana (news/eventos).

### Riscos e mitigacao

1. Escopo excessivo: gate por bloco e corte por prioridade (C corta antes de A/B).
2. Taxonomia confusa: vocabulario controlado + tags livres.
3. Sobrecarga operacional: templates de conteudo para curadoria publicar rapido.
4. Regressao visual: manter `check:all` + build + smoke manual por release.
