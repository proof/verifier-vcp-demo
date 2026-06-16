import crypto from "node:crypto";

const TOKEN_SECRET = "x401-demo-token-secret-do-not-use-in-production";

export const BASIC_SCOPE =
  "urn:proof:params:scope:verifiable-credentials:basic";

export const TOKEN_TTL_SECONDS = 3600;

function base64url(input: Buffer): string {
  return input.toString("base64url");
}

function hmac(payload: string): Buffer {
  return crypto.createHmac("sha256", TOKEN_SECRET).update(payload).digest();
}

interface TokenClaims {
  sub: string;
}

export function signToken(claims: TokenClaims): string {
  const body = {
    ...claims,
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
  };
  const encoded = base64url(Buffer.from(JSON.stringify(body)));
  const signature = base64url(hmac(encoded));
  return `${encoded}.${signature}`;
}

export function verifyToken(token: string): TokenClaims {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) {
    throw new Error("malformed access token");
  }

  const expected = base64url(hmac(encoded));
  const expectedBuf = Buffer.from(expected);
  const signatureBuf = Buffer.from(signature);
  if (
    expectedBuf.length !== signatureBuf.length ||
    !crypto.timingSafeEqual(expectedBuf, signatureBuf)
  ) {
    throw new Error("invalid access token signature");
  }

  const body = JSON.parse(
    Buffer.from(encoded, "base64url").toString(),
  ) as TokenClaims & {
    exp: number;
  };
  if (
    typeof body.exp !== "number" ||
    body.exp < Math.floor(Date.now() / 1000)
  ) {
    throw new Error("access token expired");
  }

  return { sub: body.sub };
}
