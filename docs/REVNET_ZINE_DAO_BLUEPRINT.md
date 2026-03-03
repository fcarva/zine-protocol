# Zine DAO com Revnet - Blueprint

Data: 2026-03-03

## 1) Objetivo

Transformar o Zine Protocol em um publisher onchain orientado por rede, usando a arquitetura Revnet/Juicebox para alinhar:

1. Leitores (apoio e distribuicao).
2. Editoras (curadoria e qualidade).
3. Impressoras (producao local).
4. Investidores de comunidade (crescimento de longo prazo).

## 2) Tese economica

1. O token `$ZINE` representa participacao na rede editorial.
2. O valor do token depende do crescimento real de uso: mais zines publicados, mais distribuicao, mais entradas de apoio.
3. O modelo evita promessa de retorno fixo. O resultado economico e emergente da atividade da rede.

## 3) Como Revnet encaixa

Com base na documentacao de `revnet-core-v5`, o deploy permite configurar:

1. `stageConfigurations` (fases de emissao e regras por periodo).
2. `splitPercent` e `splits` (direcionamento de emissao para operacao/colaboradores).
3. `initialIssuance`, `issuanceCutFrequency`, `issuanceCutPercent` (curva de entrada por geracoes).
4. `cashOutTaxRate` (curva de saida para desincentivar churn imediato).
5. `splitOperator` (operacao inicial de rede com possibilidade de transicao).

## 4) Blueprint funcional para MVP+

1. Entrada:
   - Checkout atual (wallet/email/pix) segue como camada UX.
   - Pagamentos onchain mapeados para o projeto Revnet por zine.
2. Emissao:
   - Em fase inicial, emissao em estagios com queda progressiva.
   - Parte da emissao reservada para operacao editorial e impressao local.
3. Distribuicao:
   - Protocolo de retirada fisica da copia impressa associado ao apoio.
4. Saida:
   - Cash out seguindo `cashOutTaxRate` configurado em contrato.

## 5) Guardrails

1. Sem linguagem de promessa de lucro.
2. Disclosure de risco em todas as paginas de tese/token.
3. Transparencia de regras economicas no front.
4. Metrica de saude ligada a atividade editorial (zines, leitura, distribuicao), nao so preco.

## 6) Fontes

1. Revnet app: https://www.revnet.app
2. Repositorios Revnet: https://github.com/orgs/rev-net/repositories
3. `revnet-core-v5` README: https://github.com/rev-net/revnet-core-v5/blob/main/README.md
4. `revnet-app` README: https://github.com/rev-net/revnet-app/blob/main/README.md
5. Proposta Revnet/Juicebox (`jb-proposal.md`): https://github.com/rev-net/whitepaper/blob/master/jb-proposal.md
