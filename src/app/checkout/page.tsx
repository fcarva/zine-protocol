"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { erc20Abi, parseUnits } from "viem";
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
import { publicEnv } from "@/lib/env";
import { formatCurrencyBRL } from "@/lib/format";
import { revnetTerminalAbi } from "@/lib/revnet";

type PixStatus = "pending" | "paid" | "expired" | "failed";

interface PixChargeCheckout {
  zineSlug: string;
  zineTitle: string;
  chargeId: string;
  pixQrCode: string;
  pixCopyPaste: string;
  expiresAt: string;
  status: PixStatus;
}

interface EmailCheckoutResult {
  ok: boolean;
  orderId: string;
  status: string;
  totalBRL: number;
  customerEmail: string;
  message: string;
}

export default function CheckoutPage() {
  const { items, totalBRL, itemCount, updateQuantity, updateAmountBRL, removeItem, clearCart } = useCart();
  const [method, setMethod] = useState<"wallet" | "pix" | "email">("wallet");

  const [pixEmail, setPixEmail] = useState("");
  const [pixError, setPixError] = useState("");
  const [pixCharges, setPixCharges] = useState<PixChargeCheckout[]>([]);
  const [isPixLoading, setIsPixLoading] = useState(false);

  const [emailCheckout, setEmailCheckout] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailResult, setEmailResult] = useState<EmailCheckoutResult | null>(null);
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  const [walletStatus, setWalletStatus] = useState("");
  const [walletError, setWalletError] = useState("");
  const [walletHashes, setWalletHashes] = useState<string[]>([]);
  const [isWalletLoading, setIsWalletLoading] = useState(false);

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  const hasItems = items.length > 0;

  const walletCheckoutEnabled =
    hasItems &&
    isConnected &&
    !!publicEnv.usdcAddress &&
    !!publicEnv.revnetTerminalAddress &&
    chainId === baseSepolia.id &&
    !isWalletLoading;

  useEffect(() => {
    if (pixCharges.length === 0) return;
    const hasPending = pixCharges.some((entry) => entry.status === "pending");
    if (!hasPending) return;

    const timer = setInterval(async () => {
      const updates = await Promise.all(
        pixCharges.map(async (entry) => {
          if (entry.status !== "pending") return entry;
          try {
            const response = await fetch(`/api/pix/status/${entry.chargeId}`);
            if (!response.ok) return entry;
            const payload = (await response.json()) as { status: PixStatus };
            return { ...entry, status: payload.status };
          } catch {
            return entry;
          }
        }),
      );
      setPixCharges(updates);
      if (updates.every((entry) => entry.status === "paid")) {
        clearCart();
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [clearCart, pixCharges]);

  const totalUSDC = useMemo(() => totalBRL, [totalBRL]);

  async function handlePixCheckout() {
    setPixError("");
    setPixCharges([]);

    if (!hasItems) {
      setPixError("Seu carrinho está vazio.");
      return;
    }

    if (!pixEmail) {
      setPixError("Informe um email para comprovantes.");
      return;
    }

    setIsPixLoading(true);
    try {
      const createdCharges: PixChargeCheckout[] = [];

      for (const item of items) {
        const amount = Number((item.amountBRL * item.quantity).toFixed(2));
        const response = await fetch("/api/pix/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            zineSlug: item.slug,
            amountBRL: amount,
            payerEmail: pixEmail,
          }),
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => ({}))) as { error?: string };
          throw new Error(payload.error || `Falha ao gerar Pix para ${item.title}.`);
        }

        const payload = (await response.json()) as {
          chargeId: string;
          pixQrCode: string;
          pixCopyPaste: string;
          expiresAt: string;
        };

        createdCharges.push({
          zineSlug: item.slug,
          zineTitle: item.title,
          chargeId: payload.chargeId,
          pixQrCode: payload.pixQrCode,
          pixCopyPaste: payload.pixCopyPaste,
          expiresAt: payload.expiresAt,
          status: "pending",
        });
      }

      setPixCharges(createdCharges);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha no checkout Pix.";
      setPixError(message);
    } finally {
      setIsPixLoading(false);
    }
  }

  async function handleEmailCheckout() {
    setEmailError("");
    setEmailResult(null);

    if (!hasItems) {
      setEmailError("Seu carrinho está vazio.");
      return;
    }

    if (!emailCheckout) {
      setEmailError("Informe um email para finalizar.");
      return;
    }

    setIsEmailLoading(true);
    try {
      const response = await fetch("/api/checkout/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: emailCheckout,
          items: items.map((item) => ({
            zineSlug: item.slug,
            amountBRL: item.amountBRL,
            quantity: item.quantity,
          })),
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(payload.error || "Falha no checkout por email.");
      }

      const payload = (await response.json()) as EmailCheckoutResult;
      setEmailResult(payload);
      clearCart();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha no checkout por email.";
      setEmailError(message);
    } finally {
      setIsEmailLoading(false);
    }
  }

  async function handleWalletCheckout() {
    if (!address || !publicClient || isWalletLoading || !walletCheckoutEnabled) return;

    setWalletStatus("Iniciando checkout wallet...");
    setWalletError("");
    setWalletHashes([]);
    setIsWalletLoading(true);

    try {
      const hashes: string[] = [];
      for (const item of items) {
        const itemTotalBRL = Number((item.amountBRL * item.quantity).toFixed(2));
        const amountUsdc6 = parseUnits(itemTotalBRL.toFixed(2), 6);

        setWalletStatus(`Aprovando USDC para ${item.title}...`);
        const approveHash = await writeContractAsync({
          address: publicEnv.usdcAddress as `0x${string}`,
          abi: erc20Abi,
          functionName: "approve",
          args: [publicEnv.revnetTerminalAddress as `0x${string}`, amountUsdc6],
          chainId: baseSepolia.id,
        });
        await publicClient.waitForTransactionReceipt({ hash: approveHash });

        setWalletStatus(`Enviando apoio para ${item.title}...`);
        const payHash = await writeContractAsync({
          address: publicEnv.revnetTerminalAddress as `0x${string}`,
          abi: revnetTerminalAbi,
          functionName: "pay",
          args: [
            BigInt(item.revnetProjectId),
            publicEnv.usdcAddress as `0x${string}`,
            amountUsdc6,
            address,
            BigInt(0),
            `Checkout wallet zine ${item.slug}`,
            "0x",
          ],
          chainId: baseSepolia.id,
        });
        await publicClient.waitForTransactionReceipt({ hash: payHash });

        hashes.push(payHash);
        await fetch("/api/support/web3/log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            zineSlug: item.slug,
            txHash: payHash,
            payerWallet: address,
            amountUsdc6: amountUsdc6.toString(),
            chainId: baseSepolia.id,
            revnetProjectId: item.revnetProjectId,
          }),
        });
      }

      setWalletHashes(hashes);
      setWalletStatus("Checkout wallet concluído com sucesso.");
      clearCart();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha no checkout wallet.";
      setWalletError(message);
      setWalletStatus("");
    } finally {
      setIsWalletLoading(false);
    }
  }

  return (
    <div className="space-y-3 font-sans sm:space-y-4">
      <header className="editorial-panel rounded-xl p-3 sm:p-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-base-600">Apoiar</p>
            <h1 className="text-[1.65rem] font-semibold uppercase leading-[0.9] tracking-[-0.03em] text-ink sm:text-[1.95rem]">
              Carrinho
            </h1>
          </div>
          <p className="text-right font-mono text-[0.55rem] uppercase tracking-[0.14em] text-base-600">
            {itemCount} itens / {formatCurrencyBRL(totalBRL)}
          </p>
        </div>
      </header>

      {!hasItems ? (
        <section className="editorial-panel rounded-xl p-4">
          <p className="text-sm text-base-700">Seu carrinho está vazio.</p>
          <Link
            href="/"
            className="mt-3 inline-flex rounded-lg border border-base-300 bg-paper px-3 py-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-base-700"
          >
            Voltar para catálogo
          </Link>
        </section>
      ) : (
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="editorial-panel rounded-xl p-2.5 sm:p-3">
            <div className="space-y-2">
              {items.map((item) => (
                <article
                  key={item.slug}
                  className="grid gap-2 rounded-lg border border-base-300 bg-base-50 p-2 sm:grid-cols-[74px_minmax(0,1fr)_auto]"
                >
                  <figure className="relative aspect-[7/10] overflow-hidden rounded border border-base-300 bg-base-200">
                    <Image
                      src={item.coverImage}
                      alt={item.title}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 640px) 74px, 74px"
                    />
                  </figure>

                  <div className="space-y-1">
                    <p className="font-mono text-[0.52rem] uppercase tracking-[0.12em] text-base-600">{item.artistName}</p>
                    <h2 className="text-[0.95rem] font-semibold leading-tight text-ink">{item.title}</h2>

                    <div className="flex flex-wrap items-center gap-2">
                      <label className="font-mono text-[0.5rem] uppercase tracking-[0.12em] text-base-600">
                        Qtd
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={99}
                        value={item.quantity}
                        onChange={(event) => updateQuantity(item.slug, Number(event.target.value))}
                        className="w-16 rounded border border-base-300 bg-paper px-2 py-1 text-xs text-ink"
                      />

                      <label className="font-mono text-[0.5rem] uppercase tracking-[0.12em] text-base-600">
                        Valor BRL
                      </label>
                      <input
                        type="number"
                        min={1}
                        step="1"
                        value={item.amountBRL}
                        onChange={(event) => updateAmountBRL(item.slug, Number(event.target.value))}
                        className="w-20 rounded border border-base-300 bg-paper px-2 py-1 text-xs text-ink"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between gap-2">
                    <p className="font-mono text-[0.55rem] uppercase tracking-[0.12em] text-base-700">
                      {formatCurrencyBRL(item.amountBRL * item.quantity)}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.slug)}
                      className="rounded border border-base-300 px-2 py-1 font-mono text-[0.5rem] uppercase tracking-[0.12em] text-base-600 hover:bg-base-100"
                    >
                      Remover
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="editorial-panel rounded-xl p-3">
            <p className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-base-600">Finalizar compra</p>
            <p className="mt-1 text-[0.86rem] text-base-700">
              Total: <strong>{formatCurrencyBRL(totalBRL)}</strong> ({totalUSDC.toFixed(2)} USDC demo)
            </p>

            <div className="mt-3 grid grid-cols-3 gap-1 rounded-lg border border-base-300 bg-base-100 p-1">
              <button
                type="button"
                onClick={() => setMethod("wallet")}
                className={`rounded px-2 py-1.5 font-mono text-[0.56rem] uppercase tracking-[0.12em] ${
                  method === "wallet" ? "bg-paper text-ink" : "text-base-600"
                }`}
              >
                Wallet
              </button>
              <button
                type="button"
                onClick={() => setMethod("email")}
                className={`rounded px-2 py-1.5 font-mono text-[0.56rem] uppercase tracking-[0.12em] ${
                  method === "email" ? "bg-paper text-ink" : "text-base-600"
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => setMethod("pix")}
                className={`rounded px-2 py-1.5 font-mono text-[0.56rem] uppercase tracking-[0.12em] ${
                  method === "pix" ? "bg-paper text-ink" : "text-base-600"
                }`}
              >
                Pix
              </button>
            </div>

            {method === "wallet" && (
              <div className="mt-3 space-y-2">
                {!isConnected ? (
                  <>
                    <p className="text-sm text-base-700">Conecte uma carteira para pagar no checkout.</p>
                    <div className="flex flex-wrap gap-2">
                      {connectors.map((connector) => (
                        <button
                          key={connector.uid}
                          type="button"
                          disabled={isConnecting}
                          onClick={() => connect({ connector })}
                          className="rounded border border-base-300 bg-paper px-2.5 py-1.5 font-mono text-[0.58rem] uppercase tracking-[0.12em]"
                        >
                          {connector.name}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="rounded border border-base-300 bg-base-50 px-2 py-1 text-xs text-base-700">
                      Carteira: {address}
                    </p>
                    {chainId !== baseSepolia.id && (
                      <p className="text-sm text-red-700">Troque para Base Sepolia para continuar.</p>
                    )}
                    <button
                      type="button"
                      onClick={handleWalletCheckout}
                      disabled={!walletCheckoutEnabled}
                      className="w-full rounded-lg border border-orange-700 bg-orange-600 px-3 py-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-paper disabled:cursor-not-allowed disabled:border-base-400 disabled:bg-base-400"
                    >
                      {isWalletLoading ? "Processando wallet..." : "Finalizar com Wallet"}
                    </button>
                    <button
                      type="button"
                      onClick={() => disconnect()}
                      className="w-full rounded-lg border border-base-300 bg-paper px-3 py-2 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-base-700"
                    >
                      Desconectar
                    </button>
                  </>
                )}

                  {walletStatus && <p className="text-sm text-green-700">{walletStatus}</p>}
                  {walletError && <p className="text-sm text-red-700">{walletError}</p>}
                {walletHashes.length > 0 && (
                  <ul className="space-y-1">
                    {walletHashes.map((hash) => (
                      <li key={hash} className="break-all text-xs text-base-600">
                        Tx: {hash}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {method === "email" && (
              <div className="mt-3 space-y-2">
                <label
                  htmlFor="checkout-email"
                  className="font-mono text-[0.54rem] uppercase tracking-[0.12em] text-base-600"
                >
                  Email para finalizar
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  value={emailCheckout}
                  onChange={(event) => setEmailCheckout(event.target.value)}
                  className="w-full rounded-lg border border-base-300 bg-paper px-3 py-2 text-sm text-ink"
                />
                <button
                  type="button"
                  onClick={handleEmailCheckout}
                  disabled={isEmailLoading}
                  className="w-full rounded-lg border border-orange-700 bg-orange-600 px-3 py-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-paper disabled:cursor-not-allowed disabled:border-base-400 disabled:bg-base-400"
                >
                  {isEmailLoading ? "Confirmando..." : "Finalizar por email"}
                </button>
                {emailError && <p className="text-sm text-red-700">{emailError}</p>}
                {emailResult && (
                  <div className="rounded-lg border border-base-300 bg-base-50 p-2 text-xs text-base-700">
                    <p>Pedido: {emailResult.orderId}</p>
                    <p>Status: {emailResult.status}</p>
                    <p>{emailResult.message}</p>
                  </div>
                )}
              </div>
            )}

            {method === "pix" && (
              <div className="mt-3 space-y-2">
                <label
                  htmlFor="checkout-pix-email"
                  className="font-mono text-[0.54rem] uppercase tracking-[0.12em] text-base-600"
                >
                  Email para comprovante
                </label>
                <input
                  id="checkout-pix-email"
                  type="email"
                  value={pixEmail}
                  onChange={(event) => setPixEmail(event.target.value)}
                  className="w-full rounded-lg border border-base-300 bg-paper px-3 py-2 text-sm text-ink"
                />
                <button
                  type="button"
                  onClick={handlePixCheckout}
                  disabled={isPixLoading}
                  className="w-full rounded-lg border border-orange-700 bg-orange-600 px-3 py-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-paper disabled:cursor-not-allowed disabled:border-base-400 disabled:bg-base-400"
                >
                  {isPixLoading ? "Gerando cobranças..." : "Gerar Pix do checkout"}
                </button>
                {pixError && <p className="text-sm text-red-700">{pixError}</p>}

                {pixCharges.length > 0 && (
                  <div className="max-h-[28rem] space-y-2 overflow-auto pr-1">
                    {pixCharges.map((charge) => (
                      <article key={charge.chargeId} className="rounded-lg border border-base-300 bg-base-50 p-2">
                        <p className="text-xs font-semibold text-ink">{charge.zineTitle}</p>
                        <p className="font-mono text-[0.52rem] uppercase tracking-[0.1em] text-base-600">
                          {charge.status}
                        </p>
                        <div className="mt-1 w-fit rounded border border-base-300 bg-paper p-1">
                          <QRCodeSVG value={charge.pixQrCode} size={114} includeMargin />
                        </div>
                        <p className="mt-1 break-all text-[0.65rem] text-base-700">{charge.pixCopyPaste}</p>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

