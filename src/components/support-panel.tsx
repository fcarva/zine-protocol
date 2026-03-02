"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Coffee } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { type Address, erc20Abi, formatUnits } from "viem";
import {
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  usePublicClient,
  useWriteContract,
} from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { useCart } from "@/components/cart-provider";
import { getWeb3ConfigErrorMessage, publicEnv } from "@/lib/env";
import { formatCurrencyBRL } from "@/lib/format";
import { resolveRevnetTerminalAddress, revnetTerminalAbi } from "@/lib/revnet";
import { type Zine } from "@/types/zine";

type PixStatus = "pending" | "paid" | "expired" | "failed";

interface PixCheckoutResponse {
  chargeId: string;
  pixQrCode: string;
  pixCopyPaste: string;
  expiresAt: string;
}

interface CurrencyQuote {
  usdToBrl: number;
  usdToEth: number;
  source: "fallback" | "live";
}

const FALLBACK_QUOTE: CurrencyQuote = {
  usdToBrl: 5.2,
  usdToEth: 1 / 3000,
  source: "fallback",
};

function formatCurrencyUSD(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatEth(value: number): string {
  return `${value.toLocaleString("en-US", {
    minimumFractionDigits: value >= 1 ? 3 : 4,
    maximumFractionDigits: value >= 1 ? 4 : 6,
  })} ETH`;
}

function parsePositiveAmount(value: string): number {
  const normalized = value.replace(",", ".").trim();
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed <= 0) return 0;
  return parsed;
}

type PaymentCurrency = "usd" | "brl" | "eth";

const paymentCurrencyOptions: Array<{
  id: PaymentCurrency;
  label: string;
  symbol: string;
}> = [
  { id: "usd", label: "US$", symbol: "$" },
  { id: "brl", label: "R$", symbol: "R$" },
  { id: "eth", label: "ETH", symbol: "ETH" },
];

const quickAmountByCurrency: Record<PaymentCurrency, string[]> = {
  usd: ["5", "10", "25"],
  brl: ["20", "50", "100"],
  eth: ["0.003", "0.005", "0.01"],
};

function convertToUsd(amount: number, currency: PaymentCurrency, quote: CurrencyQuote): number {
  if (amount <= 0) return 0;
  if (currency === "usd") return amount;
  if (currency === "brl") return quote.usdToBrl > 0 ? amount / quote.usdToBrl : 0;
  return quote.usdToEth > 0 ? amount / quote.usdToEth : 0;
}

function formatByCurrency(amount: number, currency: PaymentCurrency): string {
  if (currency === "usd") return formatCurrencyUSD(amount);
  if (currency === "brl") return formatCurrencyBRL(amount);
  return formatEth(amount);
}

const primaryPaymentButtonClass =
  "ui-btn ui-btn-primary relative overflow-hidden !rounded-xl px-4 py-2.5 text-left text-ink";

function tabButtonClass(active: boolean): string {
  return active ? "ui-tab is-active" : "ui-tab";
}

export function SupportPanel({ zine }: { zine: Zine }) {
  const [tab, setTab] = useState<"web3" | "pix">("web3");
  const { addItem, itemCount } = useCart();

  return (
    <aside className="editorial-panel stagger-in space-y-3 rounded-xl p-3 font-sans">
      <div className="space-y-1.5">
        <p className="font-mono text-[0.56rem] uppercase tracking-[0.14em] text-base-600">Apoio</p>
        <h2 className="text-[1.15rem] font-semibold tracking-[-0.02em] text-ink">Apoiar este zine</h2>
        <p className="text-[0.82rem] leading-snug text-base-700">
          Leitura aberta para todos. O apoio sustenta artistas, devs, curadoria e tesouro da
          comunidade em continuidade com o Laboratório de Zines do Faísca Lab.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-1.5 rounded-lg border border-base-300 bg-base-100 p-1">
        <button
          className={tabButtonClass(tab === "web3")}
          onClick={() => setTab("web3")}
          type="button"
        >
          Carteira
        </button>
        <button
          className={tabButtonClass(tab === "pix")}
          onClick={() => setTab("pix")}
          type="button"
        >
          Pix sandbox
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() =>
            addItem({
              slug: zine.slug,
              title: zine.title,
              artistName: zine.artist_name,
              coverImage: zine.cover_image,
              revnetProjectId: zine.revnet_project_id,
              amountBRL: 25,
            })
          }
          className="ui-btn flex-1"
        >
          Adicionar ao carrinho
        </button>
        <Link
          href="/checkout"
          className="ui-btn"
        >
          Apoiar ({itemCount})
        </Link>
      </div>

      {tab === "web3" ? <Web3Support zine={zine} /> : <PixSupport zine={zine} />}

      <div className="rounded-lg border border-dashed border-base-300 bg-base-50/60 p-2.5 text-[0.68rem] leading-snug text-base-600">
        Publicação por convite. Quer publicar seu zine? Entre em contato com a curadoria.
      </div>
    </aside>
  );
}

function Web3Support({ zine }: { zine: Zine }) {
  const [amount, setAmount] = useState("10");
  const [paymentCurrency, setPaymentCurrency] = useState<PaymentCurrency>("usd");
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [quote, setQuote] = useState<CurrencyQuote>(FALLBACK_QUOTE);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();
  const web3ConfigError = getWeb3ConfigErrorMessage();

  const revnetLink = `${publicEnv.revnetAppUrl}/base:${zine.revnet_project_id}`;
  const enteredAmount = useMemo(() => parsePositiveAmount(amount), [amount]);
  const amountUsd = useMemo(
    () => convertToUsd(enteredAmount, paymentCurrency, quote),
    [enteredAmount, paymentCurrency, quote],
  );
  const amountBrl = amountUsd * quote.usdToBrl;
  const amountEth = amountUsd * quote.usdToEth;
  const quickAmounts = quickAmountByCurrency[paymentCurrency];

  const amountUsdc6 = useMemo(() => {
    if (amountUsd <= 0) return BigInt(0);
    return BigInt(Math.round(amountUsd * 1_000_000));
  }, [amountUsd]);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function loadQuote() {
      setIsLoadingQuote(true);
      try {
        const response = await fetch("https://api.coinbase.com/v2/exchange-rates?currency=USD", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) return;
        const payload = (await response.json()) as {
          data?: { rates?: Record<string, string> };
        };
        const brlRate = Number(payload.data?.rates?.BRL);
        const ethRate = Number(payload.data?.rates?.ETH);
        if (!Number.isFinite(brlRate) || !Number.isFinite(ethRate)) return;
        if (brlRate <= 0 || ethRate <= 0) return;
        if (!mounted) return;
        setQuote({
          usdToBrl: brlRate,
          usdToEth: ethRate,
          source: "live",
        });
      } catch {
        // Mantem fallback para evitar bloqueio no fluxo de apoio.
      } finally {
        if (mounted) setIsLoadingQuote(false);
      }
    }

    loadQuote();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  const canTransact =
    isConnected &&
    !web3ConfigError &&
    amountUsdc6 > BigInt(0) &&
    chainId === baseSepolia.id &&
    !isProcessing;

  async function handleSupportWeb3() {
    if (!address || !publicClient || isProcessing) return;
    if (web3ConfigError) {
      setError(web3ConfigError);
      return;
    }

    setError("");
    setIsProcessing(true);

    try {
      const resolvedTerminalAddress = await resolveRevnetTerminalAddress({
        publicClient,
        projectId: zine.revnet_project_id,
        tokenAddress: publicEnv.usdcAddress as Address,
        fallbackTerminalAddress: publicEnv.revnetTerminalAddress as Address,
      });

      if (!resolvedTerminalAddress) {
        throw new Error("Projeto Revnet sem terminal ativo para USDC em Base Sepolia.");
      }

      setStatus("Aprovando USDC...");
      const approveHash = await writeContractAsync({
        address: publicEnv.usdcAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: "approve",
        args: [resolvedTerminalAddress, amountUsdc6],
        chainId: baseSepolia.id,
      });

      await publicClient.waitForTransactionReceipt({ hash: approveHash });

      setStatus("Enviando apoio para Revnet...");
      const payHash = await writeContractAsync({
        address: resolvedTerminalAddress,
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
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="space-y-3">
      <p className="font-mono text-[0.66rem] uppercase tracking-[0.15em] text-base-600">
        Projeto Revnet: <span className="font-semibold">#{zine.revnet_project_id}</span>
      </p>

      {!isConnected ? (
        <div className="space-y-2">
          <p className="text-sm text-base-700">Conecte uma carteira para apoiar onchain.</p>
          {web3ConfigError && (
            <p className="rounded-lg border border-red-300 bg-red-50 px-2 py-1 text-xs text-red-700">
              {web3ConfigError}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                className="ui-btn"
                disabled={isConnecting}
                onClick={() => connect({ connector })}
                type="button"
              >
                {connector.name}
              </button>
            ))}
          </div>
          <p className="text-xs text-base-500">
            Para por email pode ser conectado aqui via provedor compatível em fase seguinte.
          </p>
        </div>
      ) : (
        <>
          {web3ConfigError && (
            <p className="rounded-lg border border-red-300 bg-red-50 px-2 py-1 text-xs text-red-700">
              {web3ConfigError}
            </p>
          )}
          <div className="rounded-lg border border-base-300 bg-base-50 px-3 py-2 text-xs text-base-700">
            Carteira conectada: {address}
          </div>

          <label className="block font-mono text-[0.66rem] uppercase tracking-[0.16em] text-base-700" htmlFor="amount-usdc">
            Escolha a moeda
          </label>
          <div className="grid grid-cols-3 gap-1 rounded-lg border border-base-300 bg-base-100 p-1">
            {paymentCurrencyOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setPaymentCurrency(option.id)}
                className={tabButtonClass(paymentCurrency === option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <label className="block font-mono text-[0.66rem] uppercase tracking-[0.16em] text-base-700" htmlFor="amount-usdc">
            Valor de apoio ({paymentCurrency.toUpperCase()})
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-base-300 bg-paper px-3 py-2">
            <span className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-base-600">
              {paymentCurrencyOptions.find((option) => option.id === paymentCurrency)?.symbol}
            </span>
            <input
              id="amount-usdc"
              inputMode="decimal"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="ui-input w-full border-0 bg-transparent p-0 text-[0.98rem] font-semibold text-ink"
            />
          </div>

          <div className="flex flex-wrap gap-1">
            {quickAmounts.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setAmount(value)}
                className={`ui-pill ${amount.trim() === value ? "is-active" : ""}`}
              >
                {formatByCurrency(Number(value), paymentCurrency)}
              </button>
            ))}
          </div>

          <div className="space-y-1 rounded-lg border border-base-300 bg-base-50 px-2.5 py-2">
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-0.5">
                <p className="font-mono text-[0.5rem] uppercase tracking-[0.12em] text-base-500">US$</p>
                <p className="text-[0.78rem] font-semibold text-base-900">
                  {amountUsd > 0 ? formatCurrencyUSD(amountUsd) : "-"}
                </p>
              </div>
              <div className="space-y-0.5">
                <p className="font-mono text-[0.5rem] uppercase tracking-[0.12em] text-base-500">R$</p>
                <p className="text-[0.78rem] font-semibold text-base-900">
                  {amountUsd > 0 ? formatCurrencyBRL(amountBrl) : "-"}
                </p>
              </div>
              <div className="space-y-0.5">
                <p className="font-mono text-[0.5rem] uppercase tracking-[0.12em] text-base-500">ETH</p>
                <p className="text-[0.78rem] font-semibold text-base-900">
                  {amountUsd > 0 ? formatEth(amountEth) : "-"}
                </p>
              </div>
            </div>
            <p className="font-mono text-[0.5rem] uppercase tracking-[0.13em] text-base-500">
              {isLoadingQuote
                ? "Atualizando cotação..."
                : quote.source === "live"
                  ? "Cotação pública em tempo real"
                  : "Cotação estimada (fallback)"}
            </p>
          </div>

          {chainId !== baseSepolia.id && (
            <p className="text-sm text-red-700">Troque para Base Sepolia para continuar.</p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSupportWeb3}
              disabled={!canTransact}
              className={`flex-1 ${primaryPaymentButtonClass}`}
            >
              <span className="flex items-center gap-1.5 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-yellow-900">
                <Coffee size={13} strokeWidth={2.1} />
                {isProcessing ? "Processando apoio..." : "Apoiar este zine"}
              </span>
              <span className="mt-0.5 block text-[0.75rem] font-semibold text-base-950">
                {amountUsd > 0
                  ? `${formatByCurrency(enteredAmount, paymentCurrency)} | ${formatCurrencyUSD(amountUsd)} | ${formatCurrencyBRL(amountBrl)} | ${formatEth(amountEth)}`
                  : "Defina um valor para apoiar"}
              </span>
              <span className="mt-0.5 block font-mono text-[0.5rem] uppercase tracking-[0.14em] text-base-700">
                Checkout onchain em Base Sepolia
              </span>
            </button>
            <button
              type="button"
              onClick={() => disconnect()}
              className="ui-btn"
            >
              Sair
            </button>
          </div>
        </>
      )}

      <a
        className="ui-link !text-blue-700 hover:!text-blue-800"
        href={revnetLink}
        rel="noreferrer"
        target="_blank"
      >
        Abrir projeto no Revnet
      </a>

      {status && <p className="text-sm text-green-700">{status}</p>}
      {txHash && (
        <p className="break-all text-xs text-base-600">
          Tx: {txHash} ({formatUnits(amountUsdc6, 6)} USDC enviado onchain)
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
  const [isCreatingCharge, setIsCreatingCharge] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

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
    setCopyState("idle");

    const amountNumber = Number(amount);
    if (!email || !Number.isFinite(amountNumber) || amountNumber <= 0) {
      setError("Informe email válido e valor acima de zero.");
      return;
    }

    setIsCreatingCharge(true);
    try {
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
        setError(payload.error || "Falha ao gerar cobrança Pix.");
        return;
      }

      const payload = (await response.json()) as PixCheckoutResponse;
      setCharge(payload);
    } finally {
      setIsCreatingCharge(false);
    }
  }

  async function handleCopyPixCode() {
    if (!charge) return;
    try {
      await navigator.clipboard.writeText(charge.pixCopyPaste);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  }

  return (
    <div className="space-y-3">
      <label className="block font-mono text-[0.66rem] uppercase tracking-[0.16em] text-base-700" htmlFor="pix-email">
        Email para comprovante
      </label>
      <input
        id="pix-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="ui-input px-3 py-2 text-ink"
      />

      <label className="block font-mono text-[0.66rem] uppercase tracking-[0.16em] text-base-700" htmlFor="pix-amount">
        Valor em BRL
      </label>
      <input
        id="pix-amount"
        inputMode="decimal"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        className="ui-input px-3 py-2 text-ink"
      />

      <button
        type="button"
        onClick={handleCreateCharge}
        disabled={isCreatingCharge}
        className={`w-full ${primaryPaymentButtonClass}`}
      >
        <span className="flex items-center justify-center gap-1.5 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-yellow-900">
          <Coffee size={14} strokeWidth={2.1} />
          {isCreatingCharge
            ? "Gerando Pix..."
            : `Pagar com Pix sandbox (${formatCurrencyBRL(Number(amount) || 0)})`}
        </span>
      </button>

      {charge && (
        <div className="space-y-2 rounded-lg border border-base-300 bg-base-50 p-3">
          <p className="text-sm text-base-700">Escaneie o QR ou copie o código Pix:</p>

          <div className="mx-auto w-fit rounded-lg bg-paper p-2">
            <QRCodeSVG value={charge.pixQrCode} size={172} includeMargin />
          </div>

          <p className="break-all rounded-md border border-base-300 bg-paper p-2 text-xs text-base-700">
            {charge.pixCopyPaste}
          </p>

          <button type="button" className="ui-btn w-full" onClick={handleCopyPixCode}>
            {copyState === "copied"
              ? "Código Pix copiado"
              : copyState === "error"
                ? "Falha ao copiar"
                : "Copiar código Pix"}
          </button>

          <p className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-base-600">
            ChargeId: {charge.chargeId}
          </p>

          <p className="text-sm">
            Status: <span className="font-semibold">{status}</span>
          </p>
        </div>
      )}

      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  );
}

