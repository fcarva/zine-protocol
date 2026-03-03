import { Suspense } from "react";
import { GovernanceProposalForm } from "@/components/governance-proposal-form";

export default function GovernanceComposePage() {
  return (
    <article className="space-y-4 font-sans">
      <header className="border-b border-base-300 pb-3">
        <p className="font-mono text-[0.54rem] uppercase tracking-[0.15em] text-base-600">
          Zine DAO / Propor
        </p>
        <h1 className="mt-1 text-[1.8rem] font-semibold uppercase tracking-[-0.04em] text-ink sm:text-[2.2rem]">
          Escrever proposta
        </h1>
        <p className="mt-1 max-w-[78ch] text-[0.86rem] leading-snug text-base-700">
          Fluxo inspirado no Nance: escrever, salvar rascunho, publicar em discussao e evoluir por
          etapas ate execucao.
        </p>
      </header>

      <Suspense
        fallback={
          <section className="editorial-panel rounded-xl p-3 text-[0.82rem] text-base-700 sm:p-4">
            Carregando editor de proposta...
          </section>
        }
      >
        <GovernanceProposalForm />
      </Suspense>
    </article>
  );
}
