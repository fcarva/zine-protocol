import {
  getAllGovernanceProposals,
  getPublishedGovernanceProposals,
} from "@/lib/governance";
import {
  addDaoProposalVote,
  createDaoProposal,
  deleteDaoProposal,
  getDaoProposalByAnyId,
  listDaoProposals,
  patchDaoProposalStatus,
  type DaoProposalCreateInput,
  type DaoProposalRecord,
  type DaoProposalStatusValue,
  type DaoProposalUpdateInput,
  updateDaoProposal,
} from "@/lib/storage";
import {
  type GovernanceBoardProposal,
  type GovernanceDaoStatus,
  type GovernanceProposal,
  type GovernanceProposalStage,
} from "@/types/governance";

export interface GovernanceQueryInput {
  cycle?: string;
  keyword?: string;
  author?: string;
  status?: GovernanceDaoStatus;
  stage?: GovernanceProposalStage;
  limit?: number;
  page?: number;
  includeDrafts?: boolean;
}

export interface GovernanceQueryResult {
  proposals: GovernanceBoardProposal[];
  hasMore: boolean;
  total: number;
  nextProposalId: number;
  proposalIdPrefix: string;
}

export interface CreateGovernanceProposalInput {
  title: string;
  summary: string;
  body: string;
  cycleLabel?: string;
  governanceCycle?: number;
  authorName: string;
  authorWallet?: string;
  quorumRequired?: number;
  status?: Extract<GovernanceDaoStatus, "draft" | "discussion">;
  slug?: string;
}

export interface UpdateGovernanceProposalInput {
  title?: string;
  summary?: string;
  body?: string;
  cycleLabel?: string;
  governanceCycle?: number;
  authorName?: string;
  authorWallet?: string;
  quorumRequired?: number;
}

export type GovernanceVoteChoice = "for" | "against" | "abstain";

export function governanceStageFromStatus(status: GovernanceDaoStatus): GovernanceProposalStage {
  if (status === "discussion" || status === "draft" || status === "cancelled" || status === "archived") {
    return "discussion";
  }
  if (status === "temperature_check") return "temperature_check";
  if (status === "voting") return "vote";
  if (status === "approved" || status === "queued") return "queued";
  return "executed";
}

export function governanceStatusFromStage(
  stage: GovernanceProposalStage,
): GovernanceDaoStatus {
  if (stage === "discussion") return "discussion";
  if (stage === "temperature_check") return "temperature_check";
  if (stage === "vote") return "voting";
  if (stage === "queued") return "queued";
  return "executed";
}

export function canEditGovernanceStatus(status: GovernanceDaoStatus): boolean {
  return status === "draft" || status === "discussion" || status === "temperature_check";
}

export async function queryGovernanceProposals(
  query: GovernanceQueryInput = {},
): Promise<GovernanceQueryResult> {
  const [contentSource, daoSource] = await Promise.all([
    query.includeDrafts ? getAllGovernanceProposals() : getPublishedGovernanceProposals(),
    listDaoProposals(),
  ]);

  const merged = [
    ...contentSource.map(mapContentProposalToBoard),
    ...daoSource.map(mapDaoProposalToBoard),
  ];

  const filtered = merged.filter((proposal) => {
    if (query.cycle && !proposal.cycle.toLowerCase().includes(query.cycle.toLowerCase())) {
      return false;
    }
    if (query.keyword) {
      const keyword = query.keyword.toLowerCase();
      const haystack = `${proposal.id} ${proposal.title} ${proposal.summary} ${proposal.body}`.toLowerCase();
      if (!haystack.includes(keyword)) return false;
    }
    if (query.author && !proposal.author.toLowerCase().includes(query.author.toLowerCase())) {
      return false;
    }
    if (query.status && proposal.status !== query.status) {
      return false;
    }
    if (query.stage && proposal.stage !== query.stage) {
      return false;
    }
    return true;
  });

  filtered.sort((a, b) => {
    const aDate = new Date(a.createdAt).getTime();
    const bDate = new Date(b.createdAt).getTime();
    if (aDate !== bDate) return bDate - aDate;
    return extractProposalNumber(b.id) - extractProposalNumber(a.id);
  });

  const limit = query.limit && query.limit > 0 ? query.limit : 20;
  const page = query.page && query.page > 0 ? query.page : 1;
  const start = (page - 1) * limit;
  const paged = filtered.slice(start, start + limit);
  const hasMore = filtered.length > start + limit;

  return {
    proposals: paged,
    hasMore,
    total: filtered.length,
    nextProposalId: getNextProposalNumber(merged),
    proposalIdPrefix: "ZP-",
  };
}

export async function getGovernanceProposalByAnyIdUnified(
  identifier: string,
): Promise<GovernanceBoardProposal | null> {
  const dbProposal = await getDaoProposalByAnyId(identifier);
  if (dbProposal) return mapDaoProposalToBoard(dbProposal);

  const contentProposals = await getAllGovernanceProposals();
  const normalized = identifier.toLowerCase();
  const match = contentProposals.find((proposal) => {
    return proposal.id.toLowerCase() === normalized || proposal.slug.toLowerCase() === normalized;
  });
  return match ? mapContentProposalToBoard(match) : null;
}

export async function createGovernanceProposal(
  input: CreateGovernanceProposalInput,
): Promise<GovernanceBoardProposal> {
  const current = await queryGovernanceProposals({ includeDrafts: true, limit: 300, page: 1 });
  const nextNumber = current.nextProposalId;
  const proposalCode = formatProposalCode(nextNumber);
  const slug = normalizeSlug(input.slug || input.title);
  const cycle = input.cycleLabel?.trim() || `Ciclo ${new Date().getFullYear()}.${String(new Date().getMonth() + 1).padStart(2, "0")}`;
  const status = input.status ?? "discussion";

  const created = await createDaoProposal({
    proposalCode,
    slug,
    title: input.title,
    summary: input.summary,
    body: input.body,
    status,
    cycleLabel: cycle,
    governanceCycle: input.governanceCycle,
    authorName: input.authorName,
    authorWallet: input.authorWallet,
    quorumRequired: input.quorumRequired ?? 100,
    source: "app",
  });

  return mapDaoProposalToBoard(created);
}

export async function updateGovernanceProposalUnified(
  identifier: string,
  input: UpdateGovernanceProposalInput,
): Promise<GovernanceBoardProposal | null> {
  const updated = await updateDaoProposal(identifier, input as DaoProposalUpdateInput);
  if (!updated) return null;
  return mapDaoProposalToBoard(updated);
}

export async function patchGovernanceProposalStatusUnified(
  identifier: string,
  status: GovernanceDaoStatus,
): Promise<GovernanceBoardProposal | null> {
  const patched = await patchDaoProposalStatus(identifier, status as DaoProposalStatusValue);
  if (!patched) return null;
  return mapDaoProposalToBoard(patched);
}

export async function voteGovernanceProposal(
  identifier: string,
  choice: GovernanceVoteChoice,
): Promise<GovernanceBoardProposal | null> {
  const updated = await addDaoProposalVote(identifier, choice);
  if (!updated) return null;
  return mapDaoProposalToBoard(updated);
}

export async function deleteGovernanceProposalUnified(identifier: string): Promise<boolean> {
  return deleteDaoProposal(identifier);
}

function mapContentProposalToBoard(proposal: GovernanceProposal): GovernanceBoardProposal {
  const status = governanceStatusFromStage(proposal.stage);
  const createdAt = new Date(Date.UTC(2026, 0, proposal.sort_order)).toISOString();
  return {
    uid: `content:${proposal.id}`,
    id: proposal.id,
    slug: proposal.slug,
    title: proposal.title,
    summary: proposal.summary,
    body: proposal.content,
    stage: proposal.stage,
    status,
    cycle: proposal.cycle,
    governanceCycle: extractCycleNumber(proposal.cycle),
    author: proposal.author,
    quorumRequired: proposal.quorum_required,
    votes: {
      for: proposal.votes_for,
      against: proposal.votes_against,
      abstain: proposal.votes_abstain,
    },
    source: "content",
    editable: false,
    createdAt,
    updatedAt: createdAt,
  };
}

function mapDaoProposalToBoard(proposal: DaoProposalRecord): GovernanceBoardProposal {
  const status = proposal.status as GovernanceDaoStatus;
  return {
    uid: `app:${proposal.id}`,
    id: proposal.proposalCode,
    slug: proposal.slug,
    title: proposal.title,
    summary: proposal.summary,
    body: proposal.body,
    stage: governanceStageFromStatus(status),
    status,
    cycle: proposal.cycleLabel,
    governanceCycle: proposal.governanceCycle,
    author: proposal.authorName,
    authorWallet: proposal.authorWallet,
    quorumRequired: proposal.quorumRequired,
    votes: {
      for: proposal.votesFor,
      against: proposal.votesAgainst,
      abstain: proposal.votesAbstain,
    },
    source: proposal.source === "app" ? "app" : "content",
    editable: canEditGovernanceStatus(status),
    createdAt: proposal.createdAt.toISOString(),
    updatedAt: proposal.updatedAt.toISOString(),
  };
}

function getNextProposalNumber(proposals: GovernanceBoardProposal[]): number {
  const max = proposals.reduce((acc, proposal) => Math.max(acc, extractProposalNumber(proposal.id)), 0);
  return max + 1;
}

function extractProposalNumber(proposalId: string): number {
  const match = proposalId.match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

function formatProposalCode(number: number): string {
  return `ZP-${String(number).padStart(3, "0")}`;
}

function normalizeSlug(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function extractCycleNumber(cycleLabel: string): number | undefined {
  const match = cycleLabel.match(/(\d{4})\.(\d{2})/);
  if (!match) return undefined;
  const year = Number(match[1]);
  const month = Number(match[2]);
  return year * 100 + month;
}
