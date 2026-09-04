const STEPS = [
  { id: 1, label: "จัดส่ง" },
  { id: 2, label: "ชำระเงิน" },
  { id: 3, label: "ยืนยัน" },
];

function CheckoutStepIndicator({ currentStep }) {
  return (
    <div className="mx-auto mb-8 flex w-full max-w-xl items-center justify-between">
      {STEPS.map((step, i) => {
        const isDone = step.id < currentStep;
        const isCurrent = step.id === currentStep;
        const isLineDone = isDone;
        const isLast = i === STEPS.length - 1;

        return (
          <div
            key={step.id}
            className={`flex items-center ${isLast ? "flex-none" : "flex-1"}`}
          >
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  isCurrent
                    ? "bg-neutral-900 text-white"
                    : isDone
                      ? "bg-green-500 text-white"
                      : "bg-neutral-100 text-neutral-400"
                }`}
              >
                {step.id}
              </span>
              <span
                className={`hardware-label normal-case ${
                  isCurrent ? "text-neutral-900" : "text-secondary"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-2 h-px flex-1 ${
                  isLineDone ? "bg-green-500" : "bg-neutral-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default CheckoutStepIndicator;
