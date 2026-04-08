import type { ReactNode } from "react";
import { Visualizer } from "../../common/visualizer";
import { Details } from "../../common/details";
import { SuccessAlert } from "../../common/success_alert";
import SHOPPING_PARAMETERS_MANDATE from "../../data/shopping_parameters_mandate.json";

const { shopping_intent, prompt_summary } =
  SHOPPING_PARAMETERS_MANDATE.credentialSubject;

const Chat = ({ messages }: { messages: ReactNode[] }) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-gray-950 px-4 py-6">
      {messages.map((message, i) => {
        const isEven = !(i % 2);
        return (
          <div
            key={i}
            className={`flex ${isEven ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`relative max-w-xs rounded-lg p-3 text-sm ${isEven ? "rounded-br-none bg-slate-700" : "rounded-bl-none bg-blue-300"}`}
            >
              <p
                className={`text-sm ${isEven ? "text-gray-200" : "text-gray-900"}`}
              >
                {message}
              </p>
              <div
                className={`absolute bottom-0 h-4 w-3 ${isEven ? "-right-2 bg-slate-700" : "-left-2 bg-blue-300"}`}
              />
              <div
                className={`absolute -bottom-1 h-6 w-4 bg-gray-950 ${isEven ? "-right-4 rounded-bl-full" : "-left-4 rounded-br-full"}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

function AgentCard() {
  return (
    <div className="bg-elevated flex flex-col gap-3 rounded-lg border border-white/15 p-4 shadow-xl">
      <div className="my-2 flex items-center gap-2">
        <span>
          <img
            className="max-h-6 w-auto self-start"
            src="/orion.png"
            alt="Orion AI logo"
          />
        </span>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs whitespace-nowrap text-gray-400">
          AI Shopping Agent
        </span>
      </div>
      <Chat
        messages={[
          prompt_summary,
          <>
            I can find that for you. Please verify your identity to authorize me
            to shop on your behalf at{" "}
            <strong>{shopping_intent.merchant}</strong>.
          </>,
        ]}
      />
      <div className="mt-2 flex flex-col gap-1">
        <Details label="Intent Mandate">
          <Visualizer data={SHOPPING_PARAMETERS_MANDATE} />
        </Details>
      </div>
    </div>
  );
}

export function AP2Case({
  showSuccess,
  onDismiss,
}: {
  showSuccess?: boolean;
  onDismiss?: () => void;
}) {
  return (
    <>
      <div className="flex flex-col gap-4">
        <AgentCard />
      </div>
      <SuccessAlert
        showSuccess={showSuccess}
        onDismiss={onDismiss}
        message="You've authorized Orion to shop on your behalf"
      >
        <ul className="w-full max-w-sm rounded-2xl border border-white text-sm">
          {[
            ["Merchant:", shopping_intent.merchant],
            ["Category:", shopping_intent.category],
            [
              "Max amount:",
              `$${shopping_intent.max_amount.value.toLocaleString()} ${shopping_intent.max_amount.currency}`,
            ],
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
