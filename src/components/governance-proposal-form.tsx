"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { type GovernanceBoardProposal } from "@/types/governance";

interface ProposalFormState {
  title: string;
  summary: string;
  body: string;
  cycleLabel: string;
  governanceCycle: string;
  authorName: string;
  authorWallet: string;
  quorumRequired: string;
}

const defaultState: ProposalFormState = {
  title: "",
  summary: "",
  body: "## Objetivo\n\nDescreva a proposta.\n\n## Impacto\n\nComo isso fortalece a rede de zines.\n",
  cycleLabel: "",
  governanceCycle: "",
  authorName: "",
  authorWallet: "",
  quorumRequired: "100",
};

export function GovernanceProposalForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const proposalId = searchParams.get("id");
  const [form, setForm] = useState<ProposalFormState>(defaultState);
  const [loadedProposal, setLoadedProposal] = useState<GovernanceBoardProposal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isEditMode = Boolean(proposalId && loadedProposal);

  useEffect(() => {
    if (!proposalId) return;
    let isMounted = true;
    setIsLoading(true);
    setError("");

    fetch(`/api/governance/proposal/${proposalId}`)
      .then(async (response) => {
        const payload = (await response.json()) as {
          ok: boolean;
          data?: GovernanceBoardProposal;
          error?: string;
        };
        if (!response.ok || !payload.ok || !payload.data) {
          throw new Error(payload.error || "Nao foi possivel carregar a proposta.");
        }
        if (!isMounted) return;
        setLoadedProposal(payload.data);
        setForm({
          title: payload.data.title,
          summary: payload.data.summary,
          body: payload.data.body,
          cycleLabel: payload.data.cycle,
          governanceCycle: payload.data.governanceCycle ? String(payload.data.governanceCycle) : "",
          authorName: payload.data.author,
          authorWallet: payload.data.authorWallet || "",
          quorumRequired: String(payload.data.quorumRequired),
        });
      })
      .catch((loadError) => {
        if (!isMounted) return;
        setError(loadError instanceof Error ? loadError.message : "Falha ao carregar.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [proposalId]);

  const canSubmit = useMemo(() => {
    return (
      form.title.trim().length >= 8 &&
      form.summary.trim().length >= 20 &&
      form.body.trim().length >= 40 &&
      form.authorName.trim().length >= 3
    );
  }, [form]);

  async function handleSubmit(mode: "draft" | "discussion") {
    if (!canSubmit || isSubmitting) return;
    setError("");
    setIsSubmitting(true);

    try {
      const payload = {
        title: form.title.trim(),
        summary: form.summary.trim(),
        body: form.body.trim(),
        cycleLabel: form.cycleLabel.trim() || undefined,
        governanceCycle: form.governanceCycle.trim() ? Number(form.governanceCycle.trim()) : undefined,
        authorName: form.authorName.trim(),
        authorWallet: form.authorWallet.trim() || undefined,
        quorumRequired: form.quorumRequired.trim() ? Number(form.quorumRequired.trim()) : undefined,
        status: mode,
      };

      if (isEditMode && proposalId) {
        const response = await fetch(`/api/governance/proposal/${proposalId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await response.json()) as {
          ok: boolean;
          data?: GovernanceBoardProposal;
          error?: string;
        };
        if (!response.ok || !data.ok || !data.data) {
          throw new Error(data.error || "Falha ao atualizar proposta.");
        }

        if (mode === "discussion") {
          await fetch(`/api/governance/proposal/${data.data.id}/status/discussion`, { method: "PATCH" });
        }

        router.push(`/zine-dao/${data.data.id}`);
        router.refresh();
        return;
      }

      const response = await fetch("/api/governance/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as {
        ok: boolean;
        data?: GovernanceBoardProposal;
        error?: string;
      };
      if (!response.ok || !data.ok || !data.data) {
        throw new Error(data.error || "Falha ao criar proposta.");
      }

      router.push(`/zine-dao/${data.data.id}`);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Falha ao salvar proposta.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="editorial-panel rounded-xl p-3 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-base-300 pb-2">
        <div>
          <p className="font-mono text-[0.54rem] uppercase tracking-[0.15em] text-base-600">
            Editor de proposta
          </p>
          <h2 className="mt-1 text-[1.1rem] font-semibold uppercase tracking-[-0.02em] text-ink sm:text-[1.25rem]">
            {isEditMode ? "Editar proposta" : "Nova proposta"}
          </h2>
        </div>
        <Link href="/zine-dao" className="ui-btn">
          Voltar para governanca
        </Link>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Field label="Titulo">
          <input
            className="ui-input px-3 py-2 text-[0.9rem]"
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="Titulo da proposta"
          />
        </Field>
        <Field label="Autoria">
          <input
            className="ui-input px-3 py-2 text-[0.9rem]"
            value={form.authorName}
            onChange={(event) => setForm((current) => ({ ...current, authorName: event.target.value }))}
            placeholder="Nome da pessoa ou coletivo"
          />
        </Field>
        <Field label="Resumo">
          <textarea
            className="ui-input min-h-[110px] px-3 py-2 text-[0.9rem] sm:col-span-2"
            value={form.summary}
            onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))}
            placeholder="Resumo executivo da proposta"
          />
        </Field>
        <Field label="Ciclo">
          <input
            className="ui-input px-3 py-2 text-[0.9rem]"
            value={form.cycleLabel}
            onChange={(event) => setForm((current) => ({ ...current, cycleLabel: event.target.value }))}
            placeholder="Ciclo 2026.03 / Janela de voto"
          />
        </Field>
        <Field label="Quorum alvo">
          <input
            className="ui-input px-3 py-2 text-[0.9rem]"
            value={form.quorumRequired}
            onChange={(event) => setForm((current) => ({ ...current, quorumRequired: event.target.value }))}
            inputMode="numeric"
            placeholder="100"
          />
        </Field>
      </div>

      <Field label="Corpo da proposta">
        <textarea
          className="ui-input mt-1 min-h-[260px] px-3 py-2 font-mono text-[0.8rem] leading-snug"
          value={form.body}
          onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))}
          placeholder="Escreva em Markdown"
        />
      </Field>

      <div className="mt-3 border-t border-base-300 pt-3">
        <p className="font-mono text-[0.54rem] uppercase tracking-[0.14em] text-base-600">Preview</p>
        <div className="mt-2 rounded-lg border border-base-300 bg-base-50/70 p-3">
          <h3 className="text-[1rem] font-semibold text-ink">{form.title || "Sem titulo"}</h3>
          <p className="mt-1 text-[0.82rem] leading-snug text-base-700">{form.summary || "Sem resumo."}</p>
          <div className="mt-2 border-t border-base-300 pt-2">
            <MarkdownRenderer content={form.body} />
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-[0.78rem] text-red-700">
          {error}
        </p>
      )}

      <div className="mt-3 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          className="ui-btn"
          onClick={() => void handleSubmit("draft")}
          disabled={!canSubmit || isSubmitting || isLoading}
        >
          {isSubmitting ? "Salvando..." : "Salvar rascunho"}
        </button>
        <button
          type="button"
          className="ui-btn ui-btn-primary"
          onClick={() => void handleSubmit("discussion")}
          disabled={!canSubmit || isSubmitting || isLoading}
        >
          {isSubmitting ? "Publicando..." : "Publicar proposta"}
        </button>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="font-mono text-[0.54rem] uppercase tracking-[0.13em] text-base-600">{label}</span>
      {children}
    </label>
  );
}
