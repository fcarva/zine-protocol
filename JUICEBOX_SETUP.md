# Juicebox Protocol Setup (Sepolia)

Zine Protocol runs on top of Juicebox V3 as a **Revnet** (Revenue Network). To simulate the backend, you need to deploy a project on the Sepolia Testnet.

## Steps to Deploy

1. Go to [juicebox.money](https://juicebox.money) and switch your wallet to **Sepolia**.
2. Click **Create Project**.
3. **Project Settings (Revnet Model):**
   - **Cycles:** Automated (or set to your preference).
   - **Payouts:** **0% (No Payouts)**. All revenue stays in the treasury ("Overflow") to back the token value.
   - **Tokens:** Enable ERC-20 Token Minting.
     - Name: `Zine Protocol Token` ($ZINE).
     - Issuance Rate: `1,000` tokens per 1 ETH (Example - adjust as needed).
     - Redemption Rate: `95%` (Creates a 5% cash-out tax when burning tokens, benefiting remaining holders).
     - Reserved Rate: `0%` or set aside tokens for team/contributors.
4. **Deploy** and wait for confirmation.
5. **Copy your Project ID** and paste it into `.env.local`.

## Contracts

- **JBETHPaymentTerminal (V3.1.2):** `0x55d4dfb578daA4d60380995ffF7a706471d7c719` (Sepolia)
- **Subgraph:** `https://api.studio.thegraph.com/query/50618/juicebox-v3-sepolia/version/latest`

## Environment Setup

After deploying your project, create a `.env.local` file:

```bash
cp .env.example .env.local
```

Then fill in your `NEXT_PUBLIC_JB_PROJECT_ID` with the ID from your deployed project.

## Testing

1. **Restart your dev server** after creating `.env.local`:
   ```bash
   npm run dev
   ```

2. **Connect your wallet** to Sepolia network.

3. **Mint $ZINE tokens** on the `/supply` page to test the integration.

4. **Check the dashboard** on `/zines` to see live treasury data.

## Troubleshooting

- **"Failed to load treasury data"**: The subgraph may take 5-10 minutes to index your new project. Try minting some tokens to trigger indexing.
- **"Transaction failed"**: Make sure you have Sepolia ETH. Get some from [sepoliafaucet.com](https://sepoliafaucet.com/).
- **"Project not found"**: Double-check your `NEXT_PUBLIC_JB_PROJECT_ID` in `.env.local`.
