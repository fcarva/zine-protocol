export const GOVERNANCE_STAGE_VALUES = [
  "discussion",
  "temperature_check",
  "vote",
  "queued",
  "executed",
] as const;

export type GovernanceProposalStage = (typeof GOVERNANCE_STAGE_VALUES)[number];

export type GovernanceProposalStatus = "draft" | "published";

export const GOVERNANCE_DAO_STATUS_VALUES = [
  "draft",
  "discussion",
  "temperature_check",
  "voting",
  "approved",
  "cancelled",
  "queued",
  "executed",
  "archived",
] as const;

export type GovernanceDaoStatus = (typeof GOVERNANCE_DAO_STATUS_VALUES)[number];

export interface GovernanceProposalFrontmatter {
  id: string;
  slug: string;
  title: string;
  summary: string;
  stage: GovernanceProposalStage;
  cycle: string;
  author: string;
  quorum_required: number;
  votes_for: number;
  votes_against: number;
  votes_abstain: number;
  status: GovernanceProposalStatus;
  sort_order: number;
}

export interface GovernanceProposal extends GovernanceProposalFrontmatter {
  content: string;
  path: string;
}

export interface GovernanceBoardProposal {
  uid: string;
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  stage: GovernanceProposalStage;
  status: GovernanceDaoStatus;
  cycle: string;
  governanceCycle?: number;
  author: string;
  authorWallet?: string;
  quorumRequired: number;
  votes: {
    for: number;
    against: number;
    abstain: number;
  };
  source: "content" | "app";
  editable: boolean;
  createdAt: string;
  updatedAt: string;
}
