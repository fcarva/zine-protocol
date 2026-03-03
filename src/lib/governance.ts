import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import {
  GOVERNANCE_STAGE_VALUES,
  type GovernanceProposal,
  type GovernanceProposalFrontmatter,
} from "@/types/governance";

const governanceRoot = path.join(process.cwd(), "content", "governance");

const governanceFrontmatterSchema = z
  .object({
    id: z.string().regex(/^ZP-\d{3}$/),
    slug: z.string().min(2),
    title: z.string().min(8),
    summary: z.string().min(20),
    stage: z.enum(GOVERNANCE_STAGE_VALUES),
    cycle: z.string().min(6),
    author: z.string().min(3),
    quorum_required: z.number().int().positive(),
    votes_for: z.number().int().min(0),
    votes_against: z.number().int().min(0),
    votes_abstain: z.number().int().min(0),
    status: z.enum(["draft", "published"]),
    sort_order: z.number().int(),
  })
  .strict()
  .superRefine((data, ctx) => {
    const totalVotes = data.votes_for + data.votes_against + data.votes_abstain;
    if (totalVotes === 0 && data.stage !== "discussion") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "propostas fora de discussion devem ter pelo menos 1 voto registrado",
        path: ["votes_for"],
      });
    }
  });

export function parseGovernanceFrontmatter(raw: unknown): GovernanceProposalFrontmatter {
  return governanceFrontmatterSchema.parse(raw);
}

async function readProposalFromDir(dirName: string): Promise<GovernanceProposal> {
  const filePath = path.join(governanceRoot, dirName, "index.md");
  const markdown = await fs.readFile(filePath, "utf8");
  const parsed = matter(markdown);
  const frontmatter = parseGovernanceFrontmatter(parsed.data);

  return {
    ...frontmatter,
    content: parsed.content,
    path: filePath,
  };
}

export async function getAllGovernanceProposals(): Promise<GovernanceProposal[]> {
  let entries;
  try {
    entries = await fs.readdir(governanceRoot, { withFileTypes: true });
  } catch {
    return [];
  }

  const proposals = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => readProposalFromDir(entry.name)),
  );

  return proposals.sort((a, b) => a.sort_order - b.sort_order);
}

export async function getPublishedGovernanceProposals(): Promise<GovernanceProposal[]> {
  const all = await getAllGovernanceProposals();
  return all.filter((proposal) => proposal.status === "published");
}
