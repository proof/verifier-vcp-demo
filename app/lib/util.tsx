type Disclosure = { salt: string; claim: string; value: unknown };

export type ParsedSDJWT = {
  vcPayload: Record<string, unknown>;
  disclosures: Disclosure[];
  kbJwtPayload: Record<string, unknown> | null;
};
export type ParsedVPToken = Record<string, ParsedSDJWT[]>;
export type UseCase = "merchant" | "wire" | "ap2";

const USE_CASES: UseCase[] = ["merchant", "wire", "ap2"];

const decodeBase64Url = (str: string): unknown =>
  JSON.parse(atob(str.replace(/-/g, "+").replace(/_/g, "/")));

export const parseSDJWT = (token: string): ParsedSDJWT => {
  if (!token.includes("~")) {
    // Handle the correct vp_token format as per https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#section-8.1
    const credentials = decodeBase64Url(token) as Record<string, string[]>;
    token = credentials["proof_id_default"][0];
  }

  const segments = token.split("~");
  const [jwt, ...rest] = segments;
  const disclosureSegments = rest.filter(Boolean);

  const lastSegment = disclosureSegments[disclosureSegments.length - 1];
  const hasKbJwt = lastSegment?.includes(".");
  const disclosureParts = hasKbJwt
    ? disclosureSegments.slice(0, -1)
    : disclosureSegments;
  const kbJwtSegment = hasKbJwt ? lastSegment : null;

  const vcPayload = decodeBase64Url(jwt.split(".")[1]) as Record<
    string,
    unknown
  >;

  const disclosures = disclosureParts.map((d) => {
    const [salt, claim, value] = decodeBase64Url(d) as [
      string,
      string,
      unknown,
    ];
    return { salt, claim, value };
  });

  const kbJwtPayload = kbJwtSegment
    ? (decodeBase64Url(kbJwtSegment.split(".")[1]) as Record<string, unknown>)
    : null;

  return { vcPayload, disclosures, kbJwtPayload };
};

export const parseVPToken = (raw: string): ParsedVPToken => {
  let parsed: Record<string, string[]>;
  try {
    parsed = decodeBase64Url(decodeURIComponent(raw)) as Record<
      string,
      string[]
    >;
  } catch {
    return { default: [parseSDJWT(raw)] };
  }
  const entries = Object.entries(parsed);
  return Object.fromEntries(
    entries.map(([id, tokens]) => [id, tokens.map(parseSDJWT)]),
  );
};

export const isUseCase = (value: string | null): value is UseCase =>
  USE_CASES.includes(value as UseCase);
