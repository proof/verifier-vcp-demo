import type { NextRequest } from "next/server";
import { createClientIdMetadataDocument } from "@proof.com/proof-vc-server";
import { getPublicJwk } from "@/app/lib/signing_key";
import {
  X401_CLIENT_NAME,
  X401_REDIRECT_URIS,
  cimdClientId,
} from "@/app/lib/x401";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const document = await createClientIdMetadataDocument({
    environment: "sandbox",
    clientId: cimdClientId(request),
    clientName: X401_CLIENT_NAME,
    redirectUris: X401_REDIRECT_URIS,
    jwks: [await getPublicJwk()],
  });
  return Response.json(document);
}
