import { Ticker } from "@/components/ui/Ticker";
import { Header } from "@/components/Header";
import { CollageHero } from "@/components/CollageHero";
import { Marquee } from "@/components/Marquee";
import { StickerCard } from "@/components/StickerCard";
import { MintWaitlist } from "@/components/MintWaitlist";
import { Footer } from "@/components/Footer";
import { MOCK_MENTIONS } from "@/data/mockMentions";

export default function Home() {
  return (
    <main className="min-h-screen bg-flexoki-bg overflow-x-hidden">
      <Header />
      <CollageHero />

      <Marquee />

      {/* Chaos Content Section */}
      <section className="relative py-32 px-4 bg-flexoki-bg-200">
        {/* Ripped Paper Top */}
        <div className="absolute top-0 left-0 w-full h-12 bg-flexoki-bg"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 10%)' }} />

        <div className="max-w-7xl mx-auto relative">
          {/* Floating "Sticker" Heading */}
          <div className="absolute -top-20 left-10 md:left-20 rotate-[-5deg] z-20">
            <div className="bg-flexoki-red text-flexoki-bg px-8 py-4 shadow-paper transform hover:scale-110 transition-transform cursor-default">
              <h2 className="font-mono text-4xl md:text-6xl font-bold uppercase tracking-tighter">
                FRESH INK
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-8 pt-12">
            {MOCK_MENTIONS.map((mention, index) => (
              <div
                key={mention.id}
                className={`transform ${index % 2 === 0 ? 'md:translate-y-12' : 'md:-translate-y-12'}`}
              >
                <StickerCard
                  mention={mention}
                  rotation={(index * 13) % 10 - 5} // Random rotation between -5 and 5
                />
              </div>
            ))}
          </div>
        </div>

        {/* Ripped Paper Bottom */}
        <div className="absolute bottom-0 left-0 w-full h-16 bg-zine-dark"
          style={{ clipPath: 'polygon(0 90%, 100% 0, 100% 100%, 0 100%)' }} />
      </section>

      <MintWaitlist />
      <Footer />
    </main>
  );
}
