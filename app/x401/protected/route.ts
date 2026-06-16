import crypto from "node:crypto";
import type { NextRequest } from "next/server";
import { HEADER, verifier } from "@proof.com/x401-node";
import { BASIC_SCOPE, verifyToken } from "@/app/lib/x401";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const origin = new URL(request.url).origin;

  const presentation = request.headers.get(HEADER.PROOF_PRESENTATION);
  if (presentation) {
    try {
      const tokenObject = verifier.decodeTokenObject(presentation);
      verifyToken(tokenObject.access_token);
      return new Response(
        "<!doctype html><html><body><h1>Protected resource</h1><p>You presented a valid proof. Access granted.</p></body></html>",
        { status: 200, headers: { "Content-Type": "text/html" } },
      );
    } catch {
      // Fall through to issue a fresh requirement.
    }
  }

  const challenge = {
    value: crypto.randomUUID(),
    expires_at: new Date(Date.now() + 600_000).toISOString(),
  };

  const payload = verifier.buildPayload({
    proof: {
      challenge,
      oauth: { token_endpoint: `${origin}/x401/token-exchange` },
      scope: BASIC_SCOPE,
    },
  });

  const body = `<!doctype html><html><body><h1>Proof required</h1><p>This resource requires a verifiable presentation.</p>${verifier.embedHtmlData(payload)}</body></html>`;

  return new Response(body, {
    status: 401,
    headers: {
      "Content-Type": "text/html",
      [HEADER.PROOF_REQUIRED]: verifier.encodePayload(payload),
    },
  });
}
