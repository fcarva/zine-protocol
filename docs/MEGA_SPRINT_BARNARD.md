# Mega Sprint - Barnard Context to Product Execution

Data base: 2026-03-02
Referencia: `research/barnard/BARNARD_CONTEXT.md`
Referencia complementar: `docs/ESTAR_MAG_CONTEXT.md`
Referencia revnet: `docs/REVNET_ZINE_DAO_BLUEPRINT.md`

## 1. Product thesis

O Zine Protocol deve operar em 4 camadas simultaneas:

1. Arquivo vivo de leitura aberta.
2. Apoio direto (wallet, email, pix sandbox).
3. Narrativa editorial recorrente.
4. Infra de comunidade (ensino, recursos, rede).

## 2. Sprint structure

## Sprint 1 (2 semanas) - Editorial Foundation

Escopo:

1. Criar `/curadoria` com criterios e politica de convite.
2. Criar `/como-apoiar` com fluxos wallet/email/pix em linguagem simples.
3. Home com bloco "Series editoriais" (1 destaque + 3 itens).
4. Ajustar links de navegacao para destacar manifesto, curadoria e apoio.

Entrega:

1. Paginas publicadas com copy final pt-BR.
2. Home com hierarquia mais clara para leitura e acao.

DoD:

1. `npm run check:all` verde.
2. `npm run build` verde.
3. Smoke manual de rotas novas sem erro de layout mobile/desktop.

Status de execucao (2026-03-02):

1. Concluido: pagina `/curadoria` publicada.
2. Concluido: pagina `/como-apoiar` publicada.
3. Concluido: home com bloco `Series editoriais` (1 destaque + 3 itens).
4. Concluido: navegacao atualizada para destacar `Manifesto`, `Curadoria`, `Como apoiar` e `Apoiar`.
5. Concluido: gate tecnico (`check:all` e `build`) validado.
6. Pendente: smoke manual final em producao para desktop/mobile.

## Sprint 2 (2 semanas) - Metadata and Discovery

Escopo:

1. Expandir schema de frontmatter:
   - `language`
   - `city`
   - `year`
   - `format`
   - `themes_controlled`
2. Atualizar parser para validacao estrita.
3. Exibir campos em `zine-card` e `/zines/[slug]`.
4. Implementar filtros novos na home.

Entrega:

1. Busca/filtro com metadados editoriais.
2. Curadoria com controle melhor de representacao.

DoD:

1. Rejeicao de conteudo invalido coberta em teste.
2. Pelo menos 12 zines migrados com campos novos.
3. Sem regressao em checkout.

Status de execucao (2026-03-02):

1. Concluido: schema expandido com `language`, `city`, `year`, `format`, `themes_controlled`.
2. Concluido: parser com validacao estrita e vocabulos controlados.
3. Concluido: home com filtros editoriais novos (idioma, cidade, formato, tema controlado).
4. Concluido: exibicao de metadata em `zine-card` e na pagina `/zines/[slug]`.
5. Concluido: 52 zines migrados com os novos campos (acima do minimo de 12).
6. Concluido: testes de rejeicao de metadata invalida adicionados e verdes.

## Sprint 3 (2 semanas) - Ecosystem Layer

Escopo:

1. Criar `/ensino` com modelos de aula e oficina.
2. Criar `/recursos` com bibliografia, links de zineotecas e ferramentas.
3. Criar `/eventos` para agenda editorial/curatorial.
4. Criar bloco na home com calendario mensal de publicacao.

Entrega:

1. Produto deixa de ser apenas galeria e vira plataforma editorial.
2. Aumenta valor para comunidade, educadoras e coletivos.

DoD:

1. Tres secoes novas publicadas e navegaveis.
2. Conteudo real publicado (sem placeholders).
3. Layout consistente com identidade atual.

Status de execucao (2026-03-03):

1. Concluido: pagina `/ensino` com 3 trilhas (aula, seminario e laboratorio).
2. Concluido: pagina `/recursos` com bibliografia, diretorios e ferramentas.
3. Concluido: pagina `/eventos` com agenda editorial/curatorial.
4. Concluido: home com bloco `Calendario editorial` para o mes em curso.
5. Concluido: navegacao ecossistema adicionada no `context strip`.
6. Concluido: gate tecnico (`check:all` e `build`) validado.

## Sprint 4 (1 semana) - DAO Governance Foundation

Escopo:

1. Criar pagina de governanca em `/zine-dao` com votacao de propostas.
2. Mover propostas de mock local para conteudo Git-first em `content/governance`.
3. Adicionar parser e schema estrito para frontmatter de propostas.
4. Cobrir parser/carregamento com testes automatizados.

Entrega:

1. Governanca publicavel por PR, no mesmo modelo operacional dos zines.
2. Base pronta para evolucao de voto onchain em sprint seguinte.

DoD:

1. `npm run check:all` verde.
2. `npm run build` verde.
3. Pelo menos 3 propostas publicadas em `content/governance`.

Status de execucao (2026-03-03):

1. Concluido: `/zine-dao` com board de propostas, status e botoes de voto para MVP.
2. Concluido: parser `src/lib/governance.ts` + tipos em `src/types/governance.ts`.
3. Concluido: 4 propostas publicadas em `content/governance/*/index.md`.
4. Concluido: teste `src/test/governance.test.ts` cobrindo validacao e carregamento.

## Sprint 5 (1 semana) - DAO Context and Product Framing

Escopo:

1. Home com bloco claro do ciclo DAO (propor, votar, executar).
2. Pagina `/zine-dao/modelo` com:
   - tese do token utilitario $ZINE;
   - papeis da rede (leitores, editoras, impressoras, tesouro);
   - fluxo operacional de governanca.
3. Reforcar manifesto com framing DAO e links de acao.
4. Padronizar navegacao para "Zine DAO".

Entrega:

1. O produto comunica a DAO como parte central da experiencia editorial.
2. Participacao fica orientada por CTAs concretos (`propor`, `votar`, `apoiar`).

DoD:

1. `npm run check:all` verde.
2. `npm run build` verde.
3. Smoke manual em `/`, `/manifesto`, `/zine-dao`, `/zine-dao/modelo`, `/zine-dao/propor`.

Status de execucao (2026-03-03):

1. Concluido: bloco `Zine DAO em operacao` na home.
2. Concluido: pagina `/zine-dao/modelo` publicada.
3. Concluido: manifesto atualizado com contexto DAO.
4. Concluido: navegacao renomeada para `Zine DAO`.

## 3. Cross-cutting requirements

1. Copy sem jargao "mint"; manter CTA "Apoiar este zine".
2. Logs de apoio persistidos no Postgres (sem fallback em producao).
3. Revisao de acessibilidade basica por sprint:
   - foco visivel
   - contraste
   - labels de formularios
4. QA minimo por release:
   - `/`
   - `/manifesto`
   - `/zines/[slug]`
   - `/checkout`

## 4. KPI targets (demo window)

1. >= 30 zines com metadados completos.
2. >= 20 apoios registrados (wallet + pix sandbox + email).
3. >= 2 publicacoes editoriais semanais (news/eventos).
4. Tempo medio catalogo -> apoio < 2 minutos em teste guiado.

## 5. Cut rules

1. Se houver risco de prazo, cortar primeiro agenda/eventos dinamicos.
2. Nao cortar:
   - leitura aberta
   - apoio funcional
   - curadoria publica
   - metadados essenciais

## 6. Suggested commit strategy

1. `feat(editorial): curadoria + como-apoiar + series`
2. `feat(metadata): frontmatter expandido + filtros`
3. `feat(ecosystem): ensino + recursos + eventos`
4. `chore(release): qa + docs + deploy notes`
