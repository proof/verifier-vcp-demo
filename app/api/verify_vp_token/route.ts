import type { NextRequest } from "next/server";
import { init, verifyVPToken } from "@proof.com/proof-vc-common";

init({
  environment: "sandbox",
  client_id: "verifier-demo",
  callback_uri: "https://demo.next.proof.com/",
});

export async function POST(request: NextRequest) {
  const { vp_token: vpToken, nonce } = await request.json();

  if (typeof vpToken !== "string" || vpToken.length === 0) {
    return Response.json({ error: "vp_token is required" }, { status: 400 });
  }

  try {
    const presentation = await verifyVPToken({
      encodedVPToken: vpToken,
      ...(typeof nonce === "string" && { nonce }),
    });

    const result: Record<string, unknown> = {};
    for (const [credentialId, credentials] of Object.entries(presentation)) {
      result[credentialId] = credentials.map((credential) => {
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
