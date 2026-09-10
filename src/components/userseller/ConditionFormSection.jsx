import React from "react";
import { CheckCircle2, HelpCircle, FileText, Hash } from "lucide-react";

// เดียวกับ GLASS_PANEL/GLASS_INPUT/CTA_GLASS ที่ใช้ทั้งเว็บ
const GLASS_PANEL =
  "border border-neutral-200/70 bg-white/50 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)]";
const GLASS_INPUT =
  "w-full rounded-xl border border-neutral-300 bg-white/70 backdrop-blur-sm text-neutral-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";
const CTA_GLASS =
  "bg-orange-500 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(249,115,22,0.3)] hover:bg-orange-600";

export default function ConditionFormSection({
  stepRef,
  currentStep,
  questions = [],
  answers = {},
  setAnswers,
  onSubmit,
  loading,
}) {
  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  return (
    <section
      ref={stepRef}
      className={`rounded-3xl p-6 space-y-6 transition-all duration-300 ${GLASS_PANEL} ${
        currentStep < 2 ? "opacity-40 pointer-events-none" : ""
      }`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-neutral-200/70 pb-4">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black text-sm shadow-md shadow-orange-500/20">
            2
          </span>
          <div>
            <h2 className="text-lg font-bold text-neutral-900">
              Item Condition Assessment
            </h2>
            <p className="text-xs text-neutral-500 font-medium">
              Please answer the following assessment questions regarding the
              product condition.
            </p>
          </div>
        </div>
        {currentStep > 2 && (
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
        )}
      </div>

      {currentStep >= 2 && (
        <form onSubmit={onSubmit} className="space-y-4">
          {questions.length === 0 ? (
            <p className="text-sm text-neutral-500 italic py-4 text-center">
              No additional questions for this category. You may proceed to the
              next step.
            </p>
          ) : (
            questions.map((q) => (
              <div
                key={q.id}
                className="p-4 bg-white/40 backdrop-blur-sm border border-neutral-200/70 rounded-2xl space-y-3 transition-all hover:border-orange-200"
              >
                {/* Question Label */}
                <label className="label-text font-bold text-sm text-neutral-900 flex items-start gap-2 leading-relaxed">
                  <HelpCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>
                    {q.label}{" "}
                    {q.isRequired && <span className="text-rose-500">*</span>}
                  </span>
                </label>

                {/* 1. TEXT ANSWER */}
                {q.answerType === "TEXT" && (
                  <div className="relative">
                    <textarea
                      rows={3}
                      className={`${GLASS_INPUT} px-3 py-2 text-xs placeholder:text-neutral-400`}
                      placeholder="Type your response here..."
                      value={answers[q.id] || ""}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      disabled={currentStep > 2}
                      required={q.isRequired}
                    />
                  </div>
                )}

                {/* 2. BOOLEAN ANSWER */}
                {q.answerType === "BOOLEAN" && (
                  <div className="flex items-center gap-4 pt-1">
                    <label className="flex items-center gap-2.5 px-4 py-2 bg-white/60 backdrop-blur-sm border border-neutral-200/70 rounded-xl cursor-pointer text-xs font-semibold hover:border-orange-300 transition-all">
                      <input
                        type="radio"
                        name={`q_${q.id}`}
                        className="radio radio-xs accent-orange-500"
                        checked={answers[q.id] === true}
                        onChange={() => handleAnswerChange(q.id, true)}
                        disabled={currentStep > 2}
                        required={q.isRequired}
                      />
                      <span>Yes / Fully Functional</span>
                    </label>

                    <label className="flex items-center gap-2.5 px-4 py-2 bg-white/60 backdrop-blur-sm border border-neutral-200/70 rounded-xl cursor-pointer text-xs font-semibold hover:border-orange-300 transition-all">
                      <input
                        type="radio"
                        name={`q_${q.id}`}
                        className="radio radio-xs accent-orange-500"
                        checked={answers[q.id] === false}
                        onChange={() => handleAnswerChange(q.id, false)}
                        disabled={currentStep > 2}
                        required={q.isRequired}
                      />
                      <span>No / Defective</span>
                    </label>
                  </div>
                )}

                {/* 3. NUMBER ANSWER */}
                {q.answerType === "NUMBER" && (
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      className={`${GLASS_INPUT} py-2 pl-9 pr-3 text-xs`}
                      placeholder="Enter a number..."
                      value={answers[q.id] ?? ""}
                      onChange={(e) =>
                        handleAnswerChange(
                          q.id,
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                      disabled={currentStep > 2}
                      required={q.isRequired}
                    />
                    <Hash className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                )}

                {/* 4. SELECT ANSWER */}
                {q.answerType === "SELECT" && (
                  <select
                    className={`${GLASS_INPUT} py-2 px-3 text-xs font-medium`}
                    value={answers[q.id] || ""}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    disabled={currentStep > 2}
                    required={q.isRequired}
                  >
                    <option value="" disabled>
                      -- Please Select an Option --
                    </option>
                    {q.options?.map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))
          )}

          {/* Submit Button */}
          {currentStep === 2 && (
            <button
              type="submit"
              disabled={loading}
              className={`w-full cursor-pointer rounded-xl py-2.5 font-bold transition-all mt-4 disabled:cursor-not-allowed disabled:opacity-60 ${CTA_GLASS}`}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Save Condition & Next"
              )}
            </button>
          )}
        </form>
      )}
    </section>
  );
}
