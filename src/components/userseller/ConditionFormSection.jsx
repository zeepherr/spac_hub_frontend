import React from "react";
import { CheckCircle2, HelpCircle, FileText, Hash } from "lucide-react";

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
      className={`bg-base-100 p-6 rounded-3xl border border-base-200/80 shadow-sm space-y-6 transition-all duration-300 ${
        currentStep < 2 ? "opacity-40 pointer-events-none" : ""
      }`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-base-200 pb-4">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black text-sm shadow-md shadow-orange-500/20">
            2
          </span>
          <div>
            <h2 className="text-lg font-bold text-base-content">
              Item Condition Assessment
            </h2>
            <p className="text-xs text-base-content/60 font-medium">
              Please answer the following assessment questions regarding the product condition.
            </p>
          </div>
        </div>
        {currentStep > 2 && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
      </div>

      {currentStep >= 2 && (
        <form onSubmit={onSubmit} className="space-y-4">
          {questions.length === 0 ? (
            <p className="text-sm text-base-content/60 italic py-4 text-center">
              No additional questions for this category. You may proceed to the next step.
            </p>
          ) : (
            questions.map((q) => (
              <div
                key={q.id}
                className="p-4 bg-base-200/40 border border-base-200 rounded-2xl space-y-3 transition-all hover:border-base-300"
              >
                {/* Question Label */}
                <label className="label-text font-bold text-sm text-base-content flex items-start gap-2 leading-relaxed">
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
                      className="textarea textarea-bordered w-full rounded-xl text-xs bg-base-100 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/10 placeholder:text-base-content/40 transition-all"
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
                    <label className="flex items-center gap-2.5 px-4 py-2 bg-base-100 border border-base-200 rounded-xl cursor-pointer text-xs font-semibold hover:border-orange-500/50 transition-all">
                      <input
                        type="radio"
                        name={`q_${q.id}`}
                        className="radio radio-warning radio-xs accent-orange-500"
                        checked={answers[q.id] === true}
                        onChange={() => handleAnswerChange(q.id, true)}
                        disabled={currentStep > 2}
                        required={q.isRequired}
                      />
                      <span>Yes / Fully Functional</span>
                    </label>

                    <label className="flex items-center gap-2.5 px-4 py-2 bg-base-100 border border-base-200 rounded-xl cursor-pointer text-xs font-semibold hover:border-orange-500/50 transition-all">
                      <input
                        type="radio"
                        name={`q_${q.id}`}
                        className="radio radio-warning radio-xs accent-orange-500"
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
                      className="input input-bordered input-sm w-full rounded-xl pl-9 text-xs bg-base-100 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/10 transition-all"
                      placeholder="Enter a number..."
                      value={answers[q.id] ?? ""}
                      onChange={(e) =>
                        handleAnswerChange(
                          q.id,
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      disabled={currentStep > 2}
                      required={q.isRequired}
                    />
                    <Hash className="w-3.5 h-3.5 text-base-content/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                )}

                {/* 4. SELECT ANSWER */}
                {q.answerType === "SELECT" && (
                  <select
                    className="select select-bordered select-sm w-full rounded-xl text-xs bg-base-100 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/10 transition-all font-medium"
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
              className="btn bg-orange-500 hover:bg-orange-600 text-white w-full rounded-xl font-bold border-none shadow-md shadow-orange-500/20 transition-all mt-4"
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