import type { NextRequest } from "next/server";
import { createClient } from "@proof.com/proof-vc-server";
import { type ResponseMode } from "@proof.com/proof-vc-web";
import {
  ENVIRONMENTS,
  callbackURI,
  isEnvironmentKey,
  originFromRequest,
} from "@/app/lib/environments";
import { TRANSACTION_DATA } from "@/app/data/transaction_data";
import { parseUseCase } from "@/app/lib/util";
import { getPrivateJwk } from "@/app/lib/signing_key";
import { BASIC_SCOPE, NATIONALITY_SCOPE } from "@/app/lib/scopes";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const environmentKey: string | undefined =
      typeof body.environmentKey === "string" ? body.environmentKey : undefined;
    const environment = isEnvironmentKey(environmentKey)
      ? ENVIRONMENTS[environmentKey]
      : undefined;
    const useCase = parseUseCase(
      typeof body.useCase === "string" ? body.useCase : undefined,
    );
    const isNationality = useCase === "nationality";
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

    const scope = isNationality ? NATIONALITY_SCOPE : BASIC_SCOPE;
    const url = await client.authorizationUrl({
      scope,
      nonce,
      state: useCase,
      ...(typeof body.loginHint === "string" &&
        body.loginHint && { loginHint: body.loginHint }),
      ...(TRANSACTION_DATA[useCase] && {
        transactionData: TRANSACTION_DATA[useCase],
      }),
    });

    return Response.json({ url });
  } catch (error) {
    console.error(error);
    return Response.json({ error: String(error) }, { status: 502 });
  }
}
