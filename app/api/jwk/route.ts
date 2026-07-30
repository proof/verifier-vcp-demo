import { getPublicJwk } from "@/app/lib/signing_key";

export const runtime = "nodejs";

export async function GET() {
  return Response.json(await getPublicJwk());
}
