import { useCategories } from "@/hook/category/useCategory";
import { createListingSchema } from "@/validations/listing.schema";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronRight,
  Image as ImageIcon,
  Layers,
  Loader2,
  MapPin,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import AiProcessingCard from "./AiProcessingCard";
import CategorySelectModal from "./CategorySelectModal";
import ProvinceSelectModal from "./ProvinceSelectModal";

// เดียวกับ GLASS_PANEL/CTA_GLASS ที่ใช้ทั้งเว็บ
const GLASS_PANEL =
  "border border-neutral-200/70 bg-white/50 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)]";
const CTA_GLASS =
  "bg-orange-500 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(249,115,22,0.3)] hover:bg-orange-600";
// input พื้นฐานแบบ glass ใช้ซ้ำทุกช่องในฟอร์มนี้ ส่วน highlight ระหว่าง AI กำลังพิมพ์ / error ใส่เพิ่มทีหลัง
const INPUT_BASE =
  "w-full rounded-xl border border-neutral-300 bg-white/70 backdrop-blur-sm px-4 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";
const AI_TYPING_RING =
  "border-amber-500 ring-2 ring-amber-500/20 bg-amber-500/5 text-amber-900 font-medium";
const ERROR_RING = "border-red-500 focus:border-red-500";

// ----------------------------------------------------
// 1. Component แสดง Text & Dots Animation ด้านบนช่อง Input
// ----------------------------------------------------
function SkeletonLoadingText({ text = "AI is typing" }) {
  return (
    <div className="flex items-center gap-1.5 text-amber-600 font-semibold text-xs py-1">
      <span>{text}</span>
      <span className="flex items-center gap-0.5">
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: 0 }}
          className="w-1.5 h-1.5 bg-amber-500 rounded-full inline-block"
        />
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }}
          className="w-1.5 h-1.5 bg-amber-500 rounded-full inline-block"
        />
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }}
          className="w-1.5 h-1.5 bg-amber-500 rounded-full inline-block"
        />
      </span>
    </div>
  );
}

// ----------------------------------------------------
// 2. Helper Function สำหรับสตรีมตัวอักษรพิมพ์เข้า Input (Typewriter)
// ----------------------------------------------------
const typeEffect = (text, callback, speed = 25) => {
  return new Promise((resolve) => {
    if (!text) return resolve();
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        callback(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        resolve();
      }
    }, speed);
  });
};
const formatThb = (value) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "-";
  }

  return `฿${amount.toLocaleString("th-TH")}`;
};
export default function ProductBasicForm({
  formData,
  setFormData,
  onSubmit,
  loading,
  onAiAutofill,
  showToast,
}) {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProvinceModalOpen, setIsProvinceModalOpen] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [aiImagePreview, setAiImagePreview] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // สถานะขณะกำลัง Typing ลง Input
  const [isAiSuccess, setIsAiSuccess] = useState(false);
  const [marketPrice, setMarketPrice] = useState(null);
  const [errors, setErrors] = useState({});

  const { data: categoriesData } = useCategories({ includeInactive: false });

  useEffect(() => {
    if (formData.categoryId) {
      const list = Array.isArray(categoriesData)
        ? categoriesData
        : categoriesData?.data || [];
      const found = list.find(
        (c) => String(c.id) === String(formData.categoryId),
      );
      if (found) {
        setSelectedCategoryName(found.name || found.title || "");
      }
    } else {
      setSelectedCategoryName("");
    }
  }, [formData.categoryId, categoriesData]);

  const notify = (msg, type = "error") => {
    if (showToast) showToast(msg, type);
    else console.warn(`[Toast ${type}]: ${msg}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price") {
      if (value !== "" && Number(value) > 999999999) return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSelectCategory = (category) => {
    setSelectedCategoryName(category.name);
    setFormData((prev) => ({ ...prev, categoryId: Number(category.id) }));
    if (errors.categoryId) setErrors((prev) => ({ ...prev, categoryId: null }));
  };

  const handleSelectProvince = (provinceName) => {
    setFormData((prev) => ({ ...prev, location: provinceName }));
    if (errors.location) setErrors((prev) => ({ ...prev, location: null }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setAiImagePreview(URL.createObjectURL(file));
    setIsAiSuccess(false);
    setMarketPrice(null);
  };

  // ----------------------------------------------------
  // 3. ฟังก์ชันสแกน AI + Typewriter Animation ลงทุก Input
  // ----------------------------------------------------
  const handleConfirmAiAutofill = async () => {
    if (!selectedFile || !onAiAutofill) return;
    try {
      setIsAiLoading(true);
      setIsAiSuccess(false);
      setMarketPrice(null);

      // เรียก API ถอดข้อมูลจากรูป
      const aiResult = await onAiAutofill(selectedFile);
      const data = aiResult?.data || aiResult || {};

      setIsAiLoading(false);
      setIsTyping(true); // เริ่มเข้าสู่โหมดพิมพ์ข้อมูล

      // ล้างข้อมูลเดิมเตรียมพิมพ์ใหม่
      setFormData((prev) => ({
        ...prev,
        title: "",
        brand: "",
        model: "",
        description: "",
      }));

      // ลำดับการพิมพ์ลงกล่องข้อความทีละช่อง
      if (data.title) {
        await typeEffect(
          data.title,
          (val) => setFormData((prev) => ({ ...prev, title: val })),
          20,
        );
      }
      if (data.brand) {
        await typeEffect(
          data.brand,
          (val) => setFormData((prev) => ({ ...prev, brand: val })),
          25,
        );
      }
      if (data.model) {
        await typeEffect(
          data.model,
          (val) => setFormData((prev) => ({ ...prev, model: val })),
          25,
        );
      }

      if (data.description) {
        await typeEffect(
          data.description,
          (val) => setFormData((prev) => ({ ...prev, description: val })),
          10,
        );
      }
      setMarketPrice(data.marketPrice ?? null);
      setIsAiSuccess(true);
    } catch (error) {
      console.error("AI Autofill Failed:", error);
      notify("Failed to extract data from image. Please try again.", "error");
    } finally {
      setIsAiLoading(false);
      setIsTyping(false);
    }
  };

  const handleClearAiImage = () => {
    setSelectedFile(null);
    setAiImagePreview(null);
    setIsAiSuccess(false);
    setMarketPrice(null);
  };

  const handleFormSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const result = createListingSchema.safeParse(formData);

    if (!result.success) {
      const formattedErrors = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        if (!formattedErrors[fieldName]) {
          formattedErrors[fieldName] = issue.message;
        }
      });
      setErrors(formattedErrors);
      notify("Please fill in all required fields correctly", "warning");
      return;
    }

    setErrors({});
    if (onSubmit) onSubmit(e);
  };

  const isFormDisabled = isAiLoading || isTyping || loading;

  return (
    <>
      <div className={`p-6 rounded-3xl space-y-6 ${GLASS_PANEL}`}>
        <div className="border-b border-neutral-200/70 pb-3 flex items-center justify-between">
          <h3 className="text-xl font-bold text-neutral-900 tracking-tight">
            Basic Information
          </h3>
        </div>

        {/* AI AUTOFILL BANNER */}
        {/* AI AUTOFILL BANNER */}
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

                  <span className="text-xs md:text-sm">
                    Select Product Image
                  </span>

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

          {/* Fixed overlay: does not increase the banner or form height */}
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

        {/* AI PROCESSING / SAVING INDICATOR CARD */}

        {/* INPUT: TITLE */}
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

        {/* CATEGORY & BRAND */}
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

        {/* MODEL & PRICE */}
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

            {/* Fixed-height price guidance slot */}
            <div
              className="min-h-12 pt-2"
              aria-live="polite"
              aria-atomic="true"
            >
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
        </div>

        {/* PROVINCE LOCATION */}
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

        {/* ADDITIONAL DESCRIPTION */}
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

        {/* SUBMIT BUTTON */}
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
      </div>

      {/* MODAL หมวดหมู่ */}
      <CategorySelectModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        selectedCategoryId={formData.categoryId}
        onSelectCategory={handleSelectCategory}
      />

      {/* MODAL เลือกจังหวัด */}
      <ProvinceSelectModal
        isOpen={isProvinceModalOpen}
        onClose={() => setIsProvinceModalOpen(false)}
        selectedProvince={formData.location}
        onSelectProvince={handleSelectProvince}
      />
    </>
  );
}
