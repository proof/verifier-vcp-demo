import { randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";
import {
  verifier as x401,
  HEADER,
  DC_API_PROTOCOL,
} from "@proof.com/x401-node";
import { createClient, createVerifier } from "@proof.com/proof-vc-server";
import { getPrivateJwk } from "@/app/lib/signing_key";
import { MCP_URLS, grantedPage, protectedPage } from "@/app/x401/page_html";
import {
  X401_SCOPE,
  agentsTrustListUrl,
  x401Context,
  type X401Context,
} from "@/app/lib/x401";

export const runtime = "nodejs";

const HTML_HEADERS = { "content-type": "text/html; charset=utf-8" };

async function proofRequired(context: X401Context): Promise<Response> {
  const proofClient = createClient({
    environment: context.environment,
    clientId: context.clientId,
    useSecuredAuthorizationRequest: true,
    privateKeyFactory: getPrivateJwk,
  });
  const request = await proofClient.signedDcApiRequest({
    scope: X401_SCOPE,
    nonce: randomUUID(),
    expectedOrigins: [agentsTrustListUrl(context.environment)],
  });
  const payload = x401.buildPayload({
    credentialRequirements: {
      digital: {
        requests: [{ protocol: DC_API_PROTOCOL.SIGNED, data: { request } }],
      },
    },
  });
  const encoded = x401.encodePayload(payload);
  return new Response(
    protectedPage({
      proofRequestHeaderName: HEADER.PROOF_REQUEST,
      proofRequired: encoded,
      mcpUrl: MCP_URLS[context.environmentKey],
    }),
    {
      status: 401,
      headers: { ...HTML_HEADERS, [HEADER.PROOF_REQUEST]: encoded },
    },
  );
}

function errorResponse(status: number, message: string): Response {
  return new Response(message, {
    status,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

function vpTokenFromResponse(response: string): string | undefined {
  const data = x401.decodeResultArtifact(response).credential_result?.data;
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return undefined;
  }
  const vpToken = data.vp_token;
  return typeof vpToken === "string" && vpToken.length > 0
    ? vpToken
    : undefined;
}

async function verifyProof(
  context: X401Context,
  response: string,
): Promise<Response> {
  let encodedVPToken: string | undefined;
  try {
    encodedVPToken = vpTokenFromResponse(response);
  } catch (error) {
    return errorResponse(400, `Malformed PROOF-RESPONSE: ${String(error)}`);
  }
  if (encodedVPToken === undefined) {
    return errorResponse(
      400,
      "PROOF-RESPONSE must carry an inline credential_result with a vp_token",
    );
  }

  const proofVerifier = createVerifier({ environment: context.environment });
  try {
    const presentation = await proofVerifier.verifyVPToken({
      encodedVPToken,
      aud: context.clientId,
    });
    const credential = presentation.proof_id_default?.[0];
    if (credential === undefined) {
      return errorResponse(
        401,
        "Presentation contains no proof_id_default credential",
      );
    }
    return new Response(grantedPage(credential.toJSON()), {
      status: 200,
      headers: HTML_HEADERS,
    });
  } catch (error) {
    return errorResponse(401, `PROOF-RESPONSE rejected: ${String(error)}`);
  }
}

export async function GET(request: NextRequest) {
  const context = x401Context(request);
  const response = request.headers.get(HEADER.PROOF_RESPONSE);
  if (response === null) {
    return proofRequired(context);
  }
  return verifyProof(context, response);
}
