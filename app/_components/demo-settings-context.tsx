"use client";
import { createContext, useContext, useState } from "react";
import { type EnvironmentKey } from "../lib/environments";
import { type ResponseMode } from "@proof.com/proof-vc-web";
import { type AuthorizationMethod } from "../lib/authorization_methods";

type DemoSettings = {
  env: EnvironmentKey;
  setEnv: (env: EnvironmentKey) => void;
  responseMode: ResponseMode;
  setResponseMode: (mode: ResponseMode) => void;
  authzMethod: AuthorizationMethod;
  setAuthzMethod: (method: AuthorizationMethod) => void;
};

const DemoSettingsContext = createContext<DemoSettings | null>(null);

const getEnvFromReferrer = (referrer: string): EnvironmentKey => {
  if (/\.next\.proof\.com/.test(referrer)) {
    return "next";
  }
  if (/\.staging\.proof\.com/.test(referrer)) {
    return "staging";
  }
  return "fairfax";
};

export function DemoSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [env, setEnv] = useState<EnvironmentKey>(() =>
    typeof document !== "undefined"
      ? getEnvFromReferrer(document.referrer)
      : "fairfax",
  );
  const [responseMode, setResponseMode] = useState<ResponseMode>("direct_post");
  const [authzMethod, setAuthzMethod] = useState<AuthorizationMethod>("pushed");

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
