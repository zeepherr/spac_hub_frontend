import { motion } from "framer-motion";
import { ChevronRight, Layers } from "lucide-react";
import SkeletonLoadingText from "./SkeletonLoadingText";
import {
  AI_TYPING_RING,
  ERROR_RING,
  INPUT_BASE,
} from "./productBasicForm.constants";

export default function ProductInformationFields({
  formData,
  handleChange,
  errors,
  isFormDisabled,
  isAiLoading,
  isTyping,
  selectedCategoryName,
  setIsCategoryModalOpen,
  children,
}) {
  return (
    <>
      <div className="form-control w-full">
        <label className="label py-1 flex items-center justify-between">
          <span className="label-text font-bold text-neutral-900">
            Product Title <span className="text-red-500">*</span>
          </span>
          {(isAiLoading || isTyping) && (
            <SkeletonLoadingText
              text={isTyping ? "AI typing title" : "Analyzing title"}
            />
          )}
        </label>
        <motion.div
          animate={isTyping || isAiLoading ? { scale: [1, 1.005, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1.2 }}
        >
          <input
            type="text"
            name="title"
            disabled={isFormDisabled}
            value={formData.title || ""}
            onChange={handleChange}
            placeholder={
              isAiLoading
                ? "AI is analyzing title..."
                : "e.g. NVIDIA RTX 4090 Founders Edition"
            }
            className={`${INPUT_BASE} transition-all duration-300 ${
              isTyping || isAiLoading ? AI_TYPING_RING : ""
            } ${errors.title ? ERROR_RING : ""}`}
          />
        </motion.div>
        {errors.title && (
          <span className="text-xs text-red-500 mt-1 font-medium">
            {errors.title}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control w-full">
          <label className="label py-1 flex items-center justify-between">
            <span className="label-text font-bold text-neutral-900">
              Category <span className="text-red-500">*</span>
            </span>
            {(isAiLoading || isTyping) && (
              <SkeletonLoadingText text="AI is generating. Please wait… " />
            )}
          </label>
          <button
            type="button"
            disabled={isFormDisabled}
            onClick={() => setIsCategoryModalOpen(true)}
            className={`w-full h-12 px-4 rounded-xl border bg-white/70 backdrop-blur-sm hover:bg-orange-50/40 flex items-center justify-between text-left transition-colors cursor-pointer ${
              isTyping || isAiLoading ? AI_TYPING_RING : "border-neutral-300"
            } ${errors.categoryId ? ERROR_RING : ""}`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <Layers
                className={`w-4 h-4 shrink-0 ${isAiLoading || isTyping ? "text-amber-500 animate-spin" : "text-orange-500"}`}
              />
              <span
                className={`text-sm truncate font-semibold ${selectedCategoryName ? "text-neutral-900 font-bold" : "text-neutral-400"}`}
              >
                {selectedCategoryName ||
                  (isAiLoading
                    ? "AI is generating. Please wait…"
                    : "Click to select category")}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
          </button>
          {errors.categoryId && (
            <span className="text-xs text-red-500 mt-1 font-medium">
              {errors.categoryId}
            </span>
          )}
        </div>

        <div className="form-control w-full">
          <label className="label py-1 flex items-center justify-between">
            <span className="label-text font-bold text-neutral-900">
              Brand <span className="text-red-500">*</span>
            </span>
            {(isAiLoading || isTyping) && (
              <SkeletonLoadingText
                text={isTyping ? "AI typing brand" : "Detecting brand"}
              />
            )}
          </label>
          <motion.div
            animate={isTyping || isAiLoading ? { scale: [1, 1.005, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.2, delay: 0.1 }}
          >
            <input
              type="text"
              name="brand"
              disabled={isFormDisabled}
              value={formData.brand || ""}
              onChange={handleChange}
              placeholder={
                isAiLoading ? "AI detecting brand..." : "NVIDIA, ASUS, MSI..."
              }
              className={`${INPUT_BASE} transition-all duration-300 ${
                isTyping || isAiLoading ? AI_TYPING_RING : ""
              } ${errors.brand ? ERROR_RING : ""}`}
            />
          </motion.div>
          {errors.brand && (
            <span className="text-xs text-red-500 mt-1 font-medium">
              {errors.brand}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control w-full">
          <label className="label py-1 flex items-center justify-between">
            <span className="label-text font-bold text-neutral-900">
              Model <span className="text-red-500">*</span>
            </span>
            {(isAiLoading || isTyping) && (
              <SkeletonLoadingText
                text={isTyping ? "AI typing model" : "Detecting model"}
              />
            )}
          </label>
          <motion.div
            animate={isTyping || isAiLoading ? { scale: [1, 1.005, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }}
          >
            <input
              type="text"
              name="model"
              disabled={isFormDisabled}
              value={formData.model || ""}
              onChange={handleChange}
              placeholder={isAiLoading ? "AI detecting model..." : "RTX 4090"}
              className={`${INPUT_BASE} transition-all duration-300 ${
                isTyping || isAiLoading ? AI_TYPING_RING : ""
              } ${errors.model ? ERROR_RING : ""}`}
            />
          </motion.div>
          {errors.model && (
            <span className="text-xs text-red-500 mt-1 font-medium">
              {errors.model}
            </span>
          )}
        </div>

        {children}
      </div>
    </>
  );
}
