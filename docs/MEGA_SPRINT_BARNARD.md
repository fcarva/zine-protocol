# Mega Sprint - Barnard Context to Product Execution

Data base: 2026-03-02
Referencia: `research/barnard/BARNARD_CONTEXT.md`

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
