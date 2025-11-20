export interface Zine {
    id: number;
    title: string;
    issueNumber: number;
    coverImage: string;
    description: string;
    priceInZine: number;
    priceInEth: number;
    releaseDate: string;
    supply: number;
    soldCount: number;
    collectors: number;
    artist: string;
    artistAddress: string;
    tags: string[];
}

export const MOCK_ZINES: Zine[] = [
    {
        id: 1,
        title: "The Birth",
        issueNumber: 1,
        coverImage: "/covers/issue-1.png",
        description: "The genesis issue exploring the intersection of underground culture and decentralized publishing. Featuring experimental photography and artistic manifests.",
        priceInZine: 50,
        priceInEth: 0.025,
        releaseDate: "2024-01-15",
        supply: 100,
        soldCount: 87,
        collectors: 43,
        artist: "collective.eth",
        artistAddress: "0x1234567890123456789012345678901234567890",
        tags: ["genesis", "photography", "manifesto"],
    },
    {
        id: 2,
        title: "Concrete Dreams",
        issueNumber: 2,
        coverImage: "/covers/issue-2.png",
        description: "Brutalist architecture meets digital art. A visual journey through urban decay and modern reconstruction.",
        priceInZine: 50,
        priceInEth: 0.025,
        releaseDate: "2024-02-20",
        supply: 150,
        soldCount: 134,
        collectors: 76,
        artist: "architect.eth",
        artistAddress: "0x2345678901234567890123456789012345678901",
        tags: ["architecture", "brutalism", "urban"],
    },
    {
        id: 3,
        title: "Digital Flesh",
        issueNumber: 3,
        coverImage: "/covers/issue-3.png",
        description: "Cyberpunk aesthetics collide with analog photography. Exploring the liminal space between human and machine.",
        priceInZine: 75,
        priceInEth: 0.038,
        releaseDate: "2024-03-22",
        supply: 120,
        soldCount: 98,
        collectors: 54,
        artist: "glitch.eth",
        artistAddress: "0x3456789012345678901234567890123456789012",
        tags: ["cyberpunk", "glitch", "digital"],
    },
    {
        id: 4,
        title: "Silent Frequencies",
        issueNumber: 4,
        coverImage: "/covers/issue-4.png",
        description: "A minimalist exploration of sound and silence. Featuring experimental musicians and sound artists.",
        priceInZine: 60,
        priceInEth: 0.031,
        releaseDate: "2024-04-10",
        supply: 80,
        soldCount: 52,
        collectors: 38,
        artist: "sonic.eth",
        artistAddress: "0x4567890123456789012345678901234567890123",
        tags: ["music", "experimental", "minimalism"],
    },
    {
        id: 5,
        title: "Analog Revolution",
        issueNumber: 5,
        coverImage: "/covers/issue-5.png",
        description: "Counter-culture movements through the lens of vintage photography. A celebration of analog media in a digital age.",
        priceInZine: 50,
        priceInEth: 0.025,
        releaseDate: "2024-05-15",
        supply: 200,
        soldCount: 23,
        collectors: 19,
        artist: "film.eth",
        artistAddress: "0x5678901234567890123456789012345678901234",
        tags: ["photography", "vintage", "counter-culture"],
    },
];
