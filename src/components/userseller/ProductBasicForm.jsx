import React, { useState } from "react";
import { ChevronRight, Layers, Sparkles, Upload, X, Loader2, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import CategorySelectModal from "./CategorySelectModal";

export default function ProductBasicForm({ 
  formData, 
  setFormData, 
  onSubmit, // 👈 เปลี่ยนเป็น onSubmit ให้ตรงกับ CreateProductPage.jsx
  loading,  // 👈 รับสถานะ loading
  onAiAutofill 
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  
  // State สำหรับจัดการไฟล์รูป และ Preview
  const [selectedFile, setSelectedFile] = useState(null);
  const [aiImagePreview, setAiImagePreview] = useState(null);
  
  // State สำหรับสถานะ AI
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAiSuccess, setIsAiSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectCategory = (category) => {
    setSelectedCategoryName(category.name);
    setFormData((prev) => ({
      ...prev,
      categoryId: Number(category.id),
    }));
  };

  // 1. แค่เลือกรูปขึ้นมาโชว์ Preview ก่อน (ยังไม่ยิง AI)
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setAiImagePreview(URL.createObjectURL(file));
    setIsAiSuccess(false); // Reset สถานะ
  };

  // 2. กดยืนยันเพื่อยิง AI ให้ Autofill ข้อมูล
  const handleConfirmAiAutofill = async () => {
    if (!selectedFile || !onAiAutofill) return;

    try {
      setIsAiLoading(true);
      await onAiAutofill(selectedFile); // ยิง API วิเคราะห์รูปภาพ
      setIsAiSuccess(true); // วิเคราะห์สำเร็จ
    } catch (error) {
      console.error("AI Autofill Failed:", error);
      alert("ไม่สามารถวิเคราะห์ข้อมูลจากรูปภาพได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsAiLoading(false);
    }
  };

  // 3. ยกเลิก / ลบรูปออก
  const handleClearAiImage = () => {
    setSelectedFile(null);
    setAiImagePreview(null);
    setIsAiSuccess(false);
  };

  return (
    <>
      <div className="hardware-surface p-6 rounded-box space-y-6 bg-base-100 border border-base-300 shadow-sm">
        
        {/* HEADER */}
        <div className="border-b border-base-300 pb-3 flex items-center justify-between">
          <h3 className="text-xl font-bold text-base-content tracking-tight">
            ข้อมูลเบื้องต้น
          </h3>
          <span className="hardware-indicator" />
        </div>

        {/* ==========================================
            กล่องบนสุด: AI AUTOFILL & IMAGE PREVIEW BOX
           ========================================== */}
        <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-base-100 border border-amber-500/30 space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            
            {/* ข้อความอธิบาย AI */}
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-amber-950 shrink-0 shadow-xs">
                <Sparkles className="w-5 h-5 fill-amber-950/20" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-base-content flex items-center gap-2">
                  ให้ AI ช่วยกรอกข้อมูลสินค้าอัตโนมัติ
                  <span className="badge badge-warning badge-sm font-bold text-[10px] text-amber-950">
                    แนะนำ
                  </span>
                </h4>
                <p className="text-xs text-base-content/70 mt-0.5">
                  เลือกรูปภาพสินค้าเพื่อดูพรีวิว จากนั้นกดยืนยันเพื่อให้ AI อ่านและเติมข้อมูลลงฟอร์ม
                </p>
              </div>
            </div>

            {/* ปุ่มเลือกรูปภาพ (แสดงเฉพาะตอนที่ยังไม่ได้เลือกรูป) */}
            {!aiImagePreview && (
              <label className="btn border-none bg-gradient-to-r from-[#facc15] via-[#eab308] to-[#f97316] hover:brightness-105 text-amber-950 font-bold rounded-xl shadow-sm flex items-center gap-2 cursor-pointer shrink-0 w-full md:w-auto justify-center active:scale-95 transition-transform">
                <Upload className="w-4 h-4 text-amber-950" />
                <span className="text-xs md:text-sm">เลือกรูปภาพสินค้า</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* โซนแสดงภาพพรีวิว + ปุ่มยืนยัน (แสดงเมื่ออัปโหลดรูปแล้ว) */}
          {aiImagePreview && (
            <div className="pt-4 border-t border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              
              {/* การ์ดพรีวิวรูปภาพ */}
              <div className="flex items-center gap-3">
                <div className="relative group shrink-0">
                  <img
                    src={aiImagePreview}
                    alt="AI Scan Preview"
                    className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl border-2 border-amber-400 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={handleClearAiImage}
                    disabled={isAiLoading}
                    className="absolute -top-2 -right-2 bg-error text-white rounded-full p-1 shadow-md hover:scale-110 transition-transform disabled:opacity-50"
                    title="ลบรูปภาพ"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex flex-col justify-center space-y-1">
                  <span className="text-xs font-bold text-amber-600 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" /> รูปภาพที่เลือก
                  </span>
                  <p className="text-xs text-base-content/70 max-w-xs">
                    {isAiSuccess
                      ? "✨ AI เติมข้อมูลลงในฟอร์มเรียบร้อยแล้ว!"
                      : "ตรวจสอบความถูกต้อง แล้วกดยืนยันเพื่อให้ AI อ่านข้อมูล"}
                  </p>
                </div>
              </div>

              {/* ปุ่มยืนยันให้ AI วิเคราะห์ */}
              <div className="w-full sm:w-auto">
                {isAiSuccess ? (
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs bg-emerald-500/10 border border-emerald-500/30 px-4 py-2.5 rounded-xl">
                    <CheckCircle2 className="w-4 h-4" />
                    วิเคราะห์ข้อมูลสำเร็จแล้ว
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleConfirmAiAutofill}
                    disabled={isAiLoading}
                    className={`btn border-none text-amber-950 font-bold rounded-xl shadow-md flex items-center gap-2 w-full sm:w-auto justify-center transition-all ${
                      isAiLoading
                        ? "bg-amber-300 cursor-wait"
                        : "bg-gradient-to-r from-[#facc15] via-[#eab308] to-[#f97316] hover:brightness-105 active:scale-95"
                    }`}
                  >
                    {isAiLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-amber-950" />
                        <span className="text-xs md:text-sm">กำลังวิเคราะห์ข้อมูล...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-950 fill-amber-950/20" />
                        <span className="text-xs md:text-sm">ยืนยันให้ AI อ่านข้อมูล</span>
                      </>
                    )}
                  </button>
                )}
              </div>

            </div>
          )}
        </div>

        {/* ==========================================
            FORM INPUTS
           ========================================== */}
        
        {/* ชื่อสินค้า */}
        <div className="form-control w-full">
          <label className="label py-1">
            <span className="label-text font-bold text-base-content">
              ชื่อสินค้า <span className="text-error">*</span>
            </span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title || ""}
            onChange={handleChange}
            placeholder="เช่น NVIDIA RTX 4090 Founders Edition"
            className="input input-bordered w-full rounded-field focus:border-[#f97316] text-base-content bg-base-100"
          />
        </div>

        {/* หมวดหมู่ & แบรนด์ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text font-bold text-base-content">
                หมวดหมู่ <span className="text-error">*</span>
              </span>
            </label>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full h-12 px-4 rounded-field border border-base-300 bg-base-100 hover:bg-base-200/60 flex items-center justify-between transition-colors text-left focus:outline-none focus:border-[#f97316]"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <Layers className="w-4 h-4 text-[#f97316] shrink-0" />
                <span
                  className={`text-sm truncate font-semibold ${
                    selectedCategoryName
                      ? "text-base-content font-bold"
                      : "text-neutral/60"
                  }`}
                >
                  {selectedCategoryName || "คลิกเพื่อเลือกหมวดหมู่"}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral/70 shrink-0" />
            </button>
          </div>

          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text font-bold text-base-content">
                แบรนด์
              </span>
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand || ""}
              onChange={handleChange}
              placeholder="NVIDIA, ASUS, MSI..."
              className="input input-bordered w-full rounded-field focus:border-[#f97316] text-base-content bg-base-100"
            />
          </div>
        </div>

        {/* รุ่น & ราคา */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text font-bold text-base-content">
                รุ่น (MODEL)
              </span>
            </label>
            <input
              type="text"
              name="model"
              value={formData.model || ""}
              onChange={handleChange}
              placeholder="RTX 4090"
              className="input input-bordered w-full rounded-field focus:border-[#f97316] text-base-content bg-base-100"
            />
          </div>

          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text font-bold text-base-content">
                ราคา (THB) <span className="text-error">*</span>
              </span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content font-bold select-none">
                ฿
              </span>
              <input
                type="number"
                name="price"
                value={formData.price || ""}
                onChange={handleChange}
                placeholder="55,000"
                className="input input-bordered w-full pl-8 rounded-field focus:border-[#f97316] text-base-content bg-base-100"
              />
            </div>
          </div>
        </div>

        {/* รายละเอียดเพิ่มเติม */}
        <div className="form-control w-full">
          <label className="label py-1">
            <span className="label-text font-bold text-base-content">
              รายละเอียดเพิ่มเติม
            </span>
          </label>
          <textarea
            name="description"
            rows={4}
            value={formData.description || ""}
            onChange={handleChange}
            placeholder="ระบุวันที่ซื้อ, การใช้งานที่ผ่านมาระบุเหตุผลที่ขาย..."
            className="textarea textarea-bordered w-full rounded-field focus:border-[#f97316] text-base-content bg-base-100"
          />
        </div>

        {/* ปุ่มถัดไป ด้านล่างสุด */}
        <div className="flex justify-end pt-3 border-t border-base-200">
          <button
            type="button"
            onClick={onSubmit} // 👈 เรียกใช้งาน onSubmit ที่รับมาจาก CreateProductPage.jsx
            disabled={loading}
            className="btn px-8 rounded-field text-white font-bold flex items-center justify-center gap-2 bg-[#f97316] hover:bg-[#ea580c] border-none shadow-md active:scale-95 w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>กำลังบันทึก...</span>
              </>
            ) : (
              <span>ถัดไป ➔</span>
            )}
          </button>
        </div>
      </div>

      {/* Modal เลือกหมวดหมู่ */}
      <CategorySelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedCategoryId={formData.categoryId}
        onSelectCategory={handleSelectCategory}
      />
    </>
  );
}