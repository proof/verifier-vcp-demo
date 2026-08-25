import type { JWK } from "jose";

const ALG = "ES256" as const;

const PRIVATE_JWK: JWK = {
  kty: "EC",
  crv: "P-256",
  x: "_cA1yYCnz1W-E9L4z8H9j6WKra7-3I845qnby3a4lKg",
  y: "aWddxr616x3dz9WbAMA55_91ajnZuidleqnVPe0t794",
  d: "UlJL_hCDyxl1k6kCCJm7G0EpJZvdWAm5hftS3BV9-28",
  alg: ALG,
  use: "sig",
  kid: "vsm5F9TWPT3bl3KwyOv2lgSLM2JAz8UEJKIdfcUhG7s",
};

const PUBLIC_JWK: JWK = {
  kty: PRIVATE_JWK.kty,
  crv: PRIVATE_JWK.crv,
  x: PRIVATE_JWK.x,
  y: PRIVATE_JWK.y,
  alg: PRIVATE_JWK.alg,
  use: PRIVATE_JWK.use,
  kid: PRIVATE_JWK.kid,
};

export async function getPrivateJwk(): Promise<JWK> {
  return PRIVATE_JWK;
}

export async function getPublicJwk(): Promise<JWK> {
  return PUBLIC_JWK;
}
