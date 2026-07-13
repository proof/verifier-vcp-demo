import { DEFAULT_CREDENTIAL_ID } from "@proof.com/proof-vc-common";
import type {
  PaymentItemizedPayload,
  WireInstructionsPayload,
  PaymentMandatePayload,
} from "@proof.com/proof-vc-server";
import { type UseCase } from "@/app/lib/util";

type Payloads = {
  merchant: PaymentItemizedPayload;
  wire: WireInstructionsPayload;
  ap2: PaymentMandatePayload;
};

export const TRANSACTION_PAYLOADS: Payloads = {
  merchant: {
    title: "Drive Shaft",
    description: "The Roadhouse (18+), May 6 2026",
    currency: "USD",
    items: [
      { quantity: 2, unit_cost: 40.0, label: "General Admission" },
      { quantity: 2, unit_cost: 11.4, label: "Fees" },
    ],
  },
  wire: {
    recipient: {
      institution_name: "Crestline Financial",
      individual_name: "Acme Corp LLC",
      routing_number: "055000123",
      account_number: "7293",
    },
    source: {
      institution_name: "Sterling & Union",
      individual_name: "Sterling & Union",
      account_number: "4821",
      routing_number: "091000456",
    },
    amount: 5000,
    currency: "USD",
    memo: "Invoice #2024-089",
  },
  ap2: {
    payment_instrument: {
      type: "wallet",
      id: "did:example:visa-token-7829",
      description: "Visa ••••7829",
    },
    payee: {
      id: "did:example:summitco",
      name: "Summit Co",
      website: "summitco.com",
    },
    prompt_summary:
      "Find me a 4-season backpacking tent from Summit Co under $500",
    amount: 500,
    currency: "USD",
  },
};

const TX_DATA_TYPE: Record<UseCase, string> = {
  merchant: "urn:proof:params:vc:transaction-data:payment-itemized:v1",
  wire: "urn:proof:params:vc:transaction-data:wire-instructions:v1",
  ap2: "urn:proof:params:vc:transaction-data:payment-mandate:v1",
};

export const transactionDataPreview = (useCase: UseCase) => ({
  type: TX_DATA_TYPE[useCase],
  credential_ids: [DEFAULT_CREDENTIAL_ID],
  payload: TRANSACTION_PAYLOADS[useCase],
});
