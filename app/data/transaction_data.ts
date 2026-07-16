import { transactionData, type TransactionData } from "@proof.com/proof-vc-server";
import { type UseCase } from "@/app/lib/util";
import { TRANSACTION_PAYLOADS } from "./transaction_payloads";

export const TRANSACTION_DATA: Record<UseCase, TransactionData> = {
  merchant: transactionData.paymentItemized(TRANSACTION_PAYLOADS.merchant),
  wire: transactionData.wireInstructions(TRANSACTION_PAYLOADS.wire),
  ap2: transactionData.paymentMandate(TRANSACTION_PAYLOADS.ap2),
};
