import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupportEvent } from "@/lib/storage";

const web3LogSchema = z.object({
  zineSlug: z.string().min(2),
  txHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
  payerWallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  amountUsdc6: z.string().regex(/^\d+$/),
  chainId: z.number().int().positive(),
  revnetProjectId: z.number().int().positive(),
});

export async function POST(request: Request) {
  try {
    const payload = web3LogSchema.parse(await request.json());

    await createSupportEvent({
      source: "web3",
      zineSlug: payload.zineSlug,
      amountUsdc6: BigInt(payload.amountUsdc6),
      payerWallet: payload.payerWallet,
      txHash: payload.txHash,
      chainId: payload.chainId,
      revnetProject: payload.revnetProjectId,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha no log web3.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

