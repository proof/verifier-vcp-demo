# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build (static export)
npm run lint     # Run ESLint
npm run format   # Format with Prettier (includes Tailwind class sorting)
```

## Architecture

This is a **Next.js App Router** demo — **Verifiable Credentials Presentation Verifier** — showcasing how merchants, financial institutions, and AI agents can use the Proof wallet to request identity-verified authorization from users via OID4VP.

**Tech stack:** Next.js, React 19, TypeScript, Tailwind CSS v4, clsx

### Key Concepts

- **OID4VP flow**: Clicking "Authorize" constructs an authorization request with structured `transaction_data` and redirects to the Proof authorization endpoint. The user verifies their identity in the Proof wallet and is redirected back with a `vp_token` in the URL hash.
- **Transaction data**: Each use case encodes a different schema as base64 and passes it as the `transaction_data` parameter. The encoded payloads live in `app/data/transaction_data.ts`; the corresponding JSON source files are in `app/data/`.
- **Three use cases**: Merchant checkout (`payment-itemized:v1`), Wire transfer (`wire-instructions:v1`), AP2 agentic shopping (`payment-mandate:v1`).
- **Success state**: Derived from `vp_token` presence in the URL hash + per-use-case dismissal tracking (`Set<UseCase>` in `page.tsx`).

### Component Structure

```
app/page.tsx                          # Entry point — tab switcher, OID4VP state, hash parsing
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
  mesh-gradient/
    mesh-gradient.tsx                 # Animated background gradient
    mesh-gradient.css                 # Gradient styles
app/_components/
  protocol-panel.tsx                  # Authorization request params + VP token response viewer
  use_cases/
    merchant-case.tsx                 # Merchant checkout use case
    wire-transfer-case.tsx            # Wire transfer use case
    ap2-case.tsx                      # AP2 agentic shopping use case
```
