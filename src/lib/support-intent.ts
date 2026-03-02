export type SupportIntentMethod = "wallet" | "pix" | "email";

export type SupportIntentSurface = "support_panel" | "checkout";

export interface SupportIntentLogInput {
  zineSlug: string;
  method: SupportIntentMethod;
  surface: SupportIntentSurface;
  amountInput?: string;
  currencyInput?: string;
  chainId?: number;
  walletConnected?: boolean;
}

const SESSION_STORAGE_KEY = "zine_protocol_session_id";

function generateFallbackId(): string {
  const template = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
  return template.replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

function generateId(): string {
  const maybeCrypto = globalThis.crypto;
  if (maybeCrypto?.randomUUID) {
    return maybeCrypto.randomUUID();
  }
  return generateFallbackId();
}

function getSessionId(): string {
  if (typeof window === "undefined") return "server";

  try {
    const existing = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (existing) return existing;
    const created = generateId();
    window.localStorage.setItem(SESSION_STORAGE_KEY, created);
    return created;
  } catch {
    return generateFallbackId();
  }
}

export async function logSupportIntent(input: SupportIntentLogInput): Promise<void> {
  if (!input.zineSlug.trim()) return;

  const payload = {
    ...input,
    sessionId: getSessionId(),
    intentId: generateId(),
  };

  try {
    await fetch("/api/support/intent/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // Best effort event logging: do not block payment UX.
  }
}
