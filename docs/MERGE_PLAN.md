# Merge Plan (Private Repo)

## Objetivo

Subir o estado atual do MVP com historico limpo e baixo risco de regressao.

## Ordem recomendada de commits

1. `feat(content): importacao de zines antmag e assets`
2. `feat(ui): landing clean + cards + leitura aberta`
3. `feat(payments): wallet/email/pix checkout e logs`
4. `chore(repo): limpeza de estrutura, scripts e docs`

## Risco conhecido

- `markdown-renderer` usa `<img>` para manter fluxo editorial de pagina aberta.
- Next lint mostra warning `no-img-element` (esperado por design atual).

## Pos-merge imediato

1. Configurar secrets no repositório privado:
   - `NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL`
   - `NEXT_PUBLIC_USDC_ADDRESS`
   - `NEXT_PUBLIC_REVNET_TERMINAL_ADDRESS`
   - `ABACATEPAY_API_KEY`
   - `ABACATEPAY_WEBHOOK_SECRET`
2. Rodar deploy preview.
3. Validar fluxo de apoio Web3 + Pix sandbox em preview.
