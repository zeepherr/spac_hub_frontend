import React from "react";
import { Rocket, FileText } from "lucide-react";

// เดียวกับ GLASS_PANEL ที่ใช้ทั้งเว็บ
const GLASS_PANEL =
  "border border-neutral-200/70 bg-white/50 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)]";
const SUCCESS_CTA_GLASS =
  "bg-emerald-500 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(16,185,129,0.3)] hover:bg-emerald-600";

export default function PublishStepSection({
  stepRef,
  currentStep,
  onOpenSummaryModal,
  loading,
}) {
  return (
    <section
      ref={stepRef}
      className={`rounded-3xl p-6 space-y-6 transition-all duration-300 ${GLASS_PANEL} ${
        currentStep < 5 ? "opacity-40 pointer-events-none" : ""
      }`}
    >
      <div className="flex items-center gap-3 border-b border-neutral-200/70 pb-4">
        <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm">
          5
        </span>
        <h2 className="text-xl font-bold text-neutral-900">
          Review Product Details
        </h2>
      </div>

      {currentStep === 5 && (
        <div className="space-y-3">
          <button
            onClick={onOpenSummaryModal}
            disabled={loading}
            className={`w-full cursor-pointer rounded-xl py-3 font-black text-lg flex items-center justify-center gap-2 transition-all disabled:cursor-not-allowed disabled:opacity-60 ${SUCCESS_CTA_GLASS}`}
          >
            {loading ? (
              <span className="loading loading-spinner" />
            ) : (
              <>
                <FileText className="w-6 h-6" /> Summary & Confirm Listing
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
}
