export interface Mention {
    id: string;
    title: string;
    excerpt: string;
    author: string;
    date: string;
    slug: string;
    readTime: string;
    category: 'Dispatch' | 'Essay' | 'Protocol';
    content?: string; // Markdown or HTML content
}

export const MOCK_MENTIONS: Mention[] = [
    {
        id: '1',
        title: "The Death of Centralized Printing",
        excerpt: "Why distributed logistics is the only answer to censorship and logistical costs in the 21st century.",
        author: "zine_dao.eth",
        date: "2025-11-18",
        slug: "death-of-centralized-printing",
        readTime: "5 min",
        category: 'Essay',
        content: `
      <p>The printing press was the first engine of democratization. But in the age of Amazon and centralized distribution hubs, physical media has become a luxury good, gated by shipping costs and algorithmic censorship.</p>
      <p>Zine Protocol proposes a different model: <strong>Print Nodes</strong>. Local, independent printers who stake tokens to become authorized distributors of the protocol's catalog.</p>
      <p>When you buy a zine on the protocol, the smart contract routes the order to the nearest active Print Node. The PDF is decrypted locally, printed on demand, and shipped within the same city or region.</p>
      <p>This reduces shipping costs by 90%, eliminates customs censorship, and puts money directly into the hands of local businesses rather than global logistics giants.</p>
      <p>It is not just efficiency. It is resistance.</p>
    `
    },
    {
        id: '2',
        title: "Dispatch #04: The End of Overflow",
        excerpt: "Technical analysis on how the $ZINE redemption curve is behaving after the last halving.",
        author: "dev.eth",
        date: "2025-11-15",
        slug: "dispatch-04-overflow",
        readTime: "3 min",
        category: 'Protocol',
        content: `
      <p>The backing ratio has stabilized at 0.005 ETH per $ZINE following the implementation of the new bonding curve parameters.</p>
      <p>This week's burn event removed 4,000 $ZINE from circulation, effectively raising the floor price by 2.3%. As we approach the next halving event, we expect the scarcity mechanics to drive further accumulation.</p>
      <p><strong>Key Metrics:</strong></p>
      <ul>
        <li>Treasury Balance: 12.45 ETH</li>
        <li>Circulating Supply: 2,475 $ZINE</li>
        <li>Burn Rate: 150 $ZINE/day</li>
      </ul>
    `
    },
    {
        id: '3',
        title: "Aesthetics of the Underground",
        excerpt: "Exploring the visual language of resistance in the digital age.",
        author: "art_dept.eth",
        date: "2025-11-10",
        slug: "aesthetics-of-underground",
        readTime: "7 min",
        category: 'Essay',
        content: `
      <p>We are drowning in polish. The corporate internet is smooth, rounded, and inoffensive. It is designed to slide past your defenses without friction.</p>
      <p>Zine culture has always been about friction. The grain of the paper, the smear of the ink, the jagged edge of a cut-and-paste collage. It demands attention.</p>
      <p>In bringing zines to the blockchain, we must preserve this friction. Our UI is not "user-friendly" in the corporate sense. It is raw. It uses noise, monospace fonts, and high-contrast colors.</p>
      <p>We are not building an app. We are building a machine.</p>
    `
    }
];
