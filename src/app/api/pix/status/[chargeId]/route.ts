import { NextResponse } from "next/server";
import { getPixCharge } from "@/lib/storage";

export async function GET(
  _request: Request,
  { params }: { params: { chargeId: string } },
) {
  const charge = await getPixCharge(params.chargeId);
  if (!charge) {
    return NextResponse.json({ error: "ChargeId nao encontrado." }, { status: 404 });
  }

  let status = charge.status;
  if (status === "pending" && charge.expiresAt.getTime() < Date.now()) {
    status = "expired";
  }

  return NextResponse.json({
    chargeId: charge.chargeId,
    status,
    expiresAt: charge.expiresAt.toISOString(),
    paidAt: charge.paidAt?.toISOString(),
  });
}

