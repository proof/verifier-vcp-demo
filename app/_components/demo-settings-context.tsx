"use client";
import { createContext, useContext, useSyncExternalStore } from "react";
import {
  ENVIRONMENTS,
  RESPONSE_MODES,
  type EnvironmentKey,
} from "../lib/environments";
import { type ResponseMode } from "@proof.com/proof-vc-web";
import {
  AUTHORIZATION_METHODS,
  type AuthorizationMethod,
} from "../lib/authorization_methods";

type DemoSettings = {
  env: EnvironmentKey;
  setEnv: (env: EnvironmentKey) => void;
  responseMode: ResponseMode;
  setResponseMode: (mode: ResponseMode) => void;
  authzMethod: AuthorizationMethod;
  setAuthzMethod: (method: AuthorizationMethod) => void;
  signedRequest: boolean;
  setSignedRequest: (signed: boolean) => void;
};

const DemoSettingsContext = createContext<DemoSettings | null>(null);

const PARAM = {
  env: "env",
  responseMode: "responseMode",
  authzMethod: "authzMethod",
  signedRequest: "signedRequest",
} as const;

const getEnvFromReferrer = (referrer: string): EnvironmentKey => {
  if (/\.next\.proof\.com/.test(referrer)) {
    return "next";
  }
  if (/\.staging\.proof\.com/.test(referrer)) {
    return "staging";
  }
  return "fairfax";
};

const isEnvironmentKey = (value: string | null): value is EnvironmentKey =>
  value !== null && Object.prototype.hasOwnProperty.call(ENVIRONMENTS, value);

const isResponseMode = (value: string | null): value is ResponseMode =>
  value !== null && (RESPONSE_MODES as string[]).includes(value);

const isAuthorizationMethod = (
  value: string | null,
): value is AuthorizationMethod =>
  value !== null &&
  Object.prototype.hasOwnProperty.call(AUTHORIZATION_METHODS, value);

const searchParams = (): URLSearchParams | null =>
  typeof window === "undefined"
    ? null
    : new URLSearchParams(window.location.search);

export const settingsToQuery = (settings: {
  env: EnvironmentKey;
  responseMode: ResponseMode;
  authzMethod: AuthorizationMethod;
  signedRequest: boolean;
}): string => {
  const params = new URLSearchParams();
  params.set(PARAM.env, settings.env);
  params.set(PARAM.responseMode, settings.responseMode);
  params.set(PARAM.authzMethod, settings.authzMethod);
  params.set(PARAM.signedRequest, String(settings.signedRequest));
  return params.toString();
};

const listeners = new Set<() => void>();

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const writeParam = (key: string, value: string): void => {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  params.set(key, value);
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}?${params.toString()}${window.location.hash}`,
  );
  for (const listener of listeners) {
    listener();
  }
};

const envSnapshot = (): EnvironmentKey => {
  const param = searchParams()?.get(PARAM.env) ?? null;
  if (isEnvironmentKey(param)) return param;
  return typeof document !== "undefined"
    ? getEnvFromReferrer(document.referrer)
    : "fairfax";
};

const responseModeSnapshot = (): ResponseMode => {
  const param = searchParams()?.get(PARAM.responseMode) ?? null;
  return isResponseMode(param) ? param : "direct_post";
};

const authzMethodSnapshot = (): AuthorizationMethod => {
  const param = searchParams()?.get(PARAM.authzMethod) ?? null;
  return isAuthorizationMethod(param) ? param : "pushed";
};

const signedRequestSnapshot = (): boolean =>
  searchParams()?.get(PARAM.signedRequest) === "true";

export function DemoSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const env = useSyncExternalStore(
    subscribe,
    envSnapshot,
    (): EnvironmentKey => "fairfax",
  );
  const responseMode = useSyncExternalStore(
    subscribe,
    responseModeSnapshot,
    (): ResponseMode => "direct_post",
  );
  const authzMethod = useSyncExternalStore(
    subscribe,
    authzMethodSnapshot,
    (): AuthorizationMethod => "pushed",
  );
  const signedRequest = useSyncExternalStore(
    subscribe,
    signedRequestSnapshot,
    () => false,
  );

  const setEnv = (value: EnvironmentKey) => writeParam(PARAM.env, value);
  const setResponseMode = (value: ResponseMode) =>
    writeParam(PARAM.responseMode, value);
  const setAuthzMethod = (value: AuthorizationMethod) =>
    writeParam(PARAM.authzMethod, value);
  const setSignedRequest = (value: boolean) =>
    writeParam(PARAM.signedRequest, String(value));

  return (
    <DemoSettingsContext.Provider
      value={{
        env,
        setEnv,
        responseMode,
        setResponseMode,
        authzMethod,
        setAuthzMethod,
        signedRequest,
        setSignedRequest,
      }}
    >
      {children}
    </DemoSettingsContext.Provider>
  );
}

export function useDemoSettings() {
  const ctx = useContext(DemoSettingsContext);
  if (!ctx)
    throw new Error("useDemoSettings must be used within DemoSettingsProvider");
  return ctx;
}
