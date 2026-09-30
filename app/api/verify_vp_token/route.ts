import type { NextRequest } from "next/server";
import { createVerifier } from "@proof.com/proof-vc-server";
import { NONCE } from "@/app/lib/util";
import { ENVIRONMENTS, isEnvironmentKey } from "@/app/lib/environments";

export async function POST(request: NextRequest) {
  const { vp_token: vpToken, environmentKey } = await request.json();

  if (typeof vpToken !== "string" || vpToken.length === 0) {
    return Response.json({ error: "vp_token is required" }, { status: 400 });
  }
  if (!isEnvironmentKey(environmentKey)) {
    return Response.json(
      { error: "environmentKey is required" },
      { status: 400 },
    );
  }

  const verifier = createVerifier({
    environment: ENVIRONMENTS[environmentKey].environment,
  });

  try {
    const presentation = await verifier.verifyVPToken({
      encodedVPToken: vpToken,
    });

    const result: Record<string, unknown> = {};
    for (const [credentialId, credentials] of Object.entries(presentation)) {
      result[credentialId] = credentials.map((credential) => {
        if (credential.getNonce() !== NONCE) {
          throw "invalid nonce";
        }
        const sdJwt = credential.getSDJWT();
        return {
          payload: sdJwt.jwt?.payload ?? null,
          disclosures: sdJwt.disclosures ?? [],
          kbJwt: sdJwt.kbJwt?.payload ?? null,
        };
      });
    }

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 400 });
  }
}
