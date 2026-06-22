"use client";
import { createContext, useContext, useState } from "react";
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
};

const DemoSettingsContext = createContext<DemoSettings | null>(null);

const PARAM = {
  env: "env",
  responseMode: "responseMode",
  authzMethod: "authzMethod",
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
}): string => {
  const params = new URLSearchParams();
  params.set(PARAM.env, settings.env);
  params.set(PARAM.responseMode, settings.responseMode);
  params.set(PARAM.authzMethod, settings.authzMethod);
  return params.toString();
};

const syncUrl = (settings: {
  env: EnvironmentKey;
  responseMode: ResponseMode;
  authzMethod: AuthorizationMethod;
}): void => {
  if (typeof window === "undefined") return;
  const url = `${window.location.pathname}?${settingsToQuery(settings)}${
    window.location.hash
  }`;
  window.history.replaceState(null, "", url);
};

export function DemoSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [env, setEnvState] = useState<EnvironmentKey>(() => {
    const param = searchParams()?.get(PARAM.env) ?? null;
    if (isEnvironmentKey(param)) return param;
    return typeof document !== "undefined"
      ? getEnvFromReferrer(document.referrer)
      : "fairfax";
  });
  const [responseMode, setResponseModeState] = useState<ResponseMode>(() => {
    const param = searchParams()?.get(PARAM.responseMode) ?? null;
    return isResponseMode(param) ? param : "direct_post";
  });
  const [authzMethod, setAuthzMethodState] = useState<AuthorizationMethod>(
    () => {
      const param = searchParams()?.get(PARAM.authzMethod) ?? null;
      return isAuthorizationMethod(param) ? param : "pushed";
    },
  );

  const setEnv = (value: EnvironmentKey) => {
    setEnvState(value);
    syncUrl({ env: value, responseMode, authzMethod });
  };
  const setResponseMode = (value: ResponseMode) => {
    setResponseModeState(value);
    syncUrl({ env, responseMode: value, authzMethod });
  };
  const setAuthzMethod = (value: AuthorizationMethod) => {
    setAuthzMethodState(value);
    syncUrl({ env, responseMode, authzMethod: value });
  };

  return (
    <DemoSettingsContext.Provider
      value={{
        env,
        setEnv,
        responseMode,
        setResponseMode,
        authzMethod,
        setAuthzMethod,
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
