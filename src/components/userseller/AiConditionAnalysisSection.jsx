import React from "react";
import { CheckCircle2, Bot, Sparkles } from "lucide-react";

// เดียวกับ GLASS_PANEL/CTA_GLASS ที่ใช้ทั้งเว็บ
const GLASS_PANEL =
  "border border-neutral-200/70 bg-white/50 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)]";
const CTA_GLASS =
  "bg-orange-500 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(249,115,22,0.3)] hover:bg-orange-600";

export default function AiConditionAnalysisSection({
  stepRef,
  currentStep,
  onAnalyze,
  aiResult,
  loading,
}) {
  return (
    <section
      ref={stepRef}
      className={`rounded-3xl p-6 space-y-6 transition-all duration-300 ${GLASS_PANEL} ${
        currentStep < 4 ? "opacity-40 pointer-events-none" : ""
      }`}
    >
      <div className="flex items-center justify-between border-b border-neutral-200/70 pb-4">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm">
            4
          </span>
          <h2 className="text-xl font-bold text-neutral-900">
            AI Condition Analysis
          </h2>
        </div>
        {currentStep > 4 && (
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
        )}
      </div>

      {currentStep >= 4 && (
        <div className="space-y-4">
          {currentStep === 4 && !aiResult && (
            <div className="text-center py-4 space-y-3">
              <p className="text-sm text-neutral-500">
                The system will send all item details and images to the AI to
                evaluate the grade and overall condition score.
              </p>
              <button
                type="button"
                onClick={onAnalyze}
                disabled={loading}
                className={`w-full cursor-pointer rounded-xl py-2.5 font-bold flex items-center justify-center gap-2 transition disabled:cursor-not-allowed disabled:opacity-60 ${CTA_GLASS}`}
              >
                {loading ? (
                  <span className="loading loading-spinner" />
                ) : (
                  <>
                    <Bot className="w-5 h-5" /> Analyze with AI
                  </>
                )}
              </button>
            </div>
          )}

          {aiResult && (
            <div className="p-5 bg-orange-500/10 border border-orange-500/30 rounded-2xl space-y-3">
              <div className="flex justify-between items-center border-b border-orange-500/20 pb-2">
                <span className="font-bold text-orange-500 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Estimated Condition:{" "}
                  {aiResult.estimatedCondition}
                </span>
                <span className="rounded-full bg-orange-500 text-white font-black text-sm px-3 py-1.5">
                  {aiResult.estimatedScore} / 100 PTS
                </span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {aiResult.summary}
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
