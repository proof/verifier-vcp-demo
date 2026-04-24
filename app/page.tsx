"use client";
import { useState, useRef, useEffect } from "react";
import { Block } from "./common/block";
import { PillTabs } from "./common/tabs";
import { Dialog } from "./common/dialog";
import { MeshGradient } from "./common/mesh-gradient/mesh-gradient";
import { AuthForm } from "./common/auth_form";
import { MerchantCase } from "./_components/use_cases/merchant-case";
import { WireTransferCase } from "./_components/use_cases/wire-transfer-case";
import { AP2Case } from "./_components/use_cases/ap2-case";
import { ProtocolPanel } from "./_components/protocol-panel";
import {
  parseVPToken,
  isUseCase,
  type ParsedVPToken,
  type UseCase,
} from "./lib/util";
import {
  ENVIRONMENTS,
  REDIRECT_URI,
  type Environment,
} from "./lib/environments";
import { TRANSACTION_DATA } from "./data/transaction_data";

const getEnvFromReferrer = (referrer: string) => {
  if (/\.next\.proof\.com/.test(referrer)) {
    return "next";
  }
  if (/\.staging\.proof\.com/.test(referrer)) {
    return "staging";
  }
  return "fairfax";
};

export default function Home() {
  const [useCase, setUseCase] = useState<UseCase>("merchant");
  const [env, setEnv] = useState<Environment>(() =>
    typeof document !== "undefined"
      ? getEnvFromReferrer(document.referrer)
      : "fairfax",
  );
  const [email, setEmail] = useState("");
  const [presentation, setPresentation] = useState<
    Partial<Record<UseCase, ParsedVPToken>>
  >({});
  const [parseError, setParseError] = useState(false);
  const errorDialogRef = useRef<HTMLDialogElement>(null);
  const [nonce, setNonce] = useState("");
  useEffect(() => {
    // Nonce must be set in an effect to avoid SSR/client mismatch in the Visualizer output.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNonce(crypto.randomUUID());
  }, []);
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const state = params.get("state");
    if (isUseCase(state)) {
      const token = params.get("vp_token");
      // Reading URL state on mount requires an effect since window is not available on the server.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUseCase(state);

      if (token) {
        try {
          setPresentation({ [state]: parseVPToken(token) });
        } catch {
          window.history.replaceState(null, "", window.location.pathname);
          setParseError(true);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (parseError) {
      errorDialogRef.current?.showModal();
    }
  }, [parseError]);

  const dismissError = () => {
    errorDialogRef.current?.close();
    setParseError(false);
  };

  const { endpoint, clientId } = ENVIRONMENTS[env];
  const requestParams = {
    response_type: "vp_token",
    client_id: clientId[useCase],
    redirect_uri: REDIRECT_URI,
    response_mode: 'fragment',
    scope: "urn:proof:params:scope:verifiable-credentials:basic",
    login_hint: email,
    nonce: nonce || "",
    state: useCase,
    transaction_data: TRANSACTION_DATA[useCase],
  };
  const [dismissed, setDismissed] = useState<Set<UseCase>>(new Set());
  const showSuccess = !!presentation[useCase] && !dismissed.has(useCase);
  const handleDismissSuccess = () =>
    setDismissed((prev) => new Set(prev).add(useCase));

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <MeshGradient />
      <Dialog
        title="Authorization failed"
        dialogRef={errorDialogRef}
        onClose={dismissError}
        buttons={[{ key: "dismiss", label: "Dismiss", onClick: dismissError }]}
      >
        <p className="mb-6 text-sm text-gray-400">
          Something went wrong reading the authorization response. Please try
          authorizing again.
        </p>
      </Dialog>
      <main className="flex w-full max-w-6xl flex-1 flex-col px-2 pt-6 pb-6 sm:px-6 sm:pt-16">
        <div className="px-2 sm:px-0">
          <h1 className="sr-only">Proof</h1>
          <img
            className="mt-0 mb-6 h-8 w-auto self-start sm:mt-4 sm:mb-4 sm:h-12"
            src="/proof-logo-full-white.svg"
            alt=""
            aria-hidden="true"
          />
          <p>Demo Proof’s verifiable credential presentation.</p>
        </div>
        <div className="mt-6 mb-0 sm:mt-8 sm:mb-4">
          <PillTabs
            tabs={[
              { key: "merchant", label: "Payment" },
              { key: "wire", label: "Wire Transfer" },
              { key: "ap2", label: "Agent Authorization" },
            ]}
            selectedTab={useCase}
            onChange={setUseCase}
          />
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
                setEmail={setEmail}
                email={email}
                requestParams={requestParams}
                endpoint={endpoint}
              />
            </div>
          </Block>

          <Block id="protocol-block" title="Protocol">
            <ProtocolPanel
              presentation={presentation[useCase] ?? null}
              requestParams={requestParams}
              endpoint={endpoint}
            />
          </Block>
        </div>
      </main>
      <footer className="flex w-full items-center justify-center px-3 pt-4 pb-2 text-xs text-gray-400 backdrop-blur sm:px-6 sm:py-4 sm:pt-6 sm:text-sm">
        <div className="flex flex-wrap items-center justify-center gap-x-4">
          <div className="mb-2 text-center">
            © 2026. Notarize, Inc. dba Proof.com. All&nbsp;rights&nbsp;reserved.
          </div>
          <div className="mb-2">
            <a
              href="https://www.proof.com/legal/general-terms"
              className="ml-4 text-gray-400 transition-colors hover:text-gray-200"
            >
              General Terms
            </a>
            <a
              href="https://www.proof.com/legal/privacy-policy"
              className="ml-4 text-gray-400 transition-colors hover:text-gray-200"
            >
              Privacy Policy
            </a>
            <a
              href="https://www.proof.com/about/accessibility"
              className="ml-4 text-gray-400 transition-colors hover:text-gray-200"
            >
              Accessibility
            </a>
          </div>
          <select
            name="environments"
            aria-label="Endpoint environment:"
            value={env}
            onChange={(e) => setEnv(e.target.value as Environment)}
            className="pointer-cursor mb-2 bg-transparent text-xs text-gray-600 focus:outline-none sm:text-sm"
          >
            {(Object.keys(ENVIRONMENTS) as Environment[]).map((key) => (
              <option key={key} value={key}>
                {ENVIRONMENTS[key].label}
              </option>
            ))}
          </select>
        </div>
      </footer>
    </div>
  );
}
