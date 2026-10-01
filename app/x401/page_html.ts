import type { EnvironmentKey } from "@/app/lib/environments";

export const MCP_URLS: Record<EnvironmentKey, string> = {
  localhost: "http://localhost:3080/mcp",
  next: "https://mcp.next.proof.com/mcp",
  staging: "https://mcp.staging.proof.com/mcp",
  fairfax: "https://mcp.fairfax.proof.com/mcp",
};

export const HTML_HEADERS = { "content-type": "text/html; charset=utf-8" };

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
  pre {
    background: #060f24; border: 1px solid rgba(130, 189, 250, 0.18);
    border-radius: 0.625rem; padding: 0.9rem 1rem; overflow-x: auto;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.8rem;
    color: #cfe0ff; margin: 0.5rem 0 1.25rem;
  }
  code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
`;

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

function shell(title: string, inner: string): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
<style>${STYLES}</style></head><body><main><a class="back" href="/">&larr; Back to all demos</a>${inner}</main></body></html>`;
}

export function grantedPage(claims: unknown): string {
  const claimsJson = escapeHtml(JSON.stringify(claims ?? {}, null, 2));
  return shell(
    "x401 — Access granted",
    `<p class="eyebrow">x401 protected resource</p>
     <h1>Access granted</h1>
     <p>You presented a valid x401 proof. This is the protected content behind the resource.</p>
     <div class="card"><span class="status">&#10003; Verified presentation accepted</span></div>
     <h2>Verified credential claims</h2>
     <pre>${claimsJson}</pre>`,
  );
}

export function instructionsPage({
  mcpUrl,
  apiHost,
  protectedUrl,
}: {
  mcpUrl: string;
  apiHost: string;
  protectedUrl: string;
}): string {
  return shell(
    "x401 for Agents",
    `<p class="eyebrow">For AI agents &middot; x401</p>
     <h1>x401 for Agents</h1>
     <p>Proof enables AI agents to access x401 protected resources, learn more about the x401
     protocol at <a href="https://x401.id">x401.id</a>.</p>

     <h2>Configure x401 in your agents</h2>

     <p><strong>Claude Code</strong></p>
     <pre>claude mcp add --transport http proof ${mcpUrl}</pre>

     <p><strong>Claude Desktop / ChatGPT</strong> (Settings &rarr; Connectors &rarr; Add custom connector)</p>
     <pre>Name: proof
Transport: HTTP / Streamable HTTP
URL: ${mcpUrl}</pre>

     <p><strong>Meta Muse AI</strong></p>
     <p>Muse AI doesn't need the MCP, learn skills directly at
     <a href="${escapeHtml(apiHost)}">${escapeHtml(apiHost)}</a>.</p>

     <h2>Try it</h2>
     <p>Ask your agent to fetch this x401 protected resource:</p>
     <pre>${escapeHtml(protectedUrl)}</pre>`,
  );
}
