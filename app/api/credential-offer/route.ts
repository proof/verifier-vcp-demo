import type { NextRequest } from "next/server";
import {
  credentialOfferUrl,
  isEnvironmentKey,
} from "@/app/lib/environments";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const environmentKey = request.nextUrl.searchParams.get("environmentKey");

  if (!isEnvironmentKey(environmentKey)) {
    return Response.json({ error: "invalid environment" }, { status: 400 });
  }

  const offerUrl = credentialOfferUrl(environmentKey);

  try {
    const response = await fetch(offerUrl);
    if (!response.ok) {
      return Response.json(
        {
          error: `Failed to fetch credential offer from ${offerUrl}: ${response.status}`,
        },
        { status: 502 },
      );
    }
    return Response.json(await response.json());
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 502 });
  }
}
