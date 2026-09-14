import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { CTA_GLASS } from "./productBasicForm.constants";

export default function ProductFormSubmitButton({
  handleFormSubmit,
  isFormDisabled,
  loading,
  isAiLoading,
  isTyping,
}) {
  return (
    <div className="flex justify-end pt-3 border-t border-neutral-200/70">
      <button
        type="button"
        onClick={handleFormSubmit}
        disabled={isFormDisabled}
        className={`cursor-pointer px-8 rounded-xl py-2.5 font-bold w-full sm:w-auto overflow-hidden relative transition disabled:cursor-not-allowed disabled:opacity-60 ${CTA_GLASS}`}
      >
        <AnimatePresence mode="wait">
          {loading || isAiLoading || isTyping ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>
                {isAiLoading
                  ? "AI Scanning"
                  : isTyping
                    ? "AI Typing"
                    : "Saving"}
              </span>
              <span className="flex items-center gap-0.5 ml-0.5">
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                >
                  .
                </motion.span>
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                >
                  .
                </motion.span>
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                >
                  .
                </motion.span>
              </span>
            </motion.div>
          ) : (
            <motion.span
              key="idle"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              Next ➔
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
