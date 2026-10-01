import type { NextRequest } from "next/server";
import { HTML_HEADERS, MCP_URLS, instructionsPage } from "@/app/x401/page_html";
import { apiBaseUrl } from "@/app/lib/environments";
import { protectedResourceUrl, x401Context } from "@/app/lib/x401";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const context = x401Context(request);
  return new Response(
    instructionsPage({
      mcpUrl: MCP_URLS[context.environmentKey],
      apiHost: apiBaseUrl(context.environmentKey),
      protectedUrl: protectedResourceUrl(request),
    }),
    { headers: HTML_HEADERS },
  );
}
