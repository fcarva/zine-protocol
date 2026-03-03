import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { TopEditorialBar } from "@/components/top-editorial-bar";

const sans = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Zine Protocol",
  description: "Catalogo de zines com leitura aberta e apoio financeiro para artistas independentes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <AppProviders>
          <div className="relative min-h-screen overflow-x-clip">
            <div className="paper-noise" />
            <div className="print-bleed" />
            <SiteHeader />
            <main className="relative z-10 min-h-screen px-3 pb-8 pt-0 sm:px-4 sm:pb-9 sm:pt-0 lg:ml-[var(--sidebar-width)] lg:px-4 lg:pt-0 xl:px-5">
              <div className="w-full max-w-[1400px] lg:pr-6 xl:pr-8">
                <TopEditorialBar />
                <div className="pt-2 sm:pt-2.5">{children}</div>
              </div>
            </main>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
