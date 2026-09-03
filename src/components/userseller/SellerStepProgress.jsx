import React from "react";
import { Save, Check, Sparkles } from "lucide-react";

export default function SellerStepProgress({ currentStep, onSaveDraft, savingDraft, listingId }) {
  const steps = [
    { id: 1, label: "ข้อมูลพื้นฐาน", desc: "ชื่อ, หมวดหมู่, ราคา" },
    { id: 2, label: "คำถามสภาพ", desc: "ตอบตามความเป็นจริง" },
    { id: 3, label: "รูปภาพสินค้า", desc: "สูงสุด 5 รูป" },
    { id: 4, label: "วิเคราะห์ AI", desc: "ประเมินเกรดอัตโนมัติ" },
    { id: 5, label: "เผยแพร่", desc: "ตรวจสอบและลงขาย" },
  ];

  return (
    <div className="w-full bg-base-100 rounded-2xl border border-base-200 p-4 md:p-5 shadow-xs mb-8 transition-all">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* Step Flow List */}
        <div className="flex items-center justify-between w-full lg:flex-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <React.Fragment key={step.id}>
                {/* Individual Step Item */}
                <div className="flex items-center gap-3 shrink-0">
                  {/* Step Indicator Circle */}
                  <div
                    className={`flex size-10 items-center justify-center rounded-xl font-bold text-sm transition-all duration-300 shadow-xs ${
                      isCompleted
                        ? "bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/30"
                        : isCurrent
                        ? "bg-linear-to-r from-[#f97316] to-[#ea580c] text-white shadow-md shadow-[#f97316]/25 scale-105"
                        : "bg-base-200/80 text-base-content/40 border border-base-300"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="size-5 stroke-[2.5]" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>

                  {/* Step Label & Subtitle */}
                  <div className="flex flex-col">
                    <span
                      className={`text-sm tracking-tight font-bold transition-colors ${
                        isCurrent
                          ? "text-base-content font-extrabold"
                          : isCompleted
                          ? "text-[#f97316]"
                          : "text-base-content/50"
                      }`}
                    >
                      {step.label}
                    </span>
                    <span className="text-[11px] text-base-content/50 hidden sm:inline-block">
                      {step.desc}
                    </span>
                  </div>
                </div>

                {/* Connecting Line  */}
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-3 hidden sm:block min-w-5 max-w-20">
                    <div
                      className={`h-0.5 w-full rounded-full transition-all duration-300 ${
                        currentStep > step.id
                          ? "bg-[#f97316]"
                          : "bg-base-300"
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Action Button: Save Draft  */}
        <div className="shrink-0 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-base-200 flex justify-end">
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={savingDraft || !listingId}
            className={`btn btn-sm md:btn-md rounded-xl font-bold transition-all duration-200 gap-2 border w-full lg:w-auto ${
              !listingId
                ? "bg-base-200 text-base-content/40 border-base-300 cursor-not-allowed"
                : "bg-base-100 hover:bg-[#f97316]/10 text-[#f97316] border-[#f97316]/40 hover:border-[#f97316] shadow-xs active:scale-95"
            }`}
          >
            {savingDraft ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              <Save className="size-4 stroke-2" />
            )}
            <span>{savingDraft ? "กำลังบันทึก..." : "บันทึกแบบร่าง (Save Draft)"}</span>
          </button>
        </div>

      </div>
    </div>
  );
}