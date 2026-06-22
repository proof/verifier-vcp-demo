import type { NextRequest } from "next/server";
import { ACCESS_TOKEN_TYPE, verifier } from "@proof.com/x401-node";
import { init, verifyVPToken } from "@proof.com/proof-vc-common";
import { BASIC_SCOPE, signToken, TOKEN_TTL_SECONDS } from "@/app/lib/x401";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    init({ trustRoot: "development" });
    const form = new URLSearchParams(await request.text());
    const { subject_token } = verifier.parseTokenExchange(form);
    const artifact = verifier.decodeVPArtifact(subject_token);

    await verifyVPToken({
      encodedVPToken: artifact.vp_token as string,
      nonce: artifact.challenge,
    });

    const access_token = signToken({ sub: "x401-demo" });

    return Response.json({
      access_token,
      token_type: "Bearer",
      expires_in: TOKEN_TTL_SECONDS,
      issued_token_type: ACCESS_TOKEN_TYPE,
      scope: BASIC_SCOPE,
    });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 400 });
  }
}
