import { SuccessAlert } from "../../common/success_alert";
import TAR from "../../data/transaction_authorization_request.json";

const { source, recipient, amount, currency, memo } = TAR.credentialSubject;

export function WireTransferCase({
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
                src="/sterling-and-union.png"
                alt="Sterling & Union logo"
              />
            </span>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs whitespace-nowrap text-gray-400">
              Financial Institution
            </span>
          </div>
          <p className="text-sm text-gray-200">
            Please verify your identity to confirm that you are authorizing this
            wire transfer to{" "}
            <strong className="text-white">{recipient.individual_name}</strong>.
          </p>
          <div className="border-t border-white/10 pt-3 text-sm">
            <ul className="flex flex-col gap-2">
              {[
                [
                  "From",
                  `${source.institution_name} ••••${source.account_number}`,
                ],
                ["From Routing", source.routing_number],
                [
                  "To",
                  `${recipient.individual_name} (${recipient.institution_name})`,
                ],
                ["To Account", `••••${recipient.account_number}`],
                ["To Routing", recipient.routing_number],
                ["Memo", memo],
              ].map(([label, value]) => (
                <li
                  key={label}
                  className="flex justify-between border-b border-white/5 pb-2"
                >
                  <span className="text-gray-400">{label}</span>
                  <span className="text-gray-200">{value}</span>
                </li>
              ))}
              <li className="flex justify-between pt-1 font-bold">
                <span className="text-gray-400">Amount</span>
                <span className="text-white">
                  ${amount.toLocaleString()} {currency}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <SuccessAlert
        showSuccess={showSuccess}
        onDismiss={onDismiss}
        message="You've authorized this wire transfer"
      >
        <ul className="w-full max-w-sm rounded-2xl border border-white text-sm">
          {[
            ["To:", recipient.individual_name],
            ["Amount:", `$${amount.toLocaleString()} ${currency}`],
            ["Memo:", memo],
          ].map(([label, value], i, arr) => (
            <li
              key={label}
              className={`flex justify-between px-4 py-3 ${i < arr.length - 1 ? "border-b border-white" : ""}`}
            >
              <span className="text-white">{label}</span>
              <span className="font-medium">{value}</span>
            </li>
          ))}
        </ul>
      </SuccessAlert>
    </>
  );
}
