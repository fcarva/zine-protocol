# Barnard Zine Library - Contexto para Zine Protocol

Data da coleta: 2026-03-02
URL base: https://zines.barnard.edu/

## 1) O que o site faz bem (modelo de produto)

O site funciona como um produto hibrido com 4 camadas no mesmo lugar:

1. Biblioteca/arquivo (colecao, acesso, doacao, catalogo).
2. Educacao (aulas, workshops, planos de aula, recursos para bibliotecarias).
3. Midia editorial (news com series recorrentes e contexto politico-cultural).
4. Infra de rede (diretorio de zine libraries, zineography, recursos NYC, links externos).

Para o Zine Protocol, isso e importante porque mostra que valor de longo prazo nao vem so do "catalogo + botao de apoiar", mas de ecossistema editorial + pedagogico.

## 2) Arquitetura observada (crawl rapido)

Crawl tecnico (profundidade limitada) encontrou 89 URLs internas unicas.

Distribuicao principal por secao:

- `news`: 21 paginas
- `events`: 10 paginas
- paginas institucionais/guia: 1-2 por topico

Leitura: o site nao e apenas vitrine estatica. Ha ritmo de publicacao continuo em noticias e eventos.

## 3) Achados de conteudo que devemos internalizar

### 3.1 Missao e posicionamento

- Define zine como formato DIY, self-published, low-cost, historicamente ligado a contracultura e comunidade.
- Se posiciona explicitamente como espaco politico e cultural, nao neutro.

Implicacao para Zine Protocol:

- Manifesto deve explicitar "por que" (leitura aberta + sustentacao de produtoras) e nao apenas "como" (wallet/pix).

### 3.2 Curadoria + acesso

- Colecao com milhares de itens e acesso orientado a consulta local + catalogo online.
- Politica de doacao clara: curadoria ativa, sem prometer aceitar tudo.

Implicacao:

- Publicacao por convite no MVP esta correta, mas precisa politica publicada (criterios, escopo, resposta esperada).

### 3.3 Catalogacao e metadados

- O site discute limites de vocabulario padrao e uso de termos locais para representacao mais justa.

Implicacao:

- No frontmatter, alem de tags livres, adicionar campos de taxonomia editorial controlada (ex.: tema, territorio, linguagem, formato de edicao).

### 3.4 Educacao como motor de crescimento

- Paginas de classes/workshops e lesson plans mostram uso de zines como metodo de ensino.

Implicacao:

- Abrir trilha "ensino" no Zine Protocol para aumentar adocao institucional (professoras, escolas, coletivos).

### 3.5 Cadencia editorial

- Serie recorrente tipo "We've got a zine for ..." cria rotina e descoberta.

Implicacao:

- Criar serie editorial no Zine Protocol (ex.: "Zine da Semana", "Arquivo vivo do mes") com CTA de apoio integrado.

## 4) O que implementar no Zine Protocol (proxima fase)

## P0 (alto impacto, baixo risco)

1. Pagina `"/curadoria"` com politica de convite, criterios e formulario.
2. Bloco `"Series editoriais"` na home com 1 destaque fixo + 3 relacionados.
3. Campos novos no frontmatter:
   - `language`
   - `city`
   - `year`
   - `format`
   - `themes_controlled` (lista controlada)
4. Pagina `"/como-apoiar"` explicando wallet/email/pix em linguagem nao tecnica.

## P1 (produto expandido)

1. Secao `"Ensino"` com planos de aula e uso em oficina.
2. Secao `"Recursos"` com links externos e bibliografia (zineography).
3. Secao `"Eventos"` com agenda curada + workshops.

## P2 (escala de ecossistema)

1. Diretorio de zine labs/coletivos (modelo similar ao de zine libraries).
2. Relatorios editoriais mensais (zines publicados, apoios, temas emergentes).
3. Pipeline de onboarding para novas curadoras.

## 5) Riscos observados e mitigacao

1. Risco de virar apenas galeria visual: mitigar com trilhas editoriais recorrentes.
2. Risco de taxonomia fraca: mitigar com vocabulario controlado + tags livres.
3. Risco de narrativa web3 confusa: mitigar com copy centrada em "apoio".
4. Risco de baixa recorrencia: mitigar com calendario editorial (news + eventos).

## 6) Fontes usadas

- https://zines.barnard.edu/
- https://zines.barnard.edu/zine-basics
- https://zines.barnard.edu/zine-genres
- https://zines.barnard.edu/zine-basics/how-make-zine
- https://zines.barnard.edu/about-zines-at-barnard
- https://zines.barnard.edu/about-collection
- https://zines.barnard.edu/collection-access-circulation
- https://zines.barnard.edu/donation
- https://zines.barnard.edu/barnard-zines-online-links
- https://zines.barnard.edu/news
- https://zines.barnard.edu/exhibits
- https://zines.barnard.edu/zine-research-and-teaching
- https://zines.barnard.edu/zine-classes-and-workshops
- https://zines.barnard.edu/lesson-plans
- https://zines.barnard.edu/librarian-resources
- https://zines.barnard.edu/zineography
- https://zines.barnard.edu/nyc-resources
- https://zines.barnard.edu/zine-sites
- https://zines.barnard.edu/events
