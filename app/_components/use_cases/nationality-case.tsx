import { SuccessAlert } from "../../common/success_alert";

function Card() {
  return (
    <div className="bg-elevated mb-2 flex flex-col rounded-lg border border-white/15 p-4 shadow-xl">
      <div className="my-2 flex items-center gap-2">
        <span>
          <img
            className="max-h-6 w-auto self-start"
            src="/aetheon.png"
            alt="Aetheon AI logo"
          />
        </span>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs whitespace-nowrap text-gray-400">
          AI Model
        </span>
      </div>
      <div className="mt-2 flex flex-col">
        <h3 className="mb-4 text-xl font-bold">Ready to explore Gable 5?</h3>
        <p>
          To give you full access to Gable inside AetheonAI, we just need a
          quick, secure confirmation of your US nationality?
        </p>
      </div>
    </div>
  );
}

export function NationalityCase({
  showSuccess,
  onDismiss,
}: {
  showSuccess?: boolean;
  onDismiss?: () => void;
}) {
  return (
    <>
      <div className="mt-4 flex flex-col">
        <Card />
      </div>
      <SuccessAlert
        showSuccess={showSuccess}
        onDismiss={onDismiss}
        message="You’ve shared your US nationality status with  AetheonAI and can now access their latest model"
      />
    </>
  );
}
