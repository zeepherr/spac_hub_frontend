import React, { useState } from "react";
import { ChevronRight, Layers, Sparkles, Upload, X, Loader2, Image as ImageIcon, CheckCircle2, MapPin } from "lucide-react";
import CategorySelectModal from "./CategorySelectModal";
import ProvinceSelectModal from "./ProvinceSelectModal"; // 👈 import modal จังหวัดเข้ามา
import { createListingSchema } from "@/validations/listing.schema";

export default function ProductBasicForm({ 
  formData, 
  setFormData, 
  onSubmit, 
  loading, 
  onAiAutofill,
  showToast 
}) {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProvinceModalOpen, setIsProvinceModalOpen] = useState(false); // 👈 State เปิดปิด Modal จังหวัด
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [aiImagePreview, setAiImagePreview] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAiSuccess, setIsAiSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const notify = (msg, type = "error") => {
    if (showToast) showToast(msg, type);
    else console.warn(`[Toast ${type}]: ${msg}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSelectCategory = (category) => {
    setSelectedCategoryName(category.name);
    setFormData((prev) => ({ ...prev, categoryId: Number(category.id) }));
    if (errors.categoryId) setErrors((prev) => ({ ...prev, categoryId: null }));
  };

  // 👈 Handler เมื่อเลือกจังหวัดใน Modal
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

  const handleConfirmAiAutofill = async () => {
    if (!selectedFile || !onAiAutofill) return;
    try {
      setIsAiLoading(true);
      await onAiAutofill(selectedFile);
      setIsAiSuccess(true);
      notify("วิเคราะห์และเติมข้อมูลด้วย AI สำเร็จแล้ว!", "success");
    } catch (error) {
      console.error("AI Autofill Failed:", error);
      notify("ไม่สามารถวิเคราะห์ข้อมูลจากรูปภาพได้ กรุณาลองใหม่อีกครั้ง", "error");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleClearAiImage = () => {
    setSelectedFile(null);
    setAiImagePreview(null);
    setIsAiSuccess(false);
  };

  const handleFormSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const payloadToValidate = {
      ...formData,
      categoryId: formData.categoryId ? Number(formData.categoryId) : undefined,
      price: formData.price !== "" && formData.price !== undefined ? Number(formData.price) : undefined,
    };

    const result = createListingSchema.safeParse(payloadToValidate);

    if (!result.success) {
      const formattedErrors = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        formattedErrors[fieldName] = issue.message;
      });
      setErrors(formattedErrors);
      notify("Please check the form for errors", "warning");
      return;
    }

    setErrors({});
    if (onSubmit) onSubmit(e);
  };

  return (
    <>
      <div className="hardware-surface p-6 rounded-box space-y-6 bg-base-100 border border-base-300 shadow-sm">
        <div className="border-b border-base-300 pb-3 flex items-center justify-between">
          <h3 className="text-xl font-bold text-base-content tracking-tight">ข้อมูลเบื้องต้น</h3>
          <span className="hardware-indicator" />
        </div>

        {/* AI AUTOFILL BOX */}
        <div className="relative overflow-hidden rounded-2xl p-5 md:p-6 transition-all duration-300 bg-linear-to-br from-amber-500/10 via-base-100 to-orange-500/5 border border-amber-500/30 shadow-md hover:shadow-lg hover:border-amber-500/50 group">
          <div className="relative z-10 space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-xl bg-linear-to-tr from-[#ea580c] to-[#f97316] text-white shrink-0">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-base-content flex items-center gap-2">
                    ให้ AI ช่วยกรอกข้อมูลสินค้าอัตโนมัติ
                    <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-linear-to-r from-amber-500 to-orange-500 text-white">
                      แนะนำ
                    </span>
                  </h4>
                  <p className="text-xs md:text-sm text-base-content/70 mt-1">
                    เลือกรูปภาพสินค้าเพื่อดูพรีวิว จากนั้นกดยืนยันเพื่อให้ AI อ่านและเติมข้อมูลลงฟอร์ม
                  </p>
                </div>
              </div>

              {!aiImagePreview && (
                <label className="btn border-none bg-linear-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] text-white font-bold rounded-xl shadow-md cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span className="text-xs md:text-sm">เลือกรูปภาพสินค้า</span>
                  <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                </label>
              )}
            </div>

            {aiImagePreview && (
              <div className="pt-4 border-t border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <img src={aiImagePreview} alt="AI Scan Preview" className="w-20 h-20 rounded-xl border-2 border-amber-500/60 object-cover" />
                    <button type="button" onClick={handleClearAiImage} disabled={isAiLoading} className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full p-1.5">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-600 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4" /> รูปภาพที่เลือก
                    </span>
                    <p className="text-xs md:text-sm text-base-content/70 mt-0.5">
                      {isAiSuccess ? "✨ AI เติมข้อมูลลงในฟอร์มเรียบร้อยแล้ว!" : "ตรวจสอบความถูกต้อง แล้วกดยืนยันเพื่อสแกนข้อมูล"}
                    </p>
                  </div>
                </div>

                {isAiSuccess ? (
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs bg-emerald-500/10 px-4 py-2.5 rounded-xl border border-emerald-500/30">
                    <CheckCircle2 className="w-4.5 h-4.5" /> วิเคราะห์ข้อมูลสำเร็จแล้ว
                  </div>
                ) : (
                  <button type="button" onClick={handleConfirmAiAutofill} disabled={isAiLoading} className="btn border-none bg-linear-to-r from-[#f97316] to-[#d97706] text-white font-extrabold rounded-xl">
                    {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>{isAiLoading ? "กำลังวิเคราะห์..." : "ยืนยันให้ AI อ่านข้อมูล"}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* INPUT: ชื่อสินค้า */}
        <div className="form-control w-full">
          <label className="label py-1">
            <span className="label-text font-bold text-base-content">ชื่อสินค้า <span className="text-error">*</span></span>
          </label>
          <input type="text" name="title" value={formData.title || ""} onChange={handleChange} placeholder="เช่น NVIDIA RTX 4090 Founders Edition" className={`input w-full rounded-field ${errors.title ? "border-error" : ""}`} />
          {errors.title && <span className="text-xs text-error mt-1">{errors.title}</span>}
        </div>

        {/* หมวดหมู่ & แบรนด์ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text font-bold text-base-content">หมวดหมู่ <span className="text-error">*</span></span>
            </label>
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(true)}
              className={`w-full h-12 px-4 rounded-field border bg-base-100 hover:bg-base-200/60 flex items-center justify-between text-left ${errors.categoryId ? "border-error" : "border-base-300"}`}
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <Layers className="w-4 h-4 text-accent shrink-0" />
                <span className={`text-sm truncate font-semibold ${selectedCategoryName ? "text-base-content font-bold" : "text-base-content/60"}`}>
                  {selectedCategoryName || "คลิกเพื่อเลือกหมวดหมู่"}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-base-content/70 shrink-0" />
            </button>
            {errors.categoryId && <span className="text-xs text-error mt-1">{errors.categoryId}</span>}
          </div>

          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text font-bold text-base-content">แบรนด์ <span className="text-error">*</span></span>
            </label>
            <input type="text" name="brand" value={formData.brand || ""} onChange={handleChange} placeholder="NVIDIA, ASUS, MSI..." className={`input w-full rounded-field ${errors.brand ? "border-error" : ""}`} />
            {errors.brand && <span className="text-xs text-error mt-1">{errors.brand}</span>}
          </div>
        </div>

        {/* รุ่น & ราคา */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text font-bold text-base-content">รุ่น (MODEL) <span className="text-error">*</span></span>
            </label>
            <input type="text" name="model" value={formData.model || ""} onChange={handleChange} placeholder="RTX 4090" className={`input w-full rounded-field ${errors.model ? "border-error" : ""}`} />
            {errors.model && <span className="text-xs text-error mt-1">{errors.model}</span>}
          </div>

          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text font-bold text-base-content">ราคา (THB) <span className="text-error">*</span></span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold">฿</span>
              <input type="number" name="price" value={formData.price || ""} onChange={handleChange} placeholder="55000" className={`input w-full pl-8 rounded-field ${errors.price ? "border-error" : ""}`} />
            </div>
            {errors.price && <span className="text-xs text-error mt-1">{errors.price}</span>}
          </div>
        </div>

        {/* 👈 ปุ่มกดเปิด MODAL เลือกจังหวัด (LOCATION) */}
        <div className="form-control w-full">
          <label className="label py-1">
            <span className="label-text font-bold text-base-content flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-accent" />
              สถานที่จัดส่ง / จังหวัดนัดรับ <span className="text-error">*</span>
            </span>
          </label>
          <button
            type="button"
            onClick={() => setIsProvinceModalOpen(true)}
            className={`w-full h-12 px-4 rounded-field border bg-base-100 hover:bg-base-200/60 flex items-center justify-between text-left transition-colors ${
              errors.location ? "border-error" : "border-base-300 focus:border-accent"
            }`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <MapPin className="w-4 h-4 text-accent shrink-0" />
              <span className={`text-sm truncate font-semibold ${formData.location ? "text-base-content font-bold" : "text-base-content/60"}`}>
                {formData.location || "คลิกเพื่อเลือกจังหวัด"}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-base-content/70 shrink-0" />
          </button>
          {errors.location && <span className="text-xs text-error mt-1 font-medium">{errors.location}</span>}
        </div>

        {/* รายละเอียดเพิ่มเติม */}
        <div className="form-control w-full">
          <label className="label py-1">
            <span className="label-text font-bold text-base-content">รายละเอียดเพิ่มเติม <span className="text-error">*</span></span>
          </label>
          <textarea name="description" rows={4} value={formData.description || ""} onChange={handleChange} placeholder="ระบุวันที่ซื้อ, การใช้งานที่ผ่านมาระบุเหตุผลที่ขาย..." className={`textarea w-full rounded-field ${errors.description ? "border-error" : ""}`} />
          {errors.description && <span className="text-xs text-error mt-1">{errors.description}</span>}
        </div>

        {/* ปุ่มถัดไป */}
        <div className="flex justify-end pt-3 border-t border-base-200">
          <button type="button" onClick={handleFormSubmit} disabled={loading} className="btn btn-accent px-8 rounded-field font-bold shadow-md w-full sm:w-auto">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>ถัดไป ➔</span>}
          </button>
        </div>
      </div>

      {/* Modal หมวดหมู่ */}
      <CategorySelectModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        selectedCategoryId={formData.categoryId}
        onSelectCategory={handleSelectCategory}
      />

      {/* 👈 Modal เลือกจังหวัด */}
      <ProvinceSelectModal
        isOpen={isProvinceModalOpen}
        onClose={() => setIsProvinceModalOpen(false)}
        selectedProvince={formData.location}
        onSelectProvince={handleSelectProvince}
      />
    </>
  );
}