import React from "react";
import { HelpCircle, ChevronRight } from "lucide-react";

export default function HelpSection() {
  return (
    <div className="card hardware-surface p-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-accent/10 text-accent">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-base-content">มีปัญหากับคำสั่งซื้อ?</p>
          <p className="text-[11px] text-base-content/60">ทีมงานพร้อมช่วยเหลือตลอด 24 ชม.</p>
        </div>
      </div>
      <button type="button" className="btn btn-sm btn-accent text-xs font-bold shrink-0">
        เปิดเคสช่วยเหลือ <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
      </button>
    </div>
  );
}

export function HelpSectionSkeleton() {
  return (
    <div className="card hardware-surface p-4 flex items-center justify-between gap-3">
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