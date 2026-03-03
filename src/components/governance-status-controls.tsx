"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { type GovernanceDaoStatus } from "@/types/governance";

const statusFlow: GovernanceDaoStatus[] = [
  "draft",
  "discussion",
  "temperature_check",
  "voting",
  "approved",
  "queued",
  "executed",
  "cancelled",
  "archived",
];

export function GovernanceStatusControls({
  proposalId,
  currentStatus,
  editable,
}: {
  proposalId: string;
  currentStatus: GovernanceDaoStatus;
  editable: boolean;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!editable) return null;

  async function patchStatus(status: GovernanceDaoStatus) {
    if (status === currentStatus || isSubmitting) return;
    setError("");
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/governance/proposal/${proposalId}/status/${status}`, {
        method: "PATCH",
      });
      const payload = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Falha ao atualizar status.");
      }
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Falha ao atualizar status.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (isSubmitting) return;
    setError("");
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/governance/proposal/${proposalId}`, { method: "DELETE" });
      const payload = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Falha ao remover proposta.");
      }
      router.push("/zine-dao");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Falha ao remover proposta.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-lg border border-base-300 bg-base-50/70 p-3">
      <p className="font-mono text-[0.52rem] uppercase tracking-[0.14em] text-base-600">Status da proposta</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {statusFlow.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => void patchStatus(status)}
            className={`ui-pill ${currentStatus === status ? "is-active" : ""}`}
            disabled={isSubmitting}
          >
            {status.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="ui-btn ui-btn-danger mt-3"
        disabled={isSubmitting}
        onClick={() => void handleDelete()}
      >
        Remover proposta
      </button>

      {error && (
        <p className="mt-2 rounded-md border border-red-300 bg-red-50 px-2 py-1 text-[0.74rem] text-red-700">
          {error}
        </p>
      )}
    </section>
  );
}
