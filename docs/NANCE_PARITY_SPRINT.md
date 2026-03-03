# Nance Parity Sprint (MVP)

Data: 2026-03-03

## Repositorios base estudados

1. `nance-eth/nance-interface`: https://github.com/nance-eth/nance-interface
2. `nance-eth/nance-ts`: https://github.com/nance-eth/nance-ts

## Padroes do Nance mapeados

1. Lista de propostas com filtros e paginação:
   - `GET /{space}/proposals`
2. Criacao de proposta:
   - `POST /{space}/proposals`
3. Leitura e edicao de proposta:
   - `GET /{space}/proposal/{proposalId}`
   - `PUT /{space}/proposal/{proposalId}`
4. Mudanca de status de proposta:
   - `PATCH /{space}/proposal/{proposalId}/status/{status}`
5. Fluxo ciclico:
   - `discussion -> temperature_check -> voting -> approved/cancelled -> queued/executed`

## Implementacao equivalente no Zine Protocol

1. API list/create:
   - `GET /api/governance/proposals`
   - `POST /api/governance/proposals`
2. API detail/update/delete:
   - `GET /api/governance/proposal/:proposalId`
   - `PUT /api/governance/proposal/:proposalId`
   - `DELETE /api/governance/proposal/:proposalId`
3. API de status:
   - `PATCH /api/governance/proposal/:proposalId/status/:status`
4. API de voto:
   - `POST /api/governance/proposal/:proposalId/vote`
5. UI:
   - `/zine-dao` com board de propostas e voto
   - `/zine-dao/propor` para escrever proposta
   - `/zine-dao/[proposalId]` para detalhe, status e gestao

## Observacoes MVP

1. Propostas vindas de `content/governance` permanecem read-only.
2. Propostas criadas pela interface usam armazenamento app (Prisma ou fallback em memoria).
3. O ciclo de status segue nomenclatura inspirada no Nance, adaptada ao contexto editorial do Zine Protocol.
