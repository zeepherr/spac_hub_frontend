import React from "react";
import { CheckCircle2, HelpCircle } from "lucide-react";

export default function ConditionFormSection({
  stepRef,
  currentStep,
  questions,
  answers,
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
      className={`bg-base-100 p-6 rounded-box border border-base-300 shadow-sm space-y-6 transition-all duration-300 ${
        currentStep < 2 ? "opacity-40 pointer-events-none" : ""
      }`}
    >
      <div className="flex items-center justify-between border-b border-base-300 pb-4">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-sm">
            2
          </span>
          <h2 className="text-xl font-bold text-base-content">Item Condition Assessment</h2>
        </div>
        {currentStep > 2 && <CheckCircle2 className="w-6 h-6 text-success" />}
      </div>

      {currentStep >= 2 && (
        <form onSubmit={onSubmit} className="space-y-4">
          {questions.length === 0 ? (
            <p className="text-sm text-base-content/60 italic">No additional questions for this category. You may proceed to the next step.</p>
          ) : (
            questions.map((q) => (
              <div key={q.id} className="p-4 bg-base-200/50 rounded-field space-y-2">
                <label className="label-text font-bold text-base-content flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-primary" />
                  {q.label} {q.isRequired && <span className="text-error">*</span>}
                </label>

                {/* BOOLEAN ANSWER */}
                {q.answerType === "BOOLEAN" && (
                  <div className="flex gap-6 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                      <input
                        type="radio"
                        name={`q_${q.id}`}
                        className="radio radio-primary radio-sm"
                        checked={answers[q.id] === true}
                        onChange={() => handleAnswerChange(q.id, true)}
                        disabled={currentStep > 2}
                      />
                      <span>Yes / Fully Functional</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                      <input
                        type="radio"
                        name={`q_${q.id}`}
                        className="radio radio-primary radio-sm"
                        checked={answers[q.id] === false}
                        onChange={() => handleAnswerChange(q.id, false)}
                        disabled={currentStep > 2}
                      />
                      <span>No / Defective</span>
                    </label>
                  </div>
                )}

                {/* SELECT ANSWER */}
                {q.answerType === "SELECT" && (
                  <select
                    className="select select-bordered select-sm w-full rounded-field"
                    value={answers[q.id] || ""}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    disabled={currentStep > 2}
                  >
                    <option value="">-- Please Select --</option>
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

          {currentStep === 2 && (
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full rounded-field font-bold text-white"
            >
              {loading ? <span className="loading loading-spinner" /> : "Save Condition & Next"}
            </button>
          )}
        </form>
      )}
    </section>
  );
}