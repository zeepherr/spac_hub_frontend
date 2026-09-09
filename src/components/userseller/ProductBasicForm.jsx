import React, { useState, useEffect } from "react";
import { ChevronRight, Layers, Sparkles, Upload, X, Loader2, Image as ImageIcon, CheckCircle2, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CategorySelectModal from "./CategorySelectModal";
import ProvinceSelectModal from "./ProvinceSelectModal";
import AiProcessingCard from "./AiProcessingCard";
import { createListingSchema } from "@/validations/listing.schema";
import { useCategories } from "@/hook/category/useCategory";

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

export default function ProductBasicForm({ 
  formData, 
  setFormData, 
  onSubmit, 
  loading, 
  onAiAutofill,
  showToast 
}) {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProvinceModalOpen, setIsProvinceModalOpen] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [aiImagePreview, setAiImagePreview] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // สถานะขณะกำลัง Typing ลง Input
  const [isAiSuccess, setIsAiSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const { data: categoriesData } = useCategories({ includeInactive: false });

  useEffect(() => {
    if (formData.categoryId) {
      const list = Array.isArray(categoriesData) ? categoriesData : categoriesData?.data || [];
      const found = list.find((c) => String(c.id) === String(formData.categoryId));
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
  };

  // ----------------------------------------------------
  // 3. ฟังก์ชันสแกน AI + Typewriter Animation ลงทุก Input
  // ----------------------------------------------------
  const handleConfirmAiAutofill = async () => {
    if (!selectedFile || !onAiAutofill) return;
    try {
      setIsAiLoading(true);
      setIsAiSuccess(false);
      
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
        price: "",
        description: "",
      }));

      // ลำดับการพิมพ์ลงกล่องข้อความทีละช่อง
      if (data.title) {
        await typeEffect(data.title, (val) => setFormData((prev) => ({ ...prev, title: val })), 20);
      }
      if (data.brand) {
        await typeEffect(data.brand, (val) => setFormData((prev) => ({ ...prev, brand: val })), 25);
      }
      if (data.model) {
        await typeEffect(data.model, (val) => setFormData((prev) => ({ ...prev, model: val })), 25);
      }
      if (data.price) {
        await typeEffect(String(data.price), (val) => setFormData((prev) => ({ ...prev, price: val })), 40);
      }
      if (data.description) {
        await typeEffect(data.description, (val) => setFormData((prev) => ({ ...prev, description: val })), 10);
      }

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
      <div className="hardware-surface p-6 rounded-box space-y-6 bg-base-100 border border-base-300 shadow-sm">
        <div className="border-b border-base-300 pb-3 flex items-center justify-between">
          <h3 className="text-xl font-bold text-base-content tracking-tight">Basic Information</h3>
          <span className="hardware-indicator" />
        </div>

        {/* AI AUTOFILL BANNER */}
        <div className="relative overflow-hidden rounded-2xl p-5 md:p-6 transition-all duration-300 bg-linear-to-br from-amber-500/10 via-base-100 to-orange-500/5 border border-amber-500/30 shadow-md hover:shadow-lg hover:border-amber-500/50 group">
          <div className="relative z-10 space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-xl bg-linear-to-tr from-[#ea580c] to-[#f97316] text-white shrink-0">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-base-content flex items-center gap-2">
                    Auto-fill Product Details with AI
                    <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-linear-to-r from-amber-500 to-orange-500 text-white">
                      Recommended
                    </span>
                  </h4>
                  <p className="text-xs md:text-sm text-base-content/70 mt-1">
                    Select a product image to preview, then click confirm for AI to scan and fill in the details automatically.
                  </p>
                </div>
              </div>

              {!aiImagePreview && (
                <label className="btn border-none bg-linear-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] text-white font-bold rounded-xl shadow-md cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span className="text-xs md:text-sm">Select Product Image</span>
                  <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                </label>
              )}
            </div>

            {aiImagePreview && (
              <div className="pt-4 border-t border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <img src={aiImagePreview} alt="AI Scan Preview" className="w-20 h-20 rounded-xl border-2 border-amber-500/60 object-cover" />
                    <button 
                      type="button" 
                      onClick={handleClearAiImage} 
                      disabled={isFormDisabled} 
                      className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full p-1.5 hover:bg-rose-700 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-600 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4" /> Selected Image
                    </span>
                    <p className="text-xs md:text-sm text-base-content/70 mt-0.5">
                      {isAiSuccess ? "✨ AI successfully filled in the details!" : "Please verify accuracy and confirm to scan data."}
                    </p>
                  </div>
                </div>

                {isAiSuccess ? (
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs bg-emerald-500/10 px-4 py-2.5 rounded-xl border border-emerald-500/30">
                    <CheckCircle2 className="w-4.5 h-4.5" /> Analysis Complete
                  </div>
                ) : (
                  <button 
                    type="button" 
                    onClick={handleConfirmAiAutofill} 
                    disabled={isFormDisabled} 
                    className="btn border-none bg-linear-to-r from-[#f97316] to-[#d97706] text-white font-extrabold rounded-xl"
                  >
                    {isAiLoading || isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>{isAiLoading ? "Analyzing Image..." : isTyping ? "Typing..." : "Confirm AI Scan"}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* AI PROCESSING / SAVING INDICATOR CARD */}
        <AiProcessingCard isAiLoading={isAiLoading || isTyping} isSaving={loading} />

        {/* INPUT: TITLE */}
        <div className="form-control w-full">
          <label className="label py-1 flex items-center justify-between">
            <span className="label-text font-bold text-base-content">Product Title <span className="text-error">*</span></span>
            {(isAiLoading || isTyping) && <SkeletonLoadingText text={isTyping ? "AI typing title" : "Analyzing title"} />}
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
              placeholder={isAiLoading ? "AI is analyzing title..." : "e.g. NVIDIA RTX 4090 Founders Edition"} 
              className={`input w-full rounded-field transition-all duration-300 ${
                isTyping || isAiLoading ? "border-amber-500 ring-2 ring-amber-500/20 bg-amber-500/5 text-amber-900 font-medium" : ""
              } ${errors.title ? "border-error focus:border-error" : ""}`} 
            />
          </motion.div>
          {errors.title && <span className="text-xs text-error mt-1 font-medium">{errors.title}</span>}
        </div>

        {/* CATEGORY & BRAND */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control w-full">
            <label className="label py-1 flex items-center justify-between">
              <span className="label-text font-bold text-base-content">Category <span className="text-error">*</span></span>
              {(isAiLoading || isTyping) && <SkeletonLoadingText text="AI is generating. Please wait… " />}
            </label>
            <button
              type="button"
              disabled={isFormDisabled}
              onClick={() => setIsCategoryModalOpen(true)}
              className={`w-full h-12 px-4 rounded-field border bg-base-100 hover:bg-base-200/60 flex items-center justify-between text-left transition-colors ${
                isTyping || isAiLoading ? "border-amber-500 ring-2 ring-amber-500/20 bg-amber-500/5" : "border-base-300"
              } ${errors.categoryId ? "border-error focus:border-error" : ""}`}
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <Layers className={`w-4 h-4 shrink-0 ${isAiLoading || isTyping ? "text-amber-500 animate-spin" : "text-accent"}`} />
                <span className={`text-sm truncate font-semibold ${selectedCategoryName ? "text-base-content font-bold" : "text-base-content/60"}`}>
                  {selectedCategoryName || (isAiLoading ? "AI is generating. Please wait…" : "Click to select category")}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-base-content/70 shrink-0" />
            </button>
            {errors.categoryId && <span className="text-xs text-error mt-1 font-medium">{errors.categoryId}</span>}
          </div>

          <div className="form-control w-full">
            <label className="label py-1 flex items-center justify-between">
              <span className="label-text font-bold text-base-content">Brand <span className="text-error">*</span></span>
              {(isAiLoading || isTyping) && <SkeletonLoadingText text={isTyping ? "AI typing brand" : "Detecting brand"} />}
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
                placeholder={isAiLoading ? "AI detecting brand..." : "NVIDIA, ASUS, MSI..."} 
                className={`input w-full rounded-field transition-all duration-300 ${
                  isTyping || isAiLoading ? "border-amber-500 ring-2 ring-amber-500/20 bg-amber-500/5 text-amber-900 font-medium" : ""
                } ${errors.brand ? "border-error focus:border-error" : ""}`} 
              />
            </motion.div>
            {errors.brand && <span className="text-xs text-error mt-1 font-medium">{errors.brand}</span>}
          </div>
        </div>

        {/* MODEL & PRICE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control w-full">
            <label className="label py-1 flex items-center justify-between">
              <span className="label-text font-bold text-base-content">Model <span className="text-error">*</span></span>
              {(isAiLoading || isTyping) && <SkeletonLoadingText text={isTyping ? "AI typing model" : "Detecting model"} />}
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
                className={`input w-full rounded-field transition-all duration-300 ${
                  isTyping || isAiLoading ? "border-amber-500 ring-2 ring-amber-500/20 bg-amber-500/5 text-amber-900 font-medium" : ""
                } ${errors.model ? "border-error focus:border-error" : ""}`} 
              />
            </motion.div>
            {errors.model && <span className="text-xs text-error mt-1 font-medium">{errors.model}</span>}
          </div>

          <div className="form-control w-full">
            <label className="label py-1 flex items-center justify-between">
              <span className="label-text font-bold text-base-content">Price (THB) <span className="text-error">*</span></span>
              {(isAiLoading || isTyping) && <SkeletonLoadingText text={isTyping ? "AI typing price" : "Estimating price"} />}
            </label>
            <motion.div
              animate={isTyping || isAiLoading ? { scale: [1, 1.005, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.2, delay: 0.3 }}
              className="relative"
            >
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-base-content/60">฿</span>
              <input 
                type="number" 
                name="price" 
                min="1"
                max="999999999"
                disabled={isFormDisabled}
                value={formData.price ?? ""} 
                onChange={handleChange} 
                placeholder={isAiLoading ? "Estimating..." : "55000"} 
                className={`input w-full pl-8 rounded-field transition-all duration-300 ${
                  isTyping || isAiLoading ? "border-amber-500 ring-2 ring-amber-500/20 bg-amber-500/5 text-amber-900 font-medium" : ""
                } ${errors.price ? "border-error focus:border-error" : ""}`} 
              />
            </motion.div>
            {errors.price && <span className="text-xs text-error mt-1 font-medium">{errors.price}</span>}
          </div>
        </div>

        {/* PROVINCE LOCATION */}
        <div className="form-control w-full">
          <label className="label py-1">
            <span className="label-text font-bold text-base-content flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-accent" />
              Shipping Location / Pickup Province <span className="text-error">*</span>
            </span>
          </label>
          <button
            type="button"
            disabled={isFormDisabled}
            onClick={() => setIsProvinceModalOpen(true)}
            className={`w-full h-12 px-4 rounded-field border bg-base-100 hover:bg-base-200/60 flex items-center justify-between text-left transition-colors ${
              errors.location ? "border-error focus:border-error" : "border-base-300 focus:border-accent"
            }`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <MapPin className="w-4 h-4 text-accent shrink-0" />
              <span className={`text-sm truncate font-semibold ${formData.location ? "text-base-content font-bold" : "text-base-content/60"}`}>
                {formData.location || "Click to select province"}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-base-content/70 shrink-0" />
          </button>
          {errors.location && <span className="text-xs text-error mt-1 font-medium">{errors.location}</span>}
        </div>

        {/* ADDITIONAL DESCRIPTION */}
        <div className="form-control w-full">
          <label className="label py-1 flex items-center justify-between">
            <span className="label-text font-bold text-base-content">Additional Description <span className="text-error">*</span></span>
            {(isAiLoading || isTyping) && <SkeletonLoadingText text={isTyping ? "AI typing description" : "Generating description"} />}
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
              placeholder={isAiLoading ? "AI is generating description..." : "Specify purchase date, previous usage history, reason for selling..."} 
              className={`textarea w-full rounded-field transition-all duration-300 ${
                isTyping || isAiLoading ? "border-amber-500 ring-2 ring-amber-500/20 bg-amber-500/5 text-amber-900 font-medium" : ""
              } ${errors.description ? "border-error focus:border-error" : ""}`} 
            />
          </motion.div>
          {errors.description && <span className="text-xs text-error mt-1 font-medium">{errors.description}</span>}
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end pt-3 border-t border-base-200">
          <button 
            type="button" 
            onClick={handleFormSubmit} 
            disabled={isFormDisabled} 
            className="btn btn-accent px-8 rounded-field font-bold shadow-md w-full sm:w-auto overflow-hidden relative"
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
                  <span>{isAiLoading ? "AI Scanning" : isTyping ? "AI Typing" : "Saving"}</span>
                  <span className="flex items-center gap-0.5 ml-0.5">
                    <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }}>.</motion.span>
                    <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}>.</motion.span>
                    <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}>.</motion.span>
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