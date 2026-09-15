import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import AiProcessingCard from "../AiProcessingCard";

export default function ProductAiAutofillSection({
  aiImagePreview,
  handleFileSelect,
  handleClearAiImage,
  handleConfirmAiAutofill,
  isFormDisabled,
  isAiLoading,
  isTyping,
  isAiSuccess,
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-amber-500/30 bg-linear-to-br from-amber-500/10 via-white/50 to-orange-500/5 p-5 shadow-md transition-all duration-300 hover:border-amber-500/50 hover:shadow-lg md:p-6">
      <div className="relative z-10 space-y-4">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-start gap-3.5">
            <div className="shrink-0 rounded-xl bg-linear-to-tr from-[#ea580c] to-[#f97316] p-3 text-white">
              <Sparkles className="h-6 w-6" />
            </div>

            <div>
              <h4 className="flex flex-wrap items-center gap-2 text-base font-extrabold text-neutral-900">
                Auto-fill Product Details with AI
                <span className="rounded-full bg-linear-to-r from-amber-500 to-orange-500 px-2 py-0.5 text-[11px] font-bold text-white">
                  Recommended
                </span>
              </h4>

              <p className="mt-1 text-xs text-neutral-500 md:text-sm">
                Select a product image to preview, then confirm for AI to
                identify the product and research its market price.
              </p>
            </div>
          </div>

          {!aiImagePreview && (
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border-none bg-linear-to-r from-[#f97316] to-[#ea580c] px-4 py-2.5 font-bold text-white shadow-md transition hover:from-[#ea580c] hover:to-[#c2410c]">
              <Upload className="h-4 w-4" />

              <span className="text-xs md:text-sm">Select Product Image</span>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          )}
        </div>

        {aiImagePreview && (
          <div className="flex flex-col items-start justify-between gap-4 border-t border-amber-500/20 pt-4 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-center gap-4">
              <div className="relative shrink-0">
                <img
                  src={aiImagePreview}
                  alt="Selected product for AI analysis"
                  className="h-20 w-20 rounded-xl border-2 border-amber-500/60 object-cover"
                />

                <button
                  type="button"
                  onClick={handleClearAiImage}
                  disabled={isFormDisabled}
                  aria-label="Remove selected product image"
                  className="absolute -right-2 -top-2 cursor-pointer rounded-full bg-rose-600 p-1.5 text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="min-w-0">
                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
                  <ImageIcon className="h-4 w-4 shrink-0" />
                  Selected Image
                </span>

                <p className="mt-0.5 text-xs leading-5 text-neutral-500 md:text-sm">
                  {isAiSuccess
                    ? "AI analysis completed. Please review the generated details."
                    : "Confirm to identify the product and research its market price."}
                </p>
              </div>
            </div>

            {isAiSuccess ? (
              <div className="flex shrink-0 items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-600">
                <CheckCircle2 className="h-4.5 w-4.5" />
                Analysis Complete
              </div>
            ) : (
              <button
                type="button"
                onClick={handleConfirmAiAutofill}
                disabled={isFormDisabled}
                className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border-none bg-linear-to-r from-[#f97316] to-[#d97706] px-4 py-2.5 font-extrabold text-white transition hover:from-[#ea580c] hover:to-[#c2410c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isAiLoading || isTyping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}

                <span>
                  {isAiLoading
                    ? "Analyzing..."
                    : isTyping
                      ? "Applying Results..."
                      : "Confirm AI Scan"}
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {(isAiLoading || isTyping) && (
          <motion.div
            key="ai-processing-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-white/70 px-2 backdrop-blur-md"
          >
            <AiProcessingCard
              isAiLoading={isAiLoading}
              isTyping={isTyping}
              isSaving={false}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
