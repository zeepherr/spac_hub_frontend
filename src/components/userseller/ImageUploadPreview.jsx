import React from "react";
import { Upload, Camera, X } from "lucide-react";

// เดียวกับ GLASS_PANEL/GLASS_IDLE ที่ใช้ทั้งเว็บ
const GLASS_PANEL =
  "border border-neutral-200/70 bg-white/50 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)]";
const GLASS_IDLE =
  "border border-neutral-200/70 bg-white/60 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_2px_8px_rgba(0,0,0,0.06)]";

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
    <div className={`p-6 rounded-3xl space-y-4 ${GLASS_PANEL}`}>
      <div className="border-b border-neutral-200/70 pb-3 flex items-center justify-between">
        <h3 className="font-bold text-lg text-neutral-900">
          Product Images{" "}
          <span className="text-sm font-bold text-neutral-500">
            (Max 5 images)
          </span>
        </h3>
        <span className="text-xs text-neutral-500 font-bold">
          Upload at least 1 image
        </span>
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
              className="relative aspect-square rounded-xl overflow-hidden border border-neutral-200/70 group bg-neutral-100"
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
                  className="absolute top-1 right-1 bg-neutral-800/80 text-white hover:bg-red-500 rounded-full p-1 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}

        {/* ปุ่มช่อง + เพิ่มรูป */}
        {imageFiles.length < 5 && !disabled && (
          <label className="aspect-square border-2 border-dashed border-neutral-300 hover:border-orange-400 bg-white/40 backdrop-blur-sm hover:bg-orange-50/50 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all p-2 text-center group">
            <div className="w-10 h-10 rounded-full bg-neutral-100 group-hover:bg-orange-500/15 flex items-center justify-center mb-1 transition-colors">
              <Camera className="w-5 h-5 text-neutral-600 group-hover:text-orange-500" />
            </div>
            <span className="text-xs font-bold text-neutral-600 group-hover:text-orange-500">
              + Add Image
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
        <label
          className={`w-full flex items-center justify-center gap-2 text-xs font-bold text-neutral-700 cursor-pointer mt-2 rounded-xl py-2.5 transition hover:border-orange-300 hover:bg-orange-50/70 hover:text-orange-600 ${GLASS_IDLE}`}
        >
          <Upload className="w-4 h-4 text-orange-500" />
          <span>Upload images from your device</span>
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
