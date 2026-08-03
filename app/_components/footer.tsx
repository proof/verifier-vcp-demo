"use client";
import {
  RESPONSE_MODES,
  ENVIRONMENTS,
  type EnvironmentKey,
} from "../lib/environments";
import { type ResponseMode } from "@proof.com/proof-vc-web";
import { useDemoSettings } from "./demo-settings-context";
import {
  AUTHORIZATION_METHODS,
  type AuthorizationMethod,
} from "../lib/authorization_methods";
import { JwkModal } from "./jwk-modal";

export function Footer() {
  const {
    env,
    setEnv,
    responseMode,
    setResponseMode,
    authzMethod,
    setAuthzMethod,
    signedRequest,
    setSignedRequest,
  } = useDemoSettings();

  return (
    <footer className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-1 px-3 pt-4 pb-2 text-xs text-gray-400 backdrop-blur sm:px-6 sm:py-4 sm:pt-6">
      <div className="flex flex-wrap items-center gap-x-4 text-left text-[0.65rem]">
        <span>
          © 2026. Notarize, Inc. dba Proof.com. All&nbsp;rights&nbsp;reserved.
        </span>
        <a
          href="https://www.proof.com/legal/general-terms"
          className="text-gray-400 transition-colors hover:text-gray-200"
        >
          General Terms
        </a>
        <a
          href="https://www.proof.com/legal/privacy-policy"
          className="text-gray-400 transition-colors hover:text-gray-200"
        >
          Privacy Policy
        </a>
        <a
          href="https://www.proof.com/about/accessibility"
          className="text-gray-400 transition-colors hover:text-gray-200"
        >
          Accessibility
        </a>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-x-4">
        <select
          name="environments"
          aria-label="Endpoint environment:"
          value={env}
          onChange={(e) => setEnv(e.target.value as EnvironmentKey)}
          className="cursor-pointer bg-transparent text-xs text-gray-600 focus:outline-none sm:text-sm"
        >
          {(Object.keys(ENVIRONMENTS) as EnvironmentKey[]).map((key) => (
            <option key={key} value={key}>
              {ENVIRONMENTS[key].label}
            </option>
          ))}
        </select>
        <select
          name="responseMode"
          aria-label="Response mode:"
          value={responseMode}
          onChange={(e) => setResponseMode(e.target.value as ResponseMode)}
          className="cursor-pointer bg-transparent text-xs text-gray-600 focus:outline-none sm:text-sm"
        >
          {RESPONSE_MODES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <select
          name="authzMethod"
          aria-label="Authorization Request Method:"
          value={authzMethod}
          onChange={(e) =>
            setAuthzMethod(e.target.value as AuthorizationMethod)
          }
          className="cursor-pointer bg-transparent text-xs text-gray-600 focus:outline-none sm:text-sm"
        >
          {(Object.keys(AUTHORIZATION_METHODS) as AuthorizationMethod[]).map(
            (key) => (
              <option key={key} value={key}>
                {AUTHORIZATION_METHODS[key].label}
              </option>
            ),
          )}
        </select>
        <select
          name="signedRequest"
          aria-label="Request object signing:"
          value={signedRequest ? "jar" : "non-jar"}
          onChange={(e) => setSignedRequest(e.target.value === "jar")}
          className="cursor-pointer bg-transparent text-xs text-gray-600 focus:outline-none sm:text-sm"
        >
          <option value="non-jar">non-JAR</option>
          <option value="jar">JAR</option>
        </select>
        <JwkModal />
      </div>
    </footer>
  );
}
