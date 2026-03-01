"use client";

import { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { erc20Abi, formatUnits, parseUnits } from "viem";
import {
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  usePublicClient,
  useWriteContract,
} from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { publicEnv } from "@/lib/env";
import { formatCurrencyBRL } from "@/lib/format";
import { revnetTerminalAbi } from "@/lib/revnet";
import { type Zine } from "@/types/zine";

type PixStatus = "pending" | "paid" | "expired" | "failed";

interface PixCheckoutResponse {
  chargeId: string;
  pixQrCode: string;
  pixCopyPaste: string;
  expiresAt: string;
}

export function SupportPanel({ zine }: { zine: Zine }) {
  const [tab, setTab] = useState<"web3" | "pix">("web3");

  return (
    <aside className="space-y-4 rounded-2xl border border-stone-300 bg-white p-4 shadow-sm">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Apoio</p>
        <h2 className="text-2xl font-semibold text-stone-900">Apoiar este zine</h2>
        <p className="text-sm text-stone-700">
          Leitura aberta para todos. O apoio sustenta artistas, devs, curadoria e tesouro da
          comunidade.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-xl bg-stone-100 p-1">
        <button
          className={`rounded-lg px-3 py-2 text-sm transition ${
            tab === "web3" ? "bg-white text-stone-900 shadow" : "text-stone-600"
          }`}
          onClick={() => setTab("web3")}
          type="button"
        >
          Carteira
        </button>
        <button
          className={`rounded-lg px-3 py-2 text-sm transition ${
            tab === "pix" ? "bg-white text-stone-900 shadow" : "text-stone-600"
          }`}
          onClick={() => setTab("pix")}
          type="button"
        >
          Pix sandbox
        </button>
      </div>

      {tab === "web3" ? <Web3Support zine={zine} /> : <PixSupport zine={zine} />}

      <div className="rounded-xl border border-dashed border-stone-300 p-3 text-xs text-stone-600">
        Publicacao por convite. Quer publicar seu zine? Entre em contato com a curadoria.
      </div>
    </aside>
  );
}

function Web3Support({ zine }: { zine: Zine }) {
  const [amount, setAmount] = useState("10");
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  const revnetLink = `${publicEnv.revnetAppUrl}/base:${zine.revnet_project_id}`;

  const amountUsdc6 = useMemo(() => {
    try {
      return parseUnits(amount || "0", 6);
    } catch {
      return BigInt(0);
    }
  }, [amount]);

  const canTransact =
    isConnected &&
    !!publicEnv.usdcAddress &&
    !!publicEnv.revnetTerminalAddress &&
    amountUsdc6 > BigInt(0) &&
    chainId === baseSepolia.id;

  async function handleSupportWeb3() {
    if (!address || !publicClient) return;

    setError("");
    setStatus("Aprovando USDC...");

    try {
      const approveHash = await writeContractAsync({
        address: publicEnv.usdcAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: "approve",
        args: [publicEnv.revnetTerminalAddress as `0x${string}`, amountUsdc6],
        chainId: baseSepolia.id,
      });

      await publicClient.waitForTransactionReceipt({ hash: approveHash });

      setStatus("Enviando apoio para Revnet...");
      const payHash = await writeContractAsync({
        address: publicEnv.revnetTerminalAddress as `0x${string}`,
        abi: revnetTerminalAbi,
        functionName: "pay",
        args: [
          BigInt(zine.revnet_project_id),
          publicEnv.usdcAddress as `0x${string}`,
          amountUsdc6,
          address,
          BigInt(0),
          `Apoio ao zine ${zine.slug}`,
          "0x",
        ],
        chainId: baseSepolia.id,
      });

      await publicClient.waitForTransactionReceipt({ hash: payHash });
      setTxHash(payHash);
      setStatus("Apoio confirmado em Base Sepolia.");

      await fetch("/api/support/web3/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zineSlug: zine.slug,
          txHash: payHash,
          payerWallet: address,
          amountUsdc6: amountUsdc6.toString(),
          chainId: baseSepolia.id,
          revnetProjectId: zine.revnet_project_id,
        }),
      });
    } catch (rawError) {
      const message = rawError instanceof Error ? rawError.message : "Erro ao apoiar via carteira.";
      setError(message);
      setStatus("");
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-stone-600">
        Projeto Revnet: <span className="font-semibold">#{zine.revnet_project_id}</span>
      </p>

      {!isConnected ? (
        <div className="space-y-2">
          <p className="text-sm text-stone-700">Conecte uma carteira para apoiar onchain.</p>
          <div className="flex flex-wrap gap-2">
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                className="rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-800"
                disabled={isConnecting}
                onClick={() => connect({ connector })}
                type="button"
              >
                {connector.name}
              </button>
            ))}
          </div>
          <p className="text-xs text-stone-500">
            Para por email pode ser conectado aqui via provedor compatível em fase seguinte.
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-700">
            Carteira conectada: {address}
          </div>

          <label className="block text-sm text-stone-700" htmlFor="amount-usdc">
            Valor de apoio (USDC)
          </label>
          <input
            id="amount-usdc"
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:border-stone-500 focus:outline-none"
          />

          {chainId !== baseSepolia.id && (
            <p className="text-sm text-red-700">Troque para Base Sepolia para continuar.</p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSupportWeb3}
              disabled={!canTransact}
              className="flex-1 rounded-lg bg-stone-900 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:bg-stone-400"
            >
              Apoiar este zine
            </button>
            <button
              type="button"
              onClick={() => disconnect()}
              className="rounded-lg border border-stone-300 px-4 py-2 text-sm text-stone-700"
            >
              Sair
            </button>
          </div>
        </>
      )}

      <a
        className="inline-flex text-xs font-medium text-sky-700 hover:text-sky-800"
        href={revnetLink}
        rel="noreferrer"
        target="_blank"
      >
        Abrir projeto no Revnet
      </a>

      {status && <p className="text-sm text-emerald-700">{status}</p>}
      {txHash && (
        <p className="break-all text-xs text-stone-600">
          Tx: {txHash} ({formatUnits(amountUsdc6, 6)} USDC)
        </p>
      )}
      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  );
}

function PixSupport({ zine }: { zine: Zine }) {
  const [amount, setAmount] = useState("25");
  const [email, setEmail] = useState("");
  const [charge, setCharge] = useState<PixCheckoutResponse | null>(null);
  const [status, setStatus] = useState<PixStatus>("pending");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!charge || status !== "pending") return;

    const timer = setInterval(async () => {
      const response = await fetch(`/api/pix/status/${charge.chargeId}`);
      if (!response.ok) return;
      const payload = (await response.json()) as { status: PixStatus };
      if (payload.status !== "pending") {
        setStatus(payload.status);
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [charge, status]);

  async function handleCreateCharge() {
    setError("");
    setCharge(null);
    setStatus("pending");

    const amountNumber = Number(amount);
    if (!email || !Number.isFinite(amountNumber) || amountNumber <= 0) {
      setError("Informe email valido e valor acima de zero.");
      return;
    }

    const response = await fetch("/api/pix/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        zineSlug: zine.slug,
        amountBRL: amountNumber,
        payerEmail: email,
      }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      setError(payload.error || "Falha ao gerar cobranca Pix.");
      return;
    }

    const payload = (await response.json()) as PixCheckoutResponse;
    setCharge(payload);
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm text-stone-700" htmlFor="pix-email">
        Email para comprovante
      </label>
      <input
        id="pix-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:border-stone-500 focus:outline-none"
      />

      <label className="block text-sm text-stone-700" htmlFor="pix-amount">
        Valor em BRL
      </label>
      <input
        id="pix-amount"
        inputMode="decimal"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:border-stone-500 focus:outline-none"
      />

      <button
        type="button"
        onClick={handleCreateCharge}
        className="w-full rounded-lg bg-stone-900 px-4 py-2 text-sm text-white"
      >
        Gerar Pix sandbox ({formatCurrencyBRL(Number(amount) || 0)})
      </button>

      {charge && (
        <div className="space-y-2 rounded-lg border border-stone-300 bg-stone-50 p-3">
          <p className="text-sm text-stone-700">Escaneie o QR ou copie o codigo Pix:</p>

          <div className="mx-auto w-fit rounded-lg bg-white p-2">
            <QRCodeSVG value={charge.pixQrCode} size={172} includeMargin />
          </div>

          <p className="break-all rounded-md border border-stone-300 bg-white p-2 text-xs text-stone-700">
            {charge.pixCopyPaste}
          </p>

          <p className="text-xs text-stone-600">ChargeId: {charge.chargeId}</p>

          <p className="text-sm">
            Status: <span className="font-semibold">{status}</span>
          </p>
        </div>
      )}

      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  );
}

