import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import {
  ZINE_FORMAT_VALUES,
  ZINE_LANGUAGE_VALUES,
  ZINE_THEME_VALUES,
  type Zine,
  type ZineFrontmatter,
} from "@/types/zine";

const contentRoot = path.join(process.cwd(), "content", "zines");

const zineFrontmatterSchema = z
  .object({
    slug: z.string().min(2),
    title: z.string().min(2),
    artist_name: z.string().min(2),
    artist_wallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
    cover_image: z.string().min(2),
    excerpt: z.string().min(10),
    tags: z.array(z.string().min(1)).min(1),
    language: z.enum(ZINE_LANGUAGE_VALUES),
    city: z.string().min(2),
    year: z.number().int().min(1900).max(2100),
    format: z.enum(ZINE_FORMAT_VALUES),
    themes_controlled: z.array(z.enum(ZINE_THEME_VALUES)).min(1).max(5),
    revnet_project_id: z.number().int().positive(),
    funding_mode: z.enum(["campaign", "continuous"]),
    target_usdc: z.number().positive().optional(),
    deadline_iso: z.string().datetime({ offset: true }).optional(),
    status: z.enum(["draft", "published"]),
    sort_order: z.number().int(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.funding_mode === "campaign") {
      if (!data.target_usdc) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "target_usdc e obrigatorio para campaign",
          path: ["target_usdc"],
        });
      }

      if (!data.deadline_iso) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "deadline_iso e obrigatorio para campaign",
          path: ["deadline_iso"],
        });
      }
    }
  });

export function parseZineFrontmatter(raw: unknown): ZineFrontmatter {
  return zineFrontmatterSchema.parse(raw);
}

async function readZineFromDir(dirName: string): Promise<Zine> {
  const filePath = path.join(contentRoot, dirName, "index.md");
  const markdown = await fs.readFile(filePath, "utf8");
  const parsed = matter(markdown);
  const frontmatter = parseZineFrontmatter(parsed.data);

  return {
    ...frontmatter,
    content: parsed.content,
    path: filePath,
  };
}

export async function getAllZines(): Promise<Zine[]> {
  const entries = await fs.readdir(contentRoot, { withFileTypes: true });
  const zines = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => readZineFromDir(entry.name)),
  );

  return zines.sort((a, b) => a.sort_order - b.sort_order);
}

export async function getPublishedZines(): Promise<Zine[]> {
  const all = await getAllZines();
  return all.filter((zine) => zine.status === "published");
}

export async function getZineBySlug(slug: string): Promise<Zine | null> {
  const all = await getAllZines();
  return all.find((zine) => zine.slug === slug) ?? null;
}

export function getCampaignProgress(zine: Zine, amountUsdc6: bigint): number | null {
  if (zine.funding_mode !== "campaign" || !zine.target_usdc) {
    return null;
  }

  const target = BigInt(Math.round(zine.target_usdc * 1_000_000));
  if (target === BigInt(0)) return 0;

  const pct = Number((amountUsdc6 * BigInt(10000)) / target) / 100;
  return Math.min(100, Math.max(0, pct));
}

