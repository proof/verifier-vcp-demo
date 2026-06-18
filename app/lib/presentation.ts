import { rotateNonce, type UseCase } from "./util";

export type Presentation = { vpToken: string; result: Record<string, unknown> };

type Outcome = { presentation: Presentation } | { error: string };

const fetchVPToken = async (responseCode: string): Promise<string> => {
  const response = await fetch(`/api/search?response_code=${responseCode}`);
  if (!response.ok) throw new Error(`fetch token failed: ${response.status}`);
  const json = await response.json();
  return json["vp_token"];
};

const verifyVPToken = async (
  token: string,
  nonce: string,
): Promise<Record<string, unknown>> => {
  const response = await fetch("/api/verify_vp_token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vp_token: token, nonce }),
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(
      typeof json?.error === "string"
        ? json.error
        : `verification failed: ${response.status}`,
    );
  }
  return json;
};

let returnHash: string | null = null;

export function captureReturnHash(hash: string): void {
  returnHash = hash;
}

export async function consumePresentationFromHash(
  useCase: UseCase,
): Promise<Outcome | null> {
  if (!returnHash) return null;

  const params = new URLSearchParams(returnHash);
  const state = params.get("state");
  const responseCode = params.get("response_code");
  const vpToken = params.get("vp_token");

  if ((!vpToken && !responseCode) || state !== useCase) return null;

  returnHash = null;

  const previousNonce = rotateNonce();
  if (!previousNonce) return { error: "missing nonce" };

  try {
    const token = vpToken ?? (await fetchVPToken(responseCode!));
    const result = await verifyVPToken(token, previousNonce);
    return { presentation: { vpToken: token, result } };
  } catch (cause) {
    return { error: cause instanceof Error ? cause.message : String(cause) };
  }
}
