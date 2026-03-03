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
Referência complementar: `docs/ESTAR_MAG_CONTEXT.md`
Referência revnet: `docs/REVNET_ZINE_DAO_BLUEPRINT.md`

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

Status atual (2026-03-02):

1. Entregue: `/curadoria` com politica de convite e criterios.
2. Entregue: `/como-apoiar` com explicacao wallet/email/pix em linguagem simples.
3. Entregue: bloco `Series editoriais` na home com 1 destaque + 3 itens.
4. Entregue: navegacao lateral e mobile com foco em manifesto, curadoria e apoio.
5. Entregue: limpeza de copy com mojibake nas paginas publicas tocadas.

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

Status atual (2026-03-02):

1. Entregue: frontmatter expandido e estrito (`language`, `city`, `year`, `format`, `themes_controlled`).
2. Entregue: filtros editoriais novos na home (idioma, cidade, formato, tema controlado).
3. Entregue: metadata exibida em cards e em `/zines/[slug]`.
4. Entregue: migracao de 52 zines com campos novos preenchidos.
5. Entregue: testes de parser atualizados para cobertura de metadata invalida.

### Bloco C - Ecossistema (Semanas 5-6)

1. Secao `/ensino` com kits de uso (aula, oficina, leitura guiada).
2. Secao `/recursos` com links de zineotecas, bibliografia e ferramentas.
3. Secao `/eventos` com grade editorial de workshops/convocatorias.
4. Landing com calendario editorial mensal (news + eventos + chamadas).

Definicao de pronto:

1. 3 trilhas de conteudo publicadas (ensino, recursos, eventos).
2. Estrutura navegavel desktop/mobile com mesma linguagem visual.
3. Conteudo operacional apto para demo/pitch (sem lorem ipsum).

Status atual (2026-03-03):

1. Entregue: `/ensino` com modelos de aula/oficina e resultado esperado por trilha.
2. Entregue: `/recursos` com bibliografia, zineotecas e ferramentas de publicacao.
3. Entregue: `/eventos` com agenda editorial/curatorial com datas publicas.
4. Entregue: bloco `Calendario editorial` na home com CTA para trilhas do ecossistema.
5. Entregue: contexto ESTAR + Barnard consolidado em narrativa de ecossistema.

### Bloco D - Governanca DAO Git-first (Semana 7)

1. Criar parser e schema estrito para propostas DAO em markdown.
2. Criar pasta `content/governance` com propostas publicadas.
3. Remover mock hardcoded da pagina `/zine-dao`.
4. Adicionar teste dedicado para validacao de frontmatter de governanca.

Status atual (2026-03-03):

1. Entregue: `src/lib/governance.ts` com parser `zod` e carregamento de propostas.
2. Entregue: `src/types/governance.ts` com tipos e enums da camada DAO.
3. Entregue: 4 propostas publicadas em `content/governance`.
4. Entregue: `/zine-dao` renderizando dados vindos do conteudo Git-first.
5. Entregue: `src/test/governance.test.ts` com cobertura de validacao e loading.

### Bloco E - DAO Context Layer (Semana 8)

1. Fortalecer narrativa de DAO na home, manifesto e area de governanca.
2. Publicar pagina `/zine-dao/modelo` com:
   - fluxo de governanca;
   - papeis e responsabilidades;
   - contexto de token utilitario;
   - split editorial e Tesouro Comunidade.
3. Conectar CTAs diretos:
   - `/zine-dao`
   - `/zine-dao/propor`
   - `/zine-dao/modelo`
4. Ajustar framing de navegacao para "Zine DAO" como camada de produto (nao apenas secao tecnica).

Status atual (2026-03-03):

1. Entregue: bloco `Zine DAO em operacao` na home com funil em 3 passos.
2. Entregue: pagina `/zine-dao/modelo` com narrativa completa de funcionamento.
3. Entregue: reforco de contexto DAO no `/manifesto`.
4. Entregue: navegacao lateral/mobile com label `Zine DAO`.

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
