import { ChevronRight, MapPin } from "lucide-react";
import { ERROR_RING } from "./productBasicForm.constants";

export default function ProductLocationField({
  formData,
  errors,
  isFormDisabled,
  setIsProvinceModalOpen,
}) {
  return (
    <div className="form-control w-full">
      <label className="label py-1">
        <span className="label-text font-bold text-neutral-900 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-orange-500" />
          Shipping Location / Pickup Province{" "}
          <span className="text-red-500">*</span>
        </span>
      </label>
      <button
        type="button"
        disabled={isFormDisabled}
        onClick={() => setIsProvinceModalOpen(true)}
        className={`w-full h-12 px-4 rounded-xl border bg-white/70 backdrop-blur-sm hover:bg-orange-50/40 flex items-center justify-between text-left transition-colors cursor-pointer ${
          errors.location
            ? ERROR_RING
            : "border-neutral-300 focus:border-orange-500"
        }`}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
          <span
            className={`text-sm truncate font-semibold ${formData.location ? "text-neutral-900 font-bold" : "text-neutral-400"}`}
          >
            {formData.location || "Click to select province"}
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
      </button>
      {errors.location && (
        <span className="text-xs text-red-500 mt-1 font-medium">
          {errors.location}
        </span>
      )}
    </div>
  );
}
