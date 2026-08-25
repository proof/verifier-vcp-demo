import { type Environment, type ResponseMode } from "@proof.com/proof-vc-web";

export const RESPONSE_MODES: Array<ResponseMode> = ["fragment", "direct_post"];
export type EnvironmentKey = "localhost" | "next" | "staging" | "fairfax";
type UseCaseMap = { merchant: string; ap2: string; wire: string };
export const ENVIRONMENTS: Record<
  EnvironmentKey,
  {
    label: string;
    environment: Environment;
    clientId: UseCaseMap;
    clientSecret: UseCaseMap;
  }
> = {
  localhost: {
    label: "localhost",
    environment: "localhost",
    clientId: { merchant: "cay6ej55p", ap2: "cay6ej55p", wire: "cay6ej55p" },
    clientSecret: {
      merchant: "779b9042-24be-4af6-998a-e697e1d1af2c",
      ap2: "779b9042-24be-4af6-998a-e697e1d1af2c",
      wire: "779b9042-24be-4af6-998a-e697e1d1af2c",
    },
  },
  next: {
    label: "Next",
    environment: "next",
    clientId: { merchant: "caxdw5a7d", ap2: "cabd569jn", wire: "ca3ng8pbd" },
    clientSecret: {
      merchant: "5cd353a6-b880-49f3-b2c3-59aa800351b2",
      ap2: "f2d592a4-792d-425c-b4e6-a22706b39364",
      wire: "23860ce8-a862-4ad9-87c2-95c81d5f2a9e",
    },
  },
  staging: {
    label: "Staging",
    environment: "staging",
    clientId: { merchant: "cazd76bjn", ap2: "carn6kbzd", wire: "cagnkmwyn" },
    clientSecret: {
      merchant: "3235c645-7bd1-42b8-81f5-2145312fe6a4",
      ap2: "b0d73eed-2acc-4dff-bb07-b2fc47a0a433",
      wire: "fe21458a-fa1f-47f2-93e0-223e9c25a99d",
    },
  },
  fairfax: {
    label: "Fairfax",
    environment: "sandbox",
    clientId: { merchant: "caqnb6rwn", ap2: "ca6nob9jd", wire: "camdrbpxd" },
    clientSecret: {
      merchant: "0ae23fe0-1212-45a6-8d77-0883b72d7c79",
      ap2: "216d2d97-eafb-4261-af25-5c728b7313bf",
      wire: "fb0a6d35-0123-4033-90ea-e1ad60423f87",
    },
  },
};

export const ENVIRONMENT_KEYS: EnvironmentKey[] = (
  Object.keys(ENVIRONMENTS) as EnvironmentKey[]
).filter(
  (key) => key !== "localhost" || process.env.NODE_ENV === "development",
);

export const isEnvironmentKey = (
  value: string | null | undefined,
): value is EnvironmentKey =>
  typeof value === "string" && (ENVIRONMENT_KEYS as string[]).includes(value);

export const API_HOSTS: Record<Environment, string> = {
  localhost: "https://api.local.dev-notarize.com",
  next: "https://api.next.proof.com",
  staging: "https://api.staging.proof.com",
  sandbox: "https://api.fairfax.proof.com",
  production: "https://api.proof.com",
};

export const apiBaseUrl = (environmentKey: EnvironmentKey): string =>
  API_HOSTS[ENVIRONMENTS[environmentKey].environment];

export const CREDENTIAL_OFFER_ID = "00000000-0000-0000-0000-000000000001";

export const credentialOfferUrl = (environmentKey: EnvironmentKey): string =>
  `${apiBaseUrl(environmentKey)}/verifiable-credentials/v1/issuance/credential-offers/${CREDENTIAL_OFFER_ID}`;

const FALLBACK_ORIGIN = "https://demo.next.proof.com";

export const callbackURI = (
  origin: string,
  responseMode: ResponseMode,
): string => (responseMode === "fragment" ? origin : `${origin}/api/verify`);

export const subscribeOrigin = (): (() => void) => () => {};

export const originSnapshot = (): string => window.location.origin;

export const originServerSnapshot = (): string => FALLBACK_ORIGIN;

export const originFromRequest = (request: Request): string => {
  const host = request.headers.get("host");
  if (!host) {
    return FALLBACK_ORIGIN;
  }
  const isLocal = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host);
  return `${isLocal ? "http" : "https"}://${host}`;
};
