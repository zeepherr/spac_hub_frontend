import { motion } from "framer-motion";
import SkeletonLoadingText from "./SkeletonLoadingText";
import {
  AI_TYPING_RING,
  ERROR_RING,
  INPUT_BASE,
} from "./productBasicForm.constants";

export default function ProductDescriptionField({
  formData,
  handleChange,
  errors,
  isFormDisabled,
  isAiLoading,
  isTyping,
}) {
  return (
    <div className="form-control w-full">
      <label className="label py-1 flex items-center justify-between">
        <span className="label-text font-bold text-neutral-900">
          Additional Description <span className="text-red-500">*</span>
        </span>
        {(isAiLoading || isTyping) && (
          <SkeletonLoadingText
            text={
              isTyping ? "AI typing description" : "Generating description"
            }
          />
        )}
      </label>
      <motion.div
        animate={isTyping || isAiLoading ? { scale: [1, 1.002, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }}
      >
        <textarea
          name="description"
          rows={4}
          disabled={isFormDisabled}
          value={formData.description || ""}
          onChange={handleChange}
          placeholder={
            isAiLoading
              ? "AI is generating description..."
              : "Specify purchase date, previous usage history, reason for selling..."
          }
          className={`${INPUT_BASE} transition-all duration-300 ${
            isTyping || isAiLoading ? AI_TYPING_RING : ""
          } ${errors.description ? ERROR_RING : ""}`}
        />
      </motion.div>
      {errors.description && (
        <span className="text-xs text-red-500 mt-1 font-medium">
          {errors.description}
        </span>
      )}
    </div>
  );
}
