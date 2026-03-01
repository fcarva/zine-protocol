import type { Metadata } from "next";
import { Cormorant_Garamond, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const sans = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Zine Protocol",
  description:
    "Catalogo de zines com leitura aberta e apoio financeiro para artistas independentes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable}`}>
      <body>
        <AppProviders>
          <div className="relative min-h-screen">
            <div className="background-grid" />
            <SiteHeader />
            <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-8">{children}</main>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}

