import React from "react";
import { ChevronRight, TrendingUp } from "lucide-react";

export default function SalesSummarySection() {
  return (
    <div className="card hardware-surface p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-base-300/60 pb-3">
        <h3 className="font-bold text-base text-base-content">ยอดขายของฉัน</h3>
        <button type="button" className="text-xs text-base-content/70 hover:text-accent font-semibold flex items-center gap-1">
          ดูรายงานทั้งหมด <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[11px] font-semibold text-base-content/60">ยอดขายทั้งหมด</p>
          <p className="text-xl font-black text-base-content mt-0.5">฿24,800</p>
          <span className="text-[10px] text-success font-bold flex items-center gap-0.5 mt-0.5">
            <TrendingUp className="w-3 h-3" /> +18% จาก 30 วันที่แล้ว
          </span>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-base-content/60">รอบปล่อยเงิน</p>
          <p className="text-xl font-black text-accent mt-0.5">฿8,900</p>
          <p className="text-[10px] text-base-content/50 mt-0.5">จะโอนเมื่อผู้ซื้อได้รับสินค้า</p>
        </div>
      </div>

      {/* Chart Skeleton/Placeholder */}
      <div className="h-20 w-full bg-base-200/50 rounded-lg border border-dashed border-base-300 flex items-center justify-center text-xs text-base-content/40">
        [ Bar / Line Chart Graphic ]
      </div>
    </div>
  );
}

export function SalesSummarySectionSkeleton() {
  return (
    <div className="card hardware-surface p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-base-300/60 pb-3">
        <div className="skeleton h-5 w-28" />
        <div className="skeleton h-4 w-20" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="skeleton h-3 w-20" />
          <div className="skeleton h-6 w-24" />
          <div className="skeleton h-3 w-16" />
        </div>
        <div className="space-y-2">
          <div className="skeleton h-3 w-20" />
          <div className="skeleton h-6 w-24" />
          <div className="skeleton h-3 w-28" />
        </div>
      </div>
      <div className="skeleton h-20 w-full rounded-lg" />
    </div>
  );
}