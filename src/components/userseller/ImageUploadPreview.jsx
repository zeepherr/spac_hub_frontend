import React, { useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

export default function ImageUploadPreview({ images, setImages }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImages(files);
      setPreviewUrl(URL.createObjectURL(files[0]));
    }
  };

  return (
    <div className="hardware-surface p-5 rounded-2xl bg-white border border-[#d4d4d4] space-y-4">
      <div className="flex items-center gap-2 border-b border-[#d4d4d4] pb-2">
        <div className="hardware-indicator" />
        <h4 className="hardware-label text-xs">ตัวอย่างการแสดงผล</h4>
      </div>

      {/* Box Preview */}
      <div className="border border-dashed border-[#a3a3a3] rounded-xl p-4 flex flex-col items-center justify-center min-h-[160px] bg-[#f5f5f5] relative overflow-hidden">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Product Preview"
            className="w-full h-36 object-contain rounded-lg"
          />
        ) : (
          <div className="text-center space-y-2 text-[#737373]">
            <ImageIcon className="w-8 h-8 mx-auto stroke-1" />
            <span className="text-xs block">ระบุรูปภาพสินค้า</span>
          </div>
        )}
      </div>

      {/* Upload Button Input */}
      <div>
        <label className="btn btn-outline w-full cursor-pointer flex items-center justify-center gap-2 border-[#d4d4d4] hover:bg-[#ebebeb]">
          <Upload className="w-4 h-4 text-[#f97316]" />
          <span className="text-xs font-bold text-[#171717]">อัปโหลดรูปภาพ</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}