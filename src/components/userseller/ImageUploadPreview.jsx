import React from "react";
import { Upload, Camera, X } from "lucide-react";

export default function ImageUploadPreview({
  imageFiles = [],
  setImageFiles,
  disabled = false,
}) {
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      // เพิ่มไฟล์ใหม่เข้า Array โดยจำกัดไว้ไม่เกิน 5 รูป
      setImageFiles((prev) => [...prev, ...selectedFiles].slice(0, 5));
    }
    // รีเซ็ตเพื่อให้อัปโหลดไฟล์เดิมซ้ำได้ถ้ากดลบไปแล้ว
    e.target.value = "";
  };

  const handleRemove = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="hardware-surface p-6 bg-base-100 border border-base-300 rounded-box space-y-4 shadow-sm">
      <div className="border-b border-base-300 pb-3 flex items-center justify-between">
        <h3 className="font-bold text-lg text-base-content">
          รูปภาพสินค้า <span className="text-sm font-bold text-neutral/80">(สูงสุด 5 รูป)</span>
        </h3>
        <span className="text-xs text-neutral/80 font-bold">อัปโหลดอย่างน้อย 1 รูป</span>
      </div>

      {/* Grid รูปภาพ */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {imageFiles.map((fileOrUrl, idx) => {
          // รองรับทั้ง File Object และ String URL (ถ้ามี)
          const previewUrl =
            typeof fileOrUrl === "string"
              ? fileOrUrl
              : URL.createObjectURL(fileOrUrl);

          return (
            <div
              key={idx}
              className="relative aspect-square rounded-field overflow-hidden border border-base-300 group bg-base-200"
            >
              <img
                src={previewUrl}
                alt={`Product preview ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="absolute top-1 right-1 bg-neutral/80 text-white hover:bg-error rounded-full p-1 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}

        {/* ปุ่มช่อง + เพิ่มรูป */}
        {imageFiles.length < 5 && !disabled && (
          <label className="aspect-square border-2 border-dashed border-base-300 hover:border-[#f97316] bg-base-200/80 hover:bg-base-200 rounded-field flex flex-col items-center justify-center cursor-pointer transition-all p-2 text-center group">
            <div className="w-10 h-10 rounded-full bg-base-300 group-hover:bg-[#f97316]/20 flex items-center justify-center mb-1 transition-colors">
              <Camera className="w-5 h-5 text-base-content group-hover:text-[#f97316]" />
            </div>
            <span className="text-xs font-bold text-base-content group-hover:text-[#f97316]">
              + เพิ่มรูป
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFileChange}
              className="hidden"
              disabled={disabled}
            />
          </label>
        )}
      </div>

      {/* ปุ่มกดเลือกไฟล์จากเครื่อง */}
      {imageFiles.length < 5 && !disabled && (
        <label className="btn btn-outline border-base-300 hover:bg-base-200 w-full flex items-center justify-center gap-2 text-xs font-bold text-base-content cursor-pointer mt-2">
          <Upload className="w-4 h-4 text-[#f97316]" />
          <span>เลือกรูปภาพจากเครื่องของคุณ</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled}
          />
        </label>
      )}
    </div>
  );
}