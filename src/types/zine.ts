export type FundingMode = "campaign" | "continuous";

export type ZineStatus = "draft" | "published";

export const ZINE_LANGUAGE_VALUES = ["pt-BR", "en", "fr", "es"] as const;
export type ZineLanguage = (typeof ZINE_LANGUAGE_VALUES)[number];

export const ZINE_FORMAT_VALUES = ["A5", "A4", "A3", "Poster", "Tabloid", "Digital"] as const;
export type ZineFormat = (typeof ZINE_FORMAT_VALUES)[number];

export const ZINE_THEME_VALUES = [
  "zine",
  "antmag",
  "arquivo",
  "bairro",
  "cidade",
  "mapa",
  "memoria",
  "territorio",
  "fotocopia",
  "fotografia",
  "colagem",
  "poesia",
  "objeto",
  "musica",
  "moda",
  "skate",
  "comunidade",
  "experimental",
] as const;
export type ZineTheme = (typeof ZINE_THEME_VALUES)[number];

export interface ZineFrontmatter {
  slug: string;
  title: string;
  artist_name: string;
  artist_wallet: string;
  cover_image: string;
  excerpt: string;
  tags: string[];
  language: ZineLanguage;
  city: string;
  year: number;
  format: ZineFormat;
  themes_controlled: ZineTheme[];
  revnet_project_id: number;
  funding_mode: FundingMode;
  target_usdc?: number;
  deadline_iso?: string;
  status: ZineStatus;
  sort_order: number;
}

export interface Zine extends ZineFrontmatter {
  content: string;
  path: string;
}

