import React from "react";
import { Sparkles, Loader2, Bot, Save } from "lucide-react";

export default function AiProcessingCard({ isAiLoading, isSaving }) {
  // ถ้าไม่ได้กำลังอ่าน AI และ ไม่ได้กำลังบันทึก ให้ซ่อนการ์ดไปเลย (หายไปเองอัตโนมัติ)
  if (!isAiLoading && !isSaving) return null;

  return (
    <div className="w-full bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-4 flex items-center gap-4 animate-pulse shadow-md mb-6">
      <div className="p-3 rounded-xl bg-amber-500 text-white shrink-0">
        {isSaving ? (
          <Save className="w-6 h-6 animate-bounce" />
        ) : (
          <Bot className="w-6 h-6 animate-bounce" />
        )}
      </div>
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <h4 className="font-extrabold text-sm text-amber-600 dark:text-amber-400">
            {isSaving ? "กำลังบันทึกข้อมูลสินค้า..." : "AI กำลังกรอกข้อมูล..."}
          </h4>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
        </div>
        <p className="text-xs text-base-content/70">
          {isSaving
            ? "ระบบกำลังทำการบันทึกข้อมูลลงในระบบ กรุณารอสักครู่..."
            : "ระบบกำลังอ่านข้อความจากรูปภาพและลงฟิลด์ต่างๆ ให้โดยอัตโนมัติ"}
        </p>
      </div>
    </div>
  );
}