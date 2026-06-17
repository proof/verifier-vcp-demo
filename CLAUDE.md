# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn run dev      # Start dev server (localhost:3000)
yarn run build    # Production build (static export)
yarn run lint     # Run ESLint
yarn run format   # Format with Prettier
```

## Conventions

- Never use `eslint-disable` (or `eslint-disable-next-line`) as a workaround to silence a lint rule. Refactor to a pattern that satisfies the rule instead.

## Architecture

This is a **Next.js App Router** demo — **Verifiable Credentials Presentation Verifier** — showcasing how merchants, financial institutions, and AI agents can use the Proof wallet to request identity-verified authorization from users via OID4VP.

**Tech stack:** Next.js, React 19, TypeScript, Tailwind CSS v4, clsx

### Key Concepts

- **OID4VP flow**: Clicking "Authorize" constructs an authorization request with structured `transaction_data` and redirects to the Proof authorization endpoint. The user verifies their identity in the Proof wallet and is redirected back with a `vp_token` in the URL hash.
- **Transaction data**: Each use case encodes a different schema as base64 and passes it as the `transaction_data` parameter. The encoded payloads live in `app/data/transaction_data.ts`; the corresponding JSON source files are in `app/data/`.
- **Three use cases**: Merchant checkout (`payment-itemized:v1`), Wire transfer (`wire-instructions:v1`), AP2 agentic shopping (`payment-mandate:v1`).
- **Routing**: The landing page (`/`) links to three routes — `/payment`, `/wire`, `/agent-authorization` — each rendered by `Wrapper` with the appropriate `useCase` prop. The landing page also handles OID4VP hash callbacks and redirects them to the correct route.
- **Success state**: A single `dismissed` boolean per `Wrapper` instance, derived from `vp_token` presence after the OID4VP callback.
- **Demo settings**: Environment, response mode, and authorization method are held in `DemoSettingsContext` (provider in `layout.tsx`) and surfaced as selects in the `Footer`.

### Component Structure

```
app/page.tsx                          # Landing page, use case links and OID4VP hash redirect
app/payment/page.tsx                  # Merchant checkout route
app/wire/page.tsx                     # Wire transfer route
app/agent-authorization/page.tsx      # AP2 agent authorization route
app/lib/
  environments.ts                     # API endpoints and client IDs per environment
  util.tsx                            # VP token / SD-JWT parsing helpers
app/data/
  transaction_data.ts                 # Base64-encoded transaction data for each use case
  checkout_mandate.json               # Merchant checkout verifiable credential
  transaction_authorization_request.json  # Wire transfer verifiable credential
  shopping_parameters_mandate.json    # AP2 intent mandate verifiable credential
app/common/
  auth_form.tsx                       # Email input + authorize button
  success_alert.tsx                   # Success overlay with confetti
  visualizer.tsx                      # Expandable JSON tree with copy button
  tabs.tsx                            # Animated tab switcher (sliding indicator, ARIA keyboard nav)
  receipt.tsx                         # Purchase receipt display
  details.tsx                         # Expandable/collapsible section
  block.tsx                           # Layout wrapper with title
  button.tsx                          # Styled button
  code.tsx                            # Inline code/pre block
  dialog.tsx                          # Modal dialog
  icons.tsx                           # SVG icon components
  mesh-gradient/
    mesh-gradient.tsx                 # Animated background gradient
    mesh-gradient.css                 # Gradient styles
app/_components/
  demo-settings-context.tsx           # Context + provider for env/responseMode/authzMethod
  footer.tsx                          # Footer with legal links and demo settings selects
  link-item.tsx                       # Landing page link card and pill link components
  protocol-panel.tsx                  # Authorization request params + VP token response viewer
  use_cases/
    wrapper.tsx                       # Shared OID4VP state, hash parsing, layout for each use case
    merchant-case.tsx                 # Merchant checkout use case
    wire-transfer-case.tsx            # Wire transfer use case
    ap2-case.tsx                      # AP2 agentic shopping use case
```
