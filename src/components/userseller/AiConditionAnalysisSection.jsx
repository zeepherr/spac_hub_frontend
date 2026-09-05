import React from "react";
import { CheckCircle2, Bot, Sparkles } from "lucide-react";

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
      className={`bg-base-100 p-6 rounded-box border border-base-300 shadow-sm space-y-6 transition-all duration-300 ${
        currentStep < 4 ? "opacity-40 pointer-events-none" : ""
      }`}
    >
      <div className="flex items-center justify-between border-b border-base-300 pb-4">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-sm">
            4
          </span>
          <h2 className="text-xl font-bold text-base-content">AI Condition Analysis</h2>
        </div>
        {currentStep > 4 && <CheckCircle2 className="w-6 h-6 text-success" />}
      </div>

      {currentStep >= 4 && (
        <div className="space-y-4">
          {currentStep === 4 && !aiResult && (
            <div className="text-center py-4 space-y-3">
              <p className="text-sm text-base-content/70">
                The system will send all item details and images to the AI to evaluate the grade and overall condition score.
              </p>
              <button
                type="button"
                onClick={onAnalyze}
                disabled={loading}
                className="btn btn-accent text-accent-content font-bold w-full rounded-field gap-2"
              >
                {loading ? <span className="loading loading-spinner" /> : <><Bot className="w-5 h-5" /> Analyze with AI</>}
              </button>
            </div>
          )}

          {aiResult && (
            <div className="p-5 bg-accent/10 border border-accent/30 rounded-field space-y-3">
              <div className="flex justify-between items-center border-b border-accent/20 pb-2">
                <span className="font-bold text-accent flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Estimated Condition: {aiResult.estimatedCondition}
                </span>
                <span className="badge badge-accent font-black text-sm p-3">
                  {aiResult.estimatedScore} / 100 PTS
                </span>
              </div>
              <p className="text-xs text-base-content/80 leading-relaxed">{aiResult.summary}</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}