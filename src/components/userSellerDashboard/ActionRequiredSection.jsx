import React from "react";
import { Truck, CheckCircle2, MessageCircle, ChevronRight } from "lucide-react";

export default function ActionRequiredSection() {
  return (
    <div className="card hardware-surface p-5 space-y-4">
      <h3 className="font-bold text-base text-base-content border-b border-base-300/60 pb-3">
        รายการที่ต้องดำเนินการ
      </h3>

      <div className="space-y-3">
        {/* Action 1 */}
        <div className="flex items-center justify-between p-3 bg-base-200/40 rounded-xl border border-base-200 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-orange-500/10 text-accent shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-base-content truncate">
                ส่ง RTX 3060 Ti ให้ศูนย์ตรวจสอบ ภายใน 1 วัน
              </p>
              <p className="text-[11px] text-base-content/60">คำสั่งซื้อ #ORD-240501-0001</p>
            </div>
          </div>
          <button type="button" className="btn btn-sm btn-outline text-xs font-bold shrink-0">
            กรอกเลขพัสดุ <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ActionRequiredSectionSkeleton() {
  return (
    <div className="card hardware-surface p-5 space-y-4">
      <div className="skeleton h-5 w-40 border-b border-base-300 pb-3" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between p-3 border border-base-200 rounded-xl">
            <div className="flex items-center gap-3 w-full">
              <div className="skeleton w-9 h-9 rounded-lg shrink-0" />
              <div className="space-y-1.5 w-full">
                <div className="skeleton h-3 w-3/4" />
                <div className="skeleton h-3 w-1/3" />
              </div>
            </div>
            <div className="skeleton h-8 w-24 rounded-lg shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}