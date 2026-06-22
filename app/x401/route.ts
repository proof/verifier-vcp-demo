import crypto from "node:crypto";
import type { NextRequest } from "next/server";
import { HEADER, verifier } from "@proof.com/x401-node";
import { BASIC_SCOPE, verifyToken } from "@/app/lib/x401";
import { originFromRequest } from "@/app/lib/environments";

export const runtime = "nodejs";

const MCP_URL = "https://mcp-sandbox.x401.proof.com/mcp";

function hasValidToken(headerValue: string): boolean {
  try {
    const tokenObject = verifier.decodeTokenObject(headerValue);
    verifyToken(tokenObject.access_token);
    return true;
  } catch {
    return false;
  }
}

const STYLES = `
  :root {
    --default: #000e32;
    --foreground: #ffffff;
    --primary: #0046fa;
    --primary-30: #82bdfa;
    --primary-10: #c2e2ff;
    --elevated: #0b1f3f;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100vh;
    background:
      radial-gradient(60rem 40rem at 20% -10%, rgba(0, 70, 250, 0.35), transparent 60%),
      radial-gradient(50rem 40rem at 100% 0%, rgba(130, 189, 250, 0.18), transparent 55%),
      var(--default);
    color: var(--foreground);
    font-family: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
    line-height: 1.55;
  }
  main { max-width: 52rem; margin: 0 auto; padding: 4rem 1.5rem 5rem; }
  .eyebrow {
    color: var(--primary-30);
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
    margin: 0 0 0.75rem;
  }
  h1 { font-size: 2rem; font-weight: 600; letter-spacing: -0.02em; margin: 0 0 0.75rem; }
  h2 { font-size: 1.15rem; font-weight: 600; margin: 2.5rem 0 0.75rem; }
  p { color: rgba(255, 255, 255, 0.82); margin: 0 0 1rem; }
  a { color: var(--primary-30); }
  .back {
    display: inline-flex; align-items: center; gap: 0.35rem;
    color: var(--primary-30); text-decoration: none; font-size: 0.875rem;
    margin-bottom: 1.5rem;
  }
  .back:hover { color: #ffffff; }
  .card {
    background: linear-gradient(180deg, rgba(0, 50, 176, 0.25), rgba(11, 31, 63, 0.85));
    border: 1px solid rgba(130, 189, 250, 0.18);
    border-radius: 1rem; padding: 1.25rem 1.5rem; margin: 1.5rem 0;
  }
  .status { display: inline-flex; align-items: center; gap: 0.5rem; font-weight: 600; color: var(--primary-10); }
  .badge {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.8rem;
    background: rgba(0, 70, 250, 0.25); border: 1px solid rgba(130, 189, 250, 0.3);
    border-radius: 0.5rem; padding: 0.1rem 0.5rem;
  }
  pre {
    background: #060f24; border: 1px solid rgba(130, 189, 250, 0.18);
    border-radius: 0.625rem; padding: 0.9rem 1rem; overflow-x: auto;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.8rem;
    color: #cfe0ff; margin: 0.5rem 0 1.25rem;
  }
  code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
  ol { color: rgba(255, 255, 255, 0.82); padding-left: 1.25rem; }
  li { margin: 0.35rem 0; }
`;

function shell(title: string, inner: string): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
<style>${STYLES}</style></head><body><main><a class="back" href="/">&larr; Back to all demos</a>${inner}</main></body></html>`;
}

function grantedPage(): string {
  return shell(
    "x401 — Access granted",
    `<p class="eyebrow">x401 protected resource</p>
     <h1>Access granted</h1>
     <p>You presented a valid x401 proof. This is the protected content behind the resource.</p>
     <div class="card"><span class="status">&#10003; Verified presentation accepted</span></div>`,
  );
}

function protectedPage(proofRequired: string, embeddedData: string): string {
  return shell(
    "x401 — Proof required",
    `<p class="eyebrow">For AI agents &middot; x401 protected resource</p>
     <h1>This resource is protected</h1>
     <p>It requires an <strong>x401 verifiable presentation</strong>. An AI agent completes the
     presentation in your Proof wallet and retries with a token to access it.</p>

     <h2>Access it through an AI agent</h2>
     <p>Add Proof's x401 MCP server, then ask your agent to fetch this URL.</p>

     <p><strong>Claude Code</strong></p>
     <pre>claude mcp add --transport http x401 ${MCP_URL}</pre>

     <p><strong>Claude Desktop</strong> (<code>claude_desktop_config.json</code>)</p>
     <pre>{
  "mcpServers": {
    "x401": {
      "type": "http",
      "url": "${MCP_URL}"
    }
  }
}</pre>

     <p><strong>ChatGPT</strong> (Settings &rarr; Connectors &rarr; Add custom connector)</p>
     <pre>Name: x401
Transport: HTTP / Streamable HTTP
URL: ${MCP_URL}</pre>

     <h2>Then</h2>
     <ol>
       <li>Tell your agent to fetch this URL.</li>
       <li>It reads the requirement, completes the presentation in your Proof wallet, and exchanges it for a token.</li>
       <li>It retries with the token and receives the protected content.</li>
     </ol>

     <h2>HTTP "proof-required" header</h2>
     <p>Inspect the network HTTP response to locate the "proof-required" header that will contain the
     following x401 requirement:</p>
     <div class="card">
       <p><span class="status">HTTP 401</span> &nbsp;<span class="badge">${HEADER.PROOF_REQUIRED}</span></p>
       <pre>${proofRequired}</pre>
     </div>
     ${embeddedData}`,
  );
}

export async function GET(request: NextRequest) {
  const origin = originFromRequest(request);

  const presentation = request.headers.get(HEADER.PROOF_PRESENTATION);
  if (presentation && hasValidToken(presentation)) {
    return new Response(grantedPage(), {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  }

  const challenge = {
    value: crypto.randomUUID(),
    expires_at: new Date(Date.now() + 600_000).toISOString(),
  };

  const payload = verifier.buildPayload({
    proof: {
      challenge,
      oauth: { token_endpoint: `${origin}/x401/token-exchange` },
      scope: BASIC_SCOPE,
    },
  });
  const proofRequired = verifier.encodePayload(payload);

  return new Response(
    protectedPage(proofRequired, verifier.embedHtmlData(payload)),
    {
      status: 401,
      headers: {
        "Content-Type": "text/html",
        [HEADER.PROOF_REQUIRED]: proofRequired,
      },
    },
  );
}
