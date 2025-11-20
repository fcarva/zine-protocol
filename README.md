# 🎨 Zine Protocol

> A decentralized publishing protocol that transforms NFTs into physical zines, powered by Juicebox V3 on Ethereum.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Wagmi](https://img.shields.io/badge/Wagmi-2.0-purple)
![Juicebox](https://img.shields.io/badge/Juicebox-V3-yellow)

## 🌟 Overview

Zine Protocol is a Web3-native publishing platform that bridges digital and physical art. Contributors mint **$ZINE** tokens by supporting the treasury, which funds the creation and distribution of physical zines curated from NFT collections.

### Key Features

- 💰 **Transparent Treasury** - All funds managed on-chain via Juicebox V3
- 🎟️ **Token-Gated Access** - $ZINE holders get exclusive zine drops
- 🔄 **Redemption Mechanism** - Burn tokens to reclaim ETH from treasury
- 📊 **Live Dashboard** - Real-time stats from Juicebox Subgraph
- 🎨 **Flexoki Design System** - Beautiful, accessible UI inspired by zine aesthetics

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Styling**: Tailwind CSS + Flexoki color palette
- **Web3**: [Wagmi](https://wagmi.sh/) + [Viem](https://viem.sh/)
- **Blockchain**: Ethereum (Sepolia testnet)
- **Treasury**: [Juicebox V3](https://juicebox.money/)
- **Data**: The Graph (Juicebox Subgraph)
- **Animations**: Framer Motion

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- Sepolia ETH for testing ([faucet](https://sepoliafaucet.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/zine-protocol.git
   cd zine-protocol
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_CHAIN_ID=11155111
   NEXT_PUBLIC_JB_PROJECT_ID=167
   NEXT_PUBLIC_JB_ETH_TERMINAL_ADDRESS=0x55d4dfb578daA4d60380995ffF7a706471d7c719
   NEXT_PUBLIC_SUBGRAPH_URL=https://api.studio.thegraph.com/query/50618/juicebox-v3-sepolia/version/latest
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Project Structure

```
zine-protocol/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── page.tsx      # Homepage with collage hero
│   │   ├── zines/        # Zines catalog page
│   │   ├── supply/       # Token minting page
│   │   └── about/        # About page
│   ├── components/       # React components
│   │   ├── Header.tsx
│   │   ├── VendingMachine.tsx
│   │   ├── TreasuryDashboard.tsx
│   │   └── ZineActivityFeed.tsx
│   ├── contracts/        # Smart contract ABIs and addresses
│   │   └── juicebox.ts
│   ├── hooks/            # Custom React hooks
│   │   ├── usePay.ts
│   │   ├── useProjectStats.ts
│   │   └── useActivityFeed.ts
│   └── data/             # Mock data and types
├── public/               # Static assets
└── .env.example          # Environment variables template
```

## 🎯 Core Features

### 1. Treasury Dashboard
Real-time display of:
- ETH balance in treasury
- Total volume raised
- Number of contributors
- Token backing ratio

### 2. Vending Machine
Mint $ZINE tokens by contributing ETH:
- Connect wallet
- Enter ETH amount
- Receive $ZINE tokens
- View transaction on Etherscan

### 3. Activity Feed
Live feed of all minting events:
- Who minted
- How much $ZINE received
- Transaction links
- Timestamps

### 4. Zine Catalog
Browse available zines:
- Cover art
- Descriptions
- Availability status
- Token-gated access

## 🔗 Juicebox Integration

This project uses Juicebox V3 for treasury management:

- **Project ID**: 167 (Sepolia)
- **Terminal**: JBETHPaymentTerminal3_1_2
- **Subgraph**: Juicebox V3 Sepolia

### Key Contracts

- **Payment Terminal**: `0x55d4dfb578daA4d60380995ffF7a706471d7c719`
- **Network**: Sepolia (Chain ID: 11155111)

## 🧪 Testing

```bash
# Type checking
npx tsc --noEmit

# Build production bundle
npm run build

# Run production build locally
npm start
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Manual Deployment

```bash
npm run build
npm start
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- [Juicebox Project](https://sepolia.juicebox.money/v5/sep:167)
- [Juicebox Docs](https://docs.juicebox.money/)
- [Wagmi Documentation](https://wagmi.sh/)
- [Next.js Documentation](https://nextjs.org/docs)

## 💬 Support

For questions or support:
- Open an issue on GitHub
- Join the [JuiceboxDAO Discord](https://discord.gg/juicebox)

---

Built with ❤️ using Juicebox V3
