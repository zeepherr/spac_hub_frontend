import React, { useState } from "react";
import { ChevronRight, Layers } from "lucide-react";
import CategorySelectModal from "./CategorySelectModal";

export default function ProductBasicForm({ formData, setFormData, onNext }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // รับค่าหมวดหมู่จาก Modal
  const handleSelectCategory = (category) => {
    setSelectedCategoryName(category.name);
    setFormData((prev) => ({
      ...prev,
      categoryId: Number(category.id), // บันทึกเป็น Number ตรงตาม Prisma Schema
    }));
  };

  return (
    <>
      <div className="hardware-surface p-6 rounded-box space-y-5 bg-base-100 border border-base-300 shadow-sm">
        <div className="border-b border-base-300 pb-3 flex items-center justify-between">
          <h3 className="text-xl font-bold text-base-content tracking-tight">
            ข้อมูลเบื้องต้น
          </h3>
          <span className="hardware-indicator" />
        </div>

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

        {/* หมวดหมู่ (กดปุ่มเปิด Modal) & แบรนด์ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* ช่องเลือกหมวดหมู่ผ่าน Modal */}
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

          {/* แบรนด์ */}
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

        {/* ปุ่มถัดไป */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onNext}
            className="btn btn-accent px-8 rounded-field text-white font-bold flex items-center gap-2 bg-[#f97316] hover:bg-[#ea580c] border-none shadow-md"
          >
            ถัดไป ➔
          </button>
        </div>
      </div>

      {/* Render Component Modal */}
      <CategorySelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedCategoryId={formData.categoryId}
        onSelectCategory={handleSelectCategory}
      />
    </>
  );
}