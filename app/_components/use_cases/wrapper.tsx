"use client";
import { useState, useEffect, useSyncExternalStore } from "react";
import { init } from "@proof.com/proof-vc-web";
import { Block } from "../../common/block";
import { MeshGradient } from "../../common/mesh-gradient/mesh-gradient";
import { AuthForm } from "../../common/auth_form";
import { MerchantCase } from "./merchant-case";
import { WireTransferCase } from "./wire-transfer-case";
import { AP2Case } from "./ap2-case";
import { ProtocolPanel } from "../../_components/protocol-panel";
import { useDemoSettings } from "../../_components/demo-settings-context";
import {
  type UseCase,
  ensureNonce,
  nonceServerSnapshot,
  nonceSnapshot,
  rotateNonce,
  subscribeNonce,
} from "../../lib/util";
import {
  callbackURI,
  ENVIRONMENTS,
  originServerSnapshot,
  originSnapshot,
  subscribeOrigin,
} from "../../lib/environments";
import Link from "next/link";
import { ArrowRightIcon } from "../../common/icons";
import { Footer } from "../../_components/footer";
import { authorizationRequestPreview } from "../../lib/request_preview";

type Presentation = { vpToken: string; result: Record<string, unknown> };

const fetchVPToken = async (responseCode: string): Promise<string> => {
  const response = await fetch(`/api/search?response_code=${responseCode}`);
  if (!response.ok) throw new Error(`fetch token failed: ${response.status}`);
  const json = await response.json();
  return json["vp_token"];
};

const verifyVPToken = async (
  token: string,
  nonce: string,
): Promise<Record<string, unknown>> => {
  const response = await fetch("/api/verify_vp_token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vp_token: token, nonce }),
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(
      typeof json?.error === "string"
        ? json.error
        : `verification failed: ${response.status}`,
    );
  }
  return json;
};

export function Wrapper({ useCase }: { useCase: UseCase }) {
  const { env, responseMode, authzMethod } = useDemoSettings();
  const [email, setEmail] = useState("");
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  const nonce = useSyncExternalStore(
    subscribeNonce,
    nonceSnapshot,
    nonceServerSnapshot,
  );
  const origin = useSyncExternalStore(
    subscribeOrigin,
    originSnapshot,
    originServerSnapshot,
  );

  useEffect(() => {
    const { environment, clientId, clientSecret } = ENVIRONMENTS[env];
    const pushed = authzMethod === "pushed";
    init({
      environment,
      client_id: clientId[useCase],
      client_secret: pushed ? clientSecret[useCase] : undefined,
      response_mode: responseMode,
      callback_uri: callbackURI(origin, responseMode),
      use_pushed_authorization_request: pushed,
    });
  }, [useCase, env, responseMode, authzMethod, origin]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const state = params.get("state");
    const responseCode = params.get("response_code");
    const vpToken = params.get("vp_token");

    if (!vpToken && !responseCode) {
      ensureNonce();
      return;
    }

    if (state !== useCase) {
      return;
    }

    const previousNonce = rotateNonce();

    const resolveToken = vpToken
      ? Promise.resolve(vpToken)
      : fetchVPToken(responseCode!);

    resolveToken
      .then((token) => {
        if (!previousNonce) throw new Error("missing nonce");
        return verifyVPToken(token, previousNonce).then((result) => ({
          vpToken: token,
          result,
        }));
      })
      .then(setPresentation)
      .catch((cause) =>
        setError(cause instanceof Error ? cause.message : String(cause)),
      );
  }, [useCase]);

  const { endpoint, params: requestParams } = authorizationRequestPreview({
    environmentKey: env,
    useCase,
    responseMode,
    pushedAuthorization: authzMethod === "pushed",
    nonce,
    loginHint: email,
    origin,
  });

  const showSuccess = !!presentation && !dismissed;
  const handleDismissSuccess = () => setDismissed(true);

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <MeshGradient />
      <main className="flex w-full max-w-6xl flex-1 flex-col px-2 pt-6 pb-6 sm:px-6 sm:pt-16">
        <div className="px-2 sm:px-0">
          <h1 className="sr-only">Proof</h1>
          <img
            className="mt-0 mb-6 h-8 w-auto self-start sm:mt-4 sm:mb-4 sm:h-12"
            src="/proof-logo-full-white.svg"
            alt=""
            aria-hidden="true"
          />
          <Link href="/">
            <div className="group hover:text-primary-30 flex items-center">
              <ArrowRightIcon className="group-hover:text-primary-30 mr-1 h-[12px] w-[12px] rotate-180" />
              Back to all demos
            </div>
          </Link>
        </div>
        <div className="mt-4 grid w-full grid-cols-1 items-start gap-4 md:grid-cols-[3fr_5fr]">
          <Block
            title={
              useCase === "merchant"
                ? "Verified Payment"
                : useCase === "wire"
                  ? "Wire Transfer"
                  : "Agent Authorization"
            }
          >
            <div>
              {useCase === "merchant" && (
                <MerchantCase
                  showSuccess={showSuccess}
                  onDismiss={handleDismissSuccess}
                />
              )}
              {useCase === "wire" && (
                <WireTransferCase
                  showSuccess={showSuccess}
                  onDismiss={handleDismissSuccess}
                />
              )}
              {useCase === "ap2" && (
                <AP2Case
                  showSuccess={showSuccess}
                  onDismiss={handleDismissSuccess}
                />
              )}
            </div>
            <div className="flex flex-col gap-3">
              <h2 className="my-4 border-t-2 border-gray-300 pt-2 text-lg font-bold">
                {useCase === "wire"
                  ? "Authorize your wire transfer"
                  : useCase === "ap2"
                    ? "Authorize the agent to shop"
                    : "Authorize your purchase"}
              </h2>
              <AuthForm
                useCase={useCase}
                email={email}
                onEmailChange={setEmail}
                nonce={nonce}
                authzMethod={authzMethod}
                environmentKey={env}
                responseMode={responseMode}
              />
            </div>
          </Block>
          <Block id="protocol-block" title="Protocol">
            <ProtocolPanel
              presentation={presentation?.result ?? null}
              rawToken={presentation?.vpToken ?? null}
              error={error}
              requestParams={requestParams}
              endpoint={endpoint}
            />
          </Block>
        </div>
      </main>
      <Footer />
    </div>
  );
}
