import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import {
  AI_TYPING_RING,
  ERROR_RING,
  INPUT_BASE,
} from "./productBasicForm.constants";
import { formatThb } from "./productBasicForm.utils";

export default function ProductPriceField({
  formData,
  handleChange,
  errors,
  isFormDisabled,
  isAiLoading,
  isTyping,
  marketPrice,
  isAiSuccess,
}) {
  return (
    <div className="form-control w-full">
      <label className="label py-1">
        <span className="label-text font-bold text-neutral-900">
          Price (THB) <span className="text-red-500">*</span>
        </span>
      </label>

      <motion.div
        animate={isTyping || isAiLoading ? { scale: [1, 1.005, 1] } : {}}
        transition={{
          repeat: Infinity,
          duration: 1.2,
          delay: 0.3,
        }}
        className="relative"
      >
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-neutral-400">
          ฿
        </span>

        <input
          type="number"
          name="price"
          min="1"
          max="999999999"
          disabled={isFormDisabled}
          value={formData.price ?? ""}
          onChange={handleChange}
          placeholder="55000"
          className={`${INPUT_BASE} pl-8 transition-all duration-300 ${
            isTyping || isAiLoading ? AI_TYPING_RING : ""
          } ${errors.price ? ERROR_RING : ""}`}
        />
      </motion.div>

      <div className="min-h-12 pt-2" aria-live="polite" aria-atomic="true">
        <AnimatePresence mode="wait" initial={false}>
          {isAiLoading || isTyping ? (
            <motion.p
              key="researching-price"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-1.5 text-xs font-medium text-amber-600"
            >
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Researching current market prices…
            </motion.p>
          ) : marketPrice?.recommendedPrice != null ? (
            <motion.div
              key="market-price"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <p className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-500">
                <Sparkles className="h-3.5 w-3.5 shrink-0 text-orange-500" />

                <span className="font-medium">Suggested</span>

                <span className="font-extrabold text-orange-600">
                  {formatThb(marketPrice.recommendedPrice)}
                </span>
              </p>

              <p className="mt-0.5 text-[11px] leading-4 text-neutral-400">
                Range{" "}
                <span className="font-semibold text-neutral-600">
                  {formatThb(marketPrice.minimumPrice)}
                </span>
                {" – "}
                <span className="font-semibold text-neutral-600">
                  {formatThb(marketPrice.maximumPrice)}
                </span>
                <>
                  <span className="mx-1.5 text-neutral-300">·</span>

                  <span>
                    {marketPrice.basis === "RETAIL_DEPRECIATION"
                      ? "Estimated from current retail pricing"
                      : "Based on current second-hand market data"}
                  </span>
                </>
              </p>
            </motion.div>
          ) : isAiSuccess ? (
            <motion.p
              key="price-unavailable"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-xs text-neutral-400"
            >
              No reliable market estimate was found. Enter your own price.
            </motion.p>
          ) : (
            <motion.p
              key="price-idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-xs text-neutral-400"
            >
              AI market guidance appears after image analysis.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {errors.price && (
        <span className="mt-1 text-xs font-medium text-red-500">
          {errors.price}
        </span>
      )}
    </div>
  );
}
