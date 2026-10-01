import type { NextRequest } from "next/server";
import type { Environment } from "@proof.com/proof-vc-common";
import {
  API_HOSTS,
  ENVIRONMENTS,
  isEnvironmentKey,
  originFromRequest,
  type EnvironmentKey,
} from "@/app/lib/environments";

export const X401_CLIENT_NAME = "Proof x401 demo";
export const X401_SCOPE = "urn:proof:params:scope:verifiable-credentials:basic";

const DEFAULT_ENVIRONMENT_KEY: EnvironmentKey = "fairfax";
const CIMD_PATH = "/x401/client";
const PROTECTED_PATH = "/x401/protected";

export const agentsTrustListUrl = (environment: Environment): string =>
  `${API_HOSTS[environment]}/.well-known/agents-trust-list`;

export const X401_REDIRECT_URIS = [
  ...new Set(
    Object.values(ENVIRONMENTS).map((env) =>
      agentsTrustListUrl(env.environment),
    ),
  ),
];

export type X401Context = {
  environmentKey: EnvironmentKey;
  environment: Environment;
  clientId: string;
};

export function cimdClientId(request: NextRequest): string {
  return new URL(CIMD_PATH, originFromRequest(request)).toString();
}

export function protectedResourceUrl(request: NextRequest): string {
  const url = new URL(PROTECTED_PATH, originFromRequest(request));
  url.search = request.nextUrl.search;
  return url.toString();
}

export function x401Context(request: NextRequest): X401Context {
  const envParam = request.nextUrl.searchParams.get("env");
  const environmentKey = isEnvironmentKey(envParam)
    ? envParam
    : DEFAULT_ENVIRONMENT_KEY;
  return {
    environmentKey,
    environment: ENVIRONMENTS[environmentKey].environment,
    clientId: cimdClientId(request),
  };
}
