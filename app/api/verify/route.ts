import type { NextRequest } from "next/server";
import { randomBytes } from "crypto";
import { callbackURI, originFromRequest } from "../../lib/environments";
import { DataClient } from "../data_client";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const vpToken = formData.get("vp_token");
  const state = formData.get("state");
  const nonce = randomBytes(16).toString("hex");

  // Expire the records an hour from now so that refresh works but the records
  // are still cleaned up fairly regularly
  const expiration = Math.floor(Date.now() / 1000 + 3600);
  const result = await DataClient.models.VpTokens.create({
    id: nonce,
    token: vpToken!.valueOf().toString(),
    expiresAt: expiration,
  });

  if (result.errors?.length) {
    console.error("VpTokens create failed:", JSON.stringify(result.errors));
    return Response.json({ error: "create failed" }, { status: 500 });
  }

  const callback = callbackURI(originFromRequest(request), "fragment");
  return Response.json({
    redirect_uri: `${callback}#response_code=${nonce}&state=${state}`,
  });
}
