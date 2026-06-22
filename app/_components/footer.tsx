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

export function Footer() {
  const {
    env,
    setEnv,
    responseMode,
    setResponseMode,
    authzMethod,
    setAuthzMethod,
  } = useDemoSettings();

  return (
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
          onChange={(e) => setEnv(e.target.value as EnvironmentKey)}
          className="mb-2 cursor-pointer bg-transparent text-xs text-gray-600 focus:outline-none sm:text-sm"
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
          className="mb-2 cursor-pointer bg-transparent text-xs text-gray-600 focus:outline-none sm:text-sm"
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
          className="mb-2 cursor-pointer bg-transparent text-xs text-gray-600 focus:outline-none sm:text-sm"
        >
          {(Object.keys(AUTHORIZATION_METHODS) as AuthorizationMethod[]).map(
            (key) => (
              <option key={key} value={key}>
                {AUTHORIZATION_METHODS[key].label}
              </option>
            ),
          )}
        </select>
      </div>
    </footer>
  );
}
