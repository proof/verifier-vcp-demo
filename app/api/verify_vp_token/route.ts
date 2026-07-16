import type { NextRequest } from "next/server";
import { createVerifier } from "@proof.com/proof-vc-server";
import { NONCE } from "@/app/lib/util";

export async function POST(request: NextRequest) {
  const verifier = createVerifier({ trustRoot: "development" });

  const { vp_token: vpToken } = await request.json();

  if (typeof vpToken !== "string" || vpToken.length === 0) {
    return Response.json({ error: "vp_token is required" }, { status: 400 });
  }

  try {
    const presentation = await verifier.verifyVPToken({
      encodedVPToken: vpToken,
    });

    const result: Record<string, unknown> = {};
    for (const [credentialId, credentials] of Object.entries(presentation)) {
      result[credentialId] = credentials.map((credential) => {
        if (credential.getNonce() !== NONCE) {
          throw "invalid nonce"
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
