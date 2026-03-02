"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Coffee, Wallet } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { type Address, erc20Abi, formatUnits } from "viem";
import {
  useAccount,
  useChainId,
  useConnect,
  usePublicClient,
  useWriteContract,
} from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { useCart } from "@/components/cart-provider";
import { getWeb3ConfigErrorMessage, publicEnv } from "@/lib/env";
import { formatCurrencyBRL } from "@/lib/format";
import { resolveRevnetTerminalAddress, revnetTerminalAbi } from "@/lib/revnet";
import { logSupportIntent } from "@/lib/support-intent";
import { type Zine } from "@/types/zine";

type PixStatus = "pending" | "paid" | "expired" | "failed";

type SupportTab = "web3" | "pix";

type PaymentCurrency = "usd" | "brl" | "eth";

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

const primaryPaymentButtonClass =
  "wallet-cta ui-btn relative w-full !rounded-xl px-4 py-3 text-left text-ink";

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

function tabButtonClass(active: boolean): string {
  return active ? "ui-tab is-active" : "ui-tab";
}

function statusColorClass(status: PixStatus): string {
  if (status === "paid") return "text-green-700";
  if (status === "failed" || status === "expired") return "text-red-700";
  return "text-base-700";
}

export function SupportPanel({ zine }: { zine: Zine }) {
  const [tab, setTab] = useState<SupportTab>("web3");
  const { itemCount } = useCart();

  return (
    <aside className="editorial-panel stagger-in space-y-3 rounded-xl p-3 font-sans sm:p-3.5">
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="ui-pill is-active">Apoio direto</span>
          <span className="ui-pill">Revnet #{zine.revnet_project_id}</span>
        </div>
        <h2 className="text-[1.08rem] font-semibold tracking-[-0.02em] text-ink">Apoiar este zine</h2>
        <p className="text-[0.8rem] leading-snug text-base-700">
          Leitura aberta para todo mundo. Seu apoio mantem producao, edicao e circulacao dos zines.
        </p>
      </div>

      <div className="wallet-surface grid grid-cols-2 gap-1 rounded-lg border border-base-300 p-1">
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
          Pix
        </button>
      </div>

      {tab === "web3" ? <Web3Support zine={zine} /> : <PixSupport zine={zine} />}

      <div className="border-t border-base-300 pt-2">
        <Link href="/checkout" className="ui-link">
          Apoiar no checkout ({itemCount})
        </Link>
      </div>

      <p className="rounded-lg border border-dashed border-base-300 bg-base-50/80 px-2.5 py-2 text-[0.68rem] leading-snug text-base-600">
        Publicacao por convite. Candidaturas abertas para novos zines da comunidade.
      </p>
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
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();
  const web3ConfigError = getWeb3ConfigErrorMessage();

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
    if (!isConnected) return;

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
        // Mantem fallback para nao bloquear o apoio.
      } finally {
        if (mounted) setIsLoadingQuote(false);
      }
    }

    loadQuote();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [isConnected]);

  const canTransact =
    isConnected &&
    !web3ConfigError &&
    amountUsdc6 > BigInt(0) &&
    chainId === baseSepolia.id &&
    !isProcessing;

  async function handleSupportWeb3() {
    void logSupportIntent({
      zineSlug: zine.slug,
      method: "wallet",
      surface: "support_panel",
      amountInput: amount.trim(),
      currencyInput: paymentCurrency,
      chainId,
      walletConnected: isConnected,
    });

    if (!address || !publicClient || isProcessing) return;
    if (web3ConfigError) {
      setError(web3ConfigError);
      return;
    }

    setError("");
    setStatus("");
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

      setStatus("Enviando apoio...");
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
    <div className="space-y-2.5">
      {!isConnected ? (
        <div className="space-y-2.5">
          <div className="wallet-surface-muted rounded-lg border border-base-300 p-2.5">
            <p className="flex items-center gap-1.5 text-[0.76rem] text-base-700">
              <Wallet size={14} />
              Conecte uma carteira para apoiar onchain.
            </p>
            <p className="mt-1 font-mono text-[0.53rem] uppercase tracking-[0.12em] text-base-500">
              Rede alvo: Base Sepolia
            </p>
          </div>

          {web3ConfigError && (
            <p className="rounded-lg border border-red-300 bg-red-50 px-2 py-1.5 text-xs text-red-700">
              {web3ConfigError}
            </p>
          )}

          <div className="grid grid-cols-2 gap-1.5">
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                className="ui-btn !rounded-lg"
                disabled={isConnecting}
                onClick={() => connect({ connector })}
                type="button"
              >
                {connector.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {web3ConfigError && (
            <p className="rounded-lg border border-red-300 bg-red-50 px-2 py-1.5 text-xs text-red-700">
              {web3ConfigError}
            </p>
          )}

          <div className="wallet-surface-muted rounded-lg border border-base-300 p-2">
            <p className="font-mono text-[0.5rem] uppercase tracking-[0.12em] text-base-500">Carteira conectada</p>
            <p className="mt-1 break-all text-[0.72rem] text-base-700">{address}</p>
          </div>

          <div className="space-y-1.5">
            <label
              className="font-mono text-[0.56rem] uppercase tracking-[0.14em] text-base-600"
              htmlFor="support-currency"
            >
              Moeda de entrada
            </label>
            <div className="wallet-surface grid grid-cols-3 gap-1 rounded-lg border border-base-300 p-1">
              {paymentCurrencyOptions.map((option) => (
                <button
                  key={option.id}
                  id={option.id === paymentCurrency ? "support-currency" : undefined}
                  type="button"
                  onClick={() => setPaymentCurrency(option.id)}
                  className={tabButtonClass(paymentCurrency === option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="wallet-surface rounded-lg border border-base-300 p-2.5">
            <label
              className="font-mono text-[0.56rem] uppercase tracking-[0.14em] text-base-600"
              htmlFor="amount-usdc"
            >
              Valor de apoio
            </label>
            <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-base-300 bg-paper px-3 py-2">
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-base-600">
                {paymentCurrencyOptions.find((option) => option.id === paymentCurrency)?.symbol}
              </span>
              <input
                id="amount-usdc"
                inputMode="decimal"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="ui-input w-full border-0 bg-transparent p-0 text-[1rem] font-semibold text-ink"
              />
            </div>

            <div className="mt-2 flex flex-wrap gap-1">
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
          </div>

          <div className="wallet-surface-muted rounded-lg border border-base-300 p-2.5">
            <div className="grid grid-cols-3 gap-2">
              <CurrencyMetric label="US$" value={amountUsd > 0 ? formatCurrencyUSD(amountUsd) : "-"} />
              <CurrencyMetric label="R$" value={amountUsd > 0 ? formatCurrencyBRL(amountBrl) : "-"} />
              <CurrencyMetric label="ETH" value={amountUsd > 0 ? formatEth(amountEth) : "-"} />
            </div>
            <p className="mt-1.5 font-mono text-[0.5rem] uppercase tracking-[0.12em] text-base-500">
              {isLoadingQuote
                ? "Atualizando cotacao..."
                : quote.source === "live"
                  ? "Cotacao publica em tempo real"
                  : "Cotacao estimada"}
            </p>
          </div>

          {chainId !== baseSepolia.id && (
            <p className="rounded-lg border border-red-300 bg-red-50 px-2 py-1.5 text-sm text-red-700">
              Troque para Base Sepolia para continuar.
            </p>
          )}

          <button
            type="button"
            onClick={handleSupportWeb3}
            disabled={!canTransact}
            className={primaryPaymentButtonClass}
          >
            <span className="flex items-center gap-1.5 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-base-900">
              <Coffee size={13} strokeWidth={2.1} />
              {isProcessing ? "Processando apoio..." : "Apoiar este zine"}
            </span>
            <span className="mt-1 block text-[0.75rem] font-semibold text-base-900">
              {amountUsd > 0 ? `${formatCurrencyUSD(amountUsd)} | ${formatCurrencyBRL(amountBrl)}` : "Defina um valor"}
            </span>
            <span className="mt-0.5 block font-mono text-[0.5rem] uppercase tracking-[0.13em] text-base-700">
              Checkout onchain
            </span>
          </button>
        </>
      )}

      {status && <p className="text-sm text-green-700">{status}</p>}
      {txHash && (
        <p className="break-all text-xs text-base-600">
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
      setError("Informe email valido e valor acima de zero.");
      return;
    }

    void logSupportIntent({
      zineSlug: zine.slug,
      method: "pix",
      surface: "support_panel",
      amountInput: amount.trim(),
      currencyInput: "brl",
      walletConnected: false,
    });

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
        setError(payload.error || "Falha ao gerar cobranca Pix.");
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
    <div className="space-y-2.5">
      <div className="wallet-surface rounded-lg border border-base-300 p-2.5">
        <label
          className="font-mono text-[0.56rem] uppercase tracking-[0.14em] text-base-600"
          htmlFor="pix-email"
        >
          Email para comprovante
        </label>
        <input
          id="pix-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="ui-input mt-1.5 px-3 py-2 text-ink"
        />

        <label
          className="mt-2 block font-mono text-[0.56rem] uppercase tracking-[0.14em] text-base-600"
          htmlFor="pix-amount"
        >
          Valor em BRL
        </label>
        <input
          id="pix-amount"
          inputMode="decimal"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          className="ui-input mt-1.5 px-3 py-2 text-ink"
        />
      </div>

      <button
        type="button"
        onClick={handleCreateCharge}
        disabled={isCreatingCharge}
        className={`${primaryPaymentButtonClass} !py-2.5`}
      >
        <span className="block text-center font-mono text-[0.58rem] uppercase tracking-[0.14em] text-base-900">
          {isCreatingCharge ? "Gerando QR Pix..." : "Gerar QR Pix"}
        </span>
      </button>

      {charge && (
        <div className="wallet-surface-muted space-y-2 rounded-lg border border-base-300 p-2.5">
          <p className="text-[0.78rem] text-base-700">Escaneie o QR ou toque no codigo para copiar.</p>

          <div className="mx-auto w-fit rounded-lg border border-base-300 bg-paper p-2">
            <QRCodeSVG value={charge.pixQrCode} size={170} includeMargin />
          </div>

          <button
            type="button"
            onClick={handleCopyPixCode}
            className="w-full break-all rounded-md border border-base-300 bg-paper p-2 text-left text-xs text-base-700 transition hover:border-base-400 hover:bg-base-100"
            title="Copiar codigo Pix"
          >
            {charge.pixCopyPaste}
          </button>

          <div className="flex items-center justify-between gap-2">
            <p className="font-mono text-[0.54rem] uppercase tracking-[0.12em] text-base-600">
              {copyState === "copied"
                ? "Codigo copiado"
                : copyState === "error"
                  ? "Falha ao copiar"
                  : formatCurrencyBRL(Number(amount) || 0)}
            </p>
            <p className={`text-sm font-semibold ${statusColorClass(status)}`}>{status}</p>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  );
}

function CurrencyMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <p className="font-mono text-[0.5rem] uppercase tracking-[0.12em] text-base-500">{label}</p>
      <p className="text-[0.78rem] font-semibold text-base-900">{value}</p>
    </div>
  );
}
