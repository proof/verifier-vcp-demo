# Verifiable Credentials Presentation Verifier

A demo app showcasing how merchants, financial institutions and AI agents can use the [Proof](https://proof.com) wallet to request identity-verified authorization from users via OID4VP.

Play with the demo at https://demo.next.proof.com and read the [developer documentation](https://proof-digital-credentials.readme.io/docs/authorization-request).

## Protocols

[OID4VP](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html) (OpenID for Verifiable Presentations) is an open standard for requesting verifiable credential presentations from a digital wallet. The initiating party constructs an authorization request containing structured transaction data, which the Proof wallet presents to the user for review. The user verifies their identity and authorizes the transaction, and the wallet redirects back with a signed VP token proving the authorization occurred.

[AP2](https://github.com/google-agentic-commerce/AP2) (Agent Payments Protocol) extends this flow to agentic use cases — an AI agent acting on a user's behalf includes a payment mandate in the transaction data, scoping what the agent is authorized to do (merchant, category, spending limit).

## Use Cases

This demo covers 3 transaction types, each using a different transaction data schema:

| Use Case             | Schema                                                      |
| -------------------- | ----------------------------------------------------------- |
| Merchant checkout    | `urn:proof:params:vc:transaction-data:payment-itemized:v1`  |
| Wire transfer        | `urn:proof:params:vc:transaction-data:wire-instructions:v1` |
| AP2 agentic shopping | `urn:proof:params:vc:transaction-data:payment-mandate:v1`   |

## Getting Started

### Using Nix
To facilitate development and cross-platform compatibility, this project uses [Nix](https://nixos.org/) and [direnv](https://direnv.net/).
```bash
direnv allow
just dev      # http://localhost:3050
```

### Using NPM
```bash
npm install
npm run dev      # http://localhost:3050
```

## Commands
### Using Nix
| Command          | Description                      |
|------------------| -------------------------------- |
| `just dev`       | Start the dev server             |
| `just build`  | Production build (static export) |
| `just lint`   | Run ESLint                       |
| `just format` | Format with Prettier             |
### Using NPM
| Command          | Description                      |
| ---------------- | -------------------------------- |
| `npm run dev`    | Start the dev server             |
| `npm run build`  | Production build (static export) |
| `npm run lint`   | Run ESLint                       |
| `npm run format` | Format with Prettier             |

## Project Structure

```
app/
  page.tsx                        # Entry point — tab switcher, OID4VP state, hash parsing
  lib/
    environments.ts               # API endpoints and client IDs per environment
    util.ts                       # VP token parsing helpers
  data/
    transaction_data.ts           # Base64-encoded transaction data for each use case
    checkout_mandate.json         # Merchant checkout verifiable credential
    transaction_authorization_request.json  # Wire transfer verifiable credential
    shopping_parameters_mandate.json        # AP2 intent mandate verifiable credential
  common/                         # Shared UI components
  _components/
    use_cases/                    # One component per use case (merchant, wire, ap2)
    protocol-panel.tsx            # Authorization request params + VP token response viewer
```

## Deployment

The app builds as a static export (`out/`) and is deployed via AWS Amplify. The `amplify.yml` at the root configures the build. To deploy your own instance, point Amplify at this repo and set the redirect URI (`REDIRECT_URI` in `environments.ts`) to your deployment URL.
