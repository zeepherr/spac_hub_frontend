import React from "react";
import { Save, Check, Sparkles } from "lucide-react";

// เดียวกับ GLASS_PANEL ที่ใช้ทั้งเว็บ
const GLASS_PANEL =
  "border border-neutral-200/70 bg-white/50 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)]";

export default function SellerStepProgress({
  currentStep,
  onSaveDraft,
  savingDraft,
  listingId,
}) {
  const steps = [
    { id: 1, label: "Basic Info", desc: "Title, category, price" },
    { id: 2, label: "Condition QA", desc: "Answer accurately" },
    { id: 3, label: "Product Images", desc: "Up to 5 photos" },
    { id: 4, label: "AI Analysis", desc: "Auto grade assessment" },
    { id: 5, label: "Publish", desc: "Review and list item" },
  ];

  return (
    <div
      className={`w-full rounded-2xl p-4 md:p-5 mb-8 transition-all ${GLASS_PANEL}`}
    >
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Step Flow List */}
        <div className="flex items-center justify-between w-full lg:flex-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <React.Fragment key={step.id}>
                <div className="flex items-center gap-3 shrink-0">
                  <div
                    className={`flex size-10 items-center justify-center rounded-xl font-bold text-sm transition-all duration-300 shadow-xs ${
                      isCompleted
                        ? "bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/30"
                        : isCurrent
                          ? "bg-linear-to-r from-[#f97316] to-[#ea580c] text-white shadow-md shadow-[#f97316]/25 scale-105"
                          : "bg-neutral-100 text-neutral-400 border border-neutral-200/70"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="size-5 stroke-[2.5]" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <span
                      className={`text-sm tracking-tight font-bold transition-colors ${
                        isCurrent
                          ? "text-neutral-900 font-extrabold"
                          : isCompleted
                            ? "text-[#f97316]"
                            : "text-neutral-400"
                      }`}
                    >
                      {step.label}
                    </span>
                    <span className="text-[11px] text-neutral-400 hidden sm:inline-block">
                      {step.desc}
                    </span>
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className="flex-1 mx-3 hidden sm:block min-w-5 max-w-20">
                    <div
                      className={`h-0.5 w-full rounded-full transition-all duration-300 ${
                        currentStep > step.id
                          ? "bg-[#f97316]"
                          : "bg-neutral-200"
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Action Button: Save Draft  */}
        <div className="shrink-0 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-neutral-200/70 flex justify-end">
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={savingDraft || !listingId}
            className={`cursor-pointer rounded-xl px-4 py-2 md:py-2.5 text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 border w-full lg:w-auto disabled:cursor-not-allowed ${
              !listingId
                ? "bg-neutral-100 text-neutral-400 border-neutral-200/70"
                : "bg-white/60 backdrop-blur-sm hover:bg-[#f97316]/10 text-[#f97316] border-[#f97316]/40 hover:border-[#f97316] shadow-xs active:scale-95"
            }`}
          >
            {savingDraft ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              <Save className="size-4 stroke-2" />
            )}
            <span>{savingDraft ? "Saving..." : "Save Draft"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
