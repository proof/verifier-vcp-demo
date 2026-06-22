import type { NextRequest } from "next/server";
import { init, getAuthorizationRequestURL } from "@proof.com/proof-vc-common";
import { type ResponseMode } from "@proof.com/proof-vc-web";
import {
  ENVIRONMENTS,
  callbackURI,
  originFromRequest,
  type EnvironmentKey,
} from "@/app/lib/environments";
import { TRANSACTION_DATA } from "@/app/data/transaction_data";
import { parseUseCase } from "@/app/lib/util";

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

    if (!environment || !useCase || typeof nonce !== "string" || !nonce) {
      return Response.json(
        { error: "invalid authorization request" },
        { status: 400 },
      );
    }

    init({
      environment: environment.environment,
      clientId: environment.clientId[useCase],
      clientSecret: environment.clientSecret[useCase],
      responseMode,
      callbackUri: callbackURI(originFromRequest(request), responseMode),
      usePushedAuthorizationRequest: true,
    });

    const url = await getAuthorizationRequestURL({
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
