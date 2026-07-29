"use client";
import { useState, useSyncExternalStore } from "react";
import { Block } from "../../common/block";
import { Button } from "../../common/button";
import { Code } from "../../common/code";
import { MeshGradient } from "../../common/mesh-gradient/mesh-gradient";
import { ArrowRightIcon } from "../../common/icons";
import { Footer } from "../../_components/footer";
import {
  settingsToQuery,
  useDemoSettings,
} from "../../_components/demo-settings-context";
import { apiBaseUrl } from "../../lib/environments";

const OFFER_ID = "00000000-0000-0000-0000-000000000001";
const OID4VCI_PROTOCOL = "openid4vci-v1";
const CHROME_FLAG = "chrome://flags/#web-identity-digital-credentials-creation";
const FLAG_HINT = `The Digital Credentials API for credential issuance is not enabled in this browser. Enable ${CHROME_FLAG} and reload the page.`;

type DcApiStatus = "supported" | "unsupported";

type DigitalCredentialsCreator = {
  create: (options: {
    digital: { requests: Array<{ protocol: string; data: unknown }> };
  }) => Promise<unknown>;
};

// The presence of `DigitalCredential` tells us the Digital Credentials API
// exists. It does not tell us whether the creation flag is on — that isn't
// reliably detectable, so we let the actual create() call surface it.
const getDcApiSnapshot = (): DcApiStatus =>
  "DigitalCredential" in window ? "supported" : "unsupported";

/**
 * Parses an OID4VCI Credential Offer URI and extracts the JSON credential offer.
 *
 * Handles two formats:
 * - Inline: `openid-credential-offer://?credential_offer={...json...}`
 * - Reference: `openid-credential-offer://?credential_offer_uri=https://...` (fetches the JSON)
 */
async function parseCredentialOfferUri(credentialOfferUri: string): Promise<unknown> {
  const url = new URL(credentialOfferUri);
  const inlineOffer = url.searchParams.get("credential_offer");
  if (inlineOffer) {
    return JSON.parse(inlineOffer);
  }
  const offerUri = url.searchParams.get("credential_offer_uri");
  if (offerUri) {
    const response = await fetch(offerUri);
    if (!response.ok) {
      throw new Error(`Failed to fetch credential offer from ${offerUri}: ${response.status}`);
    }
    return response.json();
  }
  throw new Error(
    "Credential offer URI has neither credential_offer nor credential_offer_uri parameter",
  );
}

export function IssuanceCase() {
  const { env, responseMode, authzMethod } = useDemoSettings();

  const offerUrl = `${apiBaseUrl(env)}/verifiable-credentials/v1/issuance/credential-offers/${OFFER_ID}`;
  const offerUri = `openid-credential-offer://?credential_offer_uri=${encodeURIComponent(offerUrl)}`;

  const dcApiStatus = useSyncExternalStore<DcApiStatus | null>(
    () => () => {},
    getDcApiSnapshot,
    () => null,
  );
  const [issuing, setIssuing] = useState(false);
  const [status, setStatus] = useState<{
    kind: "success" | "error";
    message: string;
  } | null>(null);

  const handleIssue = async () => {
    setStatus(null);
    setIssuing(true);
    try {
      const credentialOfferData = await parseCredentialOfferUri(offerUri);
      const creator = navigator.credentials as unknown as DigitalCredentialsCreator;
      await creator.create({
        digital: {
          requests: [
            { protocol: OID4VCI_PROTOCOL, data: credentialOfferData },
          ],
        },
      });
      setStatus({
        kind: "success",
        message: "Credential offer sent to your wallet.",
      });
    } catch (error) {
      const raw = error instanceof Error ? error.message : "Issuance failed.";
      const flagOff = /password|federated|publickey|not\s*supported|digital/i.test(
        raw,
      );
      setStatus({
        kind: "error",
        message: flagOff ? FLAG_HINT : raw,
      });
    } finally {
      setIssuing(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <MeshGradient />
      <main className="flex w-full max-w-6xl flex-1 flex-col px-2 pt-4 pb-6 sm:px-6 sm:pt-8">
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
        <div className="mt-4 grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <Block title="Before you start">
            <ul className="flex flex-col gap-3 text-sm font-light">
              {dcApiStatus === null && (
                <li className="flex items-start">
                  <div className="ring-primary/25 mt-[7px] mr-3 h-[8px] w-[8px] flex-none rounded-full bg-[var(--primary-50)] ring-4" />
                  <span>Checking Digital Credentials API support…</span>
                </li>
              )}
              {dcApiStatus === "unsupported" && (
                <li className="flex items-start">
                  <div className="mt-[7px] mr-3 h-[8px] w-[8px] flex-none rounded-full bg-red-400 ring-4 ring-red-400/25" />
                  <span>
                    The Digital Credentials API isn&apos;t available here. Use
                    Chromium 143 or later.
                  </span>
                </li>
              )}
              <li className="flex items-start">
                <div className="ring-primary/25 mt-[7px] mr-3 h-[8px] w-[8px] flex-none rounded-full bg-[var(--primary-50)] ring-4" />
                <span>
                  Works only on Chromium 143+ and an Android phone with Google
                  Play services 24.0+.
                </span>
              </li>
              <li className="flex items-start">
                <div className="ring-primary/25 mt-[7px] mr-3 h-[8px] w-[8px] flex-none rounded-full bg-[var(--primary-50)] ring-4" />
                <div className="flex flex-col">
                  <span>Enable the credential-issuance flag, then relaunch:</span>
                  <Code label="Chromium flag" wrap>
                    {CHROME_FLAG}
                  </Code>
                </div>
              </li>
              <li className="flex items-start">
                <div className="ring-primary/25 mt-[7px] mr-3 h-[8px] w-[8px] flex-none rounded-full bg-[var(--primary-50)] ring-4" />
                <span>
                  Install the demo{" "}
                  <a
                    href="/CMWallet.apk"
                    download
                    className="text-primary-30 hover:text-white"
                  >
                    CMWallet.apk
                  </a>{" "}
                  on your Android phone and open it once.
                </span>
              </li>
            </ul>
          </Block>
          <Block title="Credential Offer">
            <Code label="Credential Offer URI" wrap>
              {dcApiStatus === null ? "…" : offerUri}
            </Code>
            <div className="mt-4 flex flex-col items-center gap-3">
              <Button
                onClick={handleIssue}
                size="sm"
                disabled={issuing || dcApiStatus !== "supported"}
                loading={issuing}
              >
                {issuing ? "Issuing…" : "Issue Credential"}
              </Button>
              {status && (
                <p
                  className={`text-sm ${status.kind === "success" ? "text-primary-30" : "text-red-400"}`}
                >
                  {status.message}
                </p>
              )}
            </div>
          </Block>
        </div>
      </main>
      <Footer />
    </div>
  );
}
