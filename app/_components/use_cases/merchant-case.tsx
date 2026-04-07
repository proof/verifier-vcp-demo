"use client";
import { Receipt } from "../../common/receipt";
import { Visualizer } from "../../common/visualizer";
import { Details } from "../../common/details";
import CHECKOUT_MANDATE from "../../data/checkout_mandate.json";
import { SuccessAlert } from "../../common/success_alert";

export function MerchantCase({
  showSuccess,
  onDismiss,
}: {
  showSuccess?: boolean;
  onDismiss?: () => void;
}) {
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="bg-elevated flex flex-col gap-3 rounded-lg border border-white/15 p-4 shadow-xl">
          <div className="mt-2 flex items-center gap-2">
            <span>
              <img
                className="max-h-6 w-auto self-start"
                src="/rectangle-ticketing.png"
                alt="Rectangle ticketing and events logo"
              />
            </span>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs whitespace-nowrap text-gray-400">
              Ticket Vendor
            </span>
          </div>
          <p className="text-sm text-gray-200">
            Verify your identity to complete your ticket purchase.
          </p>
          <Receipt
            lineItems={CHECKOUT_MANDATE.credentialSubject.lineItems}
            totals={CHECKOUT_MANDATE.credentialSubject.totals}
          />
          <Details label="Checkout Mandate">
            <Visualizer data={CHECKOUT_MANDATE} />
          </Details>
        </div>
      </div>
      <SuccessAlert
        showSuccess={showSuccess}
        onDismiss={onDismiss}
        lineItems={CHECKOUT_MANDATE.credentialSubject.lineItems}
        totals={CHECKOUT_MANDATE.credentialSubject.totals}
      />
    </>
  );
}
