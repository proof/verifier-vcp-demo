import type { NextRequest } from "next/server";
import { ACCESS_TOKEN_TYPE, verifier } from "@proof.com/x401-node";
import { createVerifier } from "@proof.com/proof-vc-server";
import { BASIC_SCOPE, signToken, TOKEN_TTL_SECONDS } from "@/app/lib/x401";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const form = new URLSearchParams(await request.text());
    const { subject_token } = verifier.parseTokenExchange(form);
    const artifact = verifier.decodeResultArtifact(subject_token);

    const data = artifact.credential_result?.data;
    const vpToken =
      typeof data === "object" && data !== null && !Array.isArray(data)
        ? data.vp_token
        : undefined;
    if (typeof vpToken !== "string") {
      return Response.json(
        { error: "presentation response is missing vp_token" },
        { status: 400 },
      );
    }

    const presentation = await createVerifier({
      trustRoot: "development",
    }).verifyVPToken({
      encodedVPToken: vpToken,
    });

    const firstCredential = Object.values(presentation)[0]?.[0];
    const claims = firstCredential?.getClaims();

    const access_token = signToken({
      sub: "x401-demo",
      ...(claims !== undefined && { claims }),
    });

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
