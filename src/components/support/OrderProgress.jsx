import { Check } from "lucide-react";

const STEPS = [
  {
    label: "PAID",
  },
  {
    label: "TO ADMIN",
  },
  {
    label: "INSPECTION",
  },
  {
    label: "TO BUYER",
  },
];

const STATUS_STEP = {
  PENDING: 0,
  AWAITING_PAYMENT: 0,
  PAID: 0,

  SELLER_SHIPPING: 1,

  INSPECTION_PENDING: 2,
  INSPECTING: 2,
  NEEDS_REVIEW: 2,
  VERIFIED: 2,
  REJECTED: 2,

  SHIPPING_TO_BUYER: 3,
  COMPLETED: 3,
};

function OrderProgress({ status }) {
  const currentStep = STATUS_STEP[status] ?? 0;

  const isCancelled = status === "CANCELLED";

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
            Order progress
          </p>

          <h2 className="mt-1 text-lg font-bold text-neutral-900">
            Fulfillment status
          </h2>
        </div>

        <span className="text-xs font-semibold text-neutral-500">
          {formatStatus(status)}
        </span>
      </div>

      <div className="flex items-start">
        {STEPS.map((step, index) => {
          const isCompleted = !isCancelled && index < currentStep;

          const isCurrent = !isCancelled && index === currentStep;

          return (
            <div
              key={step.label}
              className="flex min-w-0 flex-1 items-start last:flex-none"
            >
              <div className="flex min-w-16 flex-col items-center">
                <span
                  className={`flex size-8 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isCompleted
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : isCurrent
                        ? "border-orange-500 bg-orange-500 text-white shadow-[0_0_0_4px_rgba(249,115,22,0.12)]"
                        : "border-neutral-300 bg-white text-neutral-400"
                  }`}
                >
                  {isCompleted ? (
                    <Check size={16} strokeWidth={3} />
                  ) : (
                    <span className="text-xs font-bold">{index + 1}</span>
                  )}
                </span>

                <span
                  className={`mt-2 text-center text-[10px] font-bold tracking-wide sm:text-xs ${
                    isCurrent
                      ? "text-orange-600"
                      : isCompleted
                        ? "text-emerald-600"
                        : "text-neutral-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {index < STEPS.length - 1 && (
                <div
                  className={`mt-4 h-0.5 min-w-4 flex-1 transition-colors duration-300 ${
                    index < currentStep ? "bg-emerald-500" : "bg-neutral-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function formatStatus(status) {
  if (!status) {
    return "-";
  }

  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default OrderProgress;
