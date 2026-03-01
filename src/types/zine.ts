export type FundingMode = "campaign" | "continuous";

export type ZineStatus = "draft" | "published";

export interface ZineFrontmatter {
  slug: string;
  title: string;
  artist_name: string;
  artist_wallet: string;
  cover_image: string;
  excerpt: string;
  tags: string[];
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

