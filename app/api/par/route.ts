import type { NextRequest } from "next/server";
import { createClient } from "@proof.com/proof-vc-server";
import { type ResponseMode } from "@proof.com/proof-vc-web";
import {
  ENVIRONMENTS,
  callbackURI,
  originFromRequest,
  type EnvironmentKey,
} from "@/app/lib/environments";
import { TRANSACTION_DATA } from "@/app/data/transaction_data";
import { parseUseCase } from "@/app/lib/util";
import { getPrivateJwk } from "@/app/lib/signing_key";

export const runtime = "nodejs";

const SCOPE = "urn:proof:params:scope:verifiable-credentials:basic" as const;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const environment = ENVIRONMENTS[body.environmentKey as EnvironmentKey];
    const useCase = parseUseCase(
      typeof body.useCase === "string" ? body.useCase : undefined,
    );
    const nonce = body.nonce;
    const responseMode: ResponseMode =
      body.responseMode === "direct_post" ? "direct_post" : "fragment";
    const usePushedAuthorizationRequest = body.authzMethod !== "query";
    const useSecuredAuthorizationRequest = body.signedRequest === true;

    if (!environment || !useCase || typeof nonce !== "string" || !nonce) {
      return Response.json(
        { error: "invalid authorization request" },
        { status: 400 },
      );
    }

    const client = createClient({
      environment: environment.environment,
      clientId: environment.clientId[useCase],
      clientSecret: environment.clientSecret[useCase],
      responseMode,
      callbackUri: callbackURI(originFromRequest(request), responseMode),
      usePushedAuthorizationRequest,
      useSecuredAuthorizationRequest,
      ...(useSecuredAuthorizationRequest && {
        privateKeyFactory: getPrivateJwk,
      }),
    });

    const url = await client.authorizationUrl({
      scope: SCOPE,
      nonce,
      state: useCase,
      ...(typeof body.loginHint === "string" &&
        body.loginHint && { loginHint: body.loginHint }),
      transactionData: TRANSACTION_DATA[useCase],
    });

    return Response.json({ url });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 502 });
  }
}
