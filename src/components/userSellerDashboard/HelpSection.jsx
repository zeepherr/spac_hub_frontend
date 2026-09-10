import React from "react";
import { HelpCircle, ChevronRight } from "lucide-react";

// เดียวกับ GLASS_PANEL/CTA_GLASS ที่ใช้ทั้งเว็บ
const GLASS_PANEL =
  "border border-neutral-200/70 bg-white/50 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)]";
const CTA_GLASS =
  "bg-orange-500 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(249,115,22,0.3)] hover:bg-orange-600";

export default function HelpSection() {
  return (
    <div
      className={`rounded-2xl p-4 flex items-center justify-between gap-3 ${GLASS_PANEL}`}
    >
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-neutral-900">
            มีปัญหากับคำสั่งซื้อ?
          </p>
          <p className="text-[11px] text-neutral-500">
            ทีมงานพร้อมช่วยเหลือตลอด 24 ชม.
          </p>
        </div>
      </div>
      <button
        type="button"
        className={`inline-flex cursor-pointer items-center text-xs font-bold shrink-0 rounded-xl px-3 py-2 transition ${CTA_GLASS}`}
      >
        เปิดเคสช่วยเหลือ <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
      </button>
    </div>
  );
}

export function HelpSectionSkeleton() {
  return (
    <div
      className={`rounded-2xl p-4 flex items-center justify-between gap-3 ${GLASS_PANEL}`}
    >
      <div className="flex items-center gap-3 w-full">
        <div className="skeleton w-10 h-10 rounded-xl shrink-0" />
        <div className="space-y-1.5 w-full">
          <div className="skeleton h-3 w-32" />
          <div className="skeleton h-3 w-48" />
        </div>
      </div>
      <div className="skeleton h-8 w-28 rounded-lg shrink-0" />
    </div>
  );
}
