export type Environment = "next" | "staging" | "fairfax";

export const ENVIRONMENTS: Record<
  Environment,
  {
    label: string;
    endpoint: string;
    clientId: { merchant: string; ap2: string; wire: string };
  }
> = {
  next: {
    label: "Next",
    endpoint:
      "https://api.next.proof.com/verifiable-credentials/v1/presentation/authorize",
    clientId: { merchant: "caxdw5a7d", ap2: "cabd569jn", wire: "ca3ng8pbd" },
  },
  staging: {
    label: "Staging",
    endpoint:
      "https://api.staging.proof.com/verifiable-credentials/v1/presentation/authorize",
    clientId: { merchant: "cazd76bjn", ap2: "carn6kbzd", wire: "cagnkmwyn" },
  },
  fairfax: {
    label: "Fairfax",
    endpoint:
      "https://api.fairfax.proof.com/verifiable-credentials/v1/presentation/authorize",
    clientId: { merchant: "caqnb6rwn", ap2: "ca6nob9jd", wire: "camdrbpxd" },
  },
};

export const REDIRECT_URI = "https://demo.next.proof.com/";
