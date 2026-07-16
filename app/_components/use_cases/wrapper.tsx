"use client";
import { useState, useEffect, useSyncExternalStore } from "react";
import { Block } from "../../common/block";
import { MeshGradient } from "../../common/mesh-gradient/mesh-gradient";
import { AuthForm } from "../../common/auth_form";
import { MerchantCase } from "./merchant-case";
import { WireTransferCase } from "./wire-transfer-case";
import { AP2Case } from "./ap2-case";
import { ProtocolPanel } from "../../_components/protocol-panel";
import {
  settingsToQuery,
  useDemoSettings,
} from "../../_components/demo-settings-context";
import { type UseCase, NONCE } from "../../lib/util";
import {
  originServerSnapshot,
  originSnapshot,
  subscribeOrigin,
} from "../../lib/environments";
import { ArrowRightIcon } from "../../common/icons";
import { Footer } from "../../_components/footer";
import { authorizationRequestPreview } from "../../lib/request_preview";
import {
  consumePresentationFromHash,
  type Presentation,
} from "../../lib/presentation";

export function Wrapper({ useCase }: { useCase: UseCase }) {
  const { env, responseMode, authzMethod } = useDemoSettings();
  const [email, setEmail] = useState("");
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  const origin = useSyncExternalStore(
    subscribeOrigin,
    originSnapshot,
    originServerSnapshot,
  );

  useEffect(() => {
    consumePresentationFromHash(useCase).then((outcome) => {
      if (!outcome) return;
      if ("presentation" in outcome) {
        setPresentation(outcome.presentation);
      } else {
        setError(outcome.error);
      }
    });
  }, [useCase]);

  const { endpoint, params: requestParams } = authorizationRequestPreview({
    environmentKey: env,
    useCase,
    responseMode,
    pushedAuthorization: authzMethod === "pushed",
    nonce: NONCE,
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
          <button
            type="button"
            onClick={() =>
              window.location.assign(
                `/?${settingsToQuery({ env, responseMode, authzMethod })}`,
              )
            }
            className="group hover:text-primary-30 flex cursor-pointer items-center"
          >
            <ArrowRightIcon className="group-hover:text-primary-30 mr-1 h-[12px] w-[12px] rotate-180" />
            Back to all demos
          </button>
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
                authzMethod={authzMethod}
                environmentKey={env}
                responseMode={responseMode}
                origin={origin}
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
