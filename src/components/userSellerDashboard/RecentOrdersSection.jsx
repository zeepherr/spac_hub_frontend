import React from "react";
import { ChevronRight } from "lucide-react";

export default function RecentOrdersSection() {
  return (
    <div className="card hardware-surface p-5 space-y-4 h-full">
      <div className="flex items-center justify-between border-b border-base-300/60 pb-3">
        <h3 className="font-bold text-base text-base-content">คำสั่งซื้อล่าสุด</h3>
        <button type="button" className="text-xs text-base-content/70 hover:text-accent font-semibold flex items-center gap-1">
          ดูคำสั่งซื้อทั้งหมด <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Item List Demo */}
      <div className="space-y-4">
        {/* Order Item 1 */}
        <div className="p-3 bg-base-200/40 rounded-xl border border-base-200 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-base-content/80">#ORD-240501-0001</span>
            <span className="badge badge-sm badge-info font-medium">ผู้ซื้อ</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-base-300 rounded-lg overflow-hidden shrink-0">
              <img src="https://via.placeholder.com/60" alt="GPU" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">GALAX RTX 3060 Ti (1-Click OC)</p>
              <p className="text-sm font-black text-accent mt-0.5">฿8,900</p>
            </div>
          </div>
          {/* Stepper Status */}
          <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-semibold pt-2 border-t border-base-300/40 text-base-content/60">
            <div className="text-success font-bold">ชำระแล้ว<br/><span className="text-[9px] font-normal">1 พ.ค. 67</span></div>
            <div className="text-success font-bold">ผู้ขายส่งสินค้า<br/><span className="text-[9px] font-normal">2 พ.ค. 67</span></div>
            <div className="text-accent font-bold">SPEC CHECK<br/><span className="text-[9px] font-normal">3 พ.ค. 67</span></div>
            <div className="opacity-40">ส่งถึงคุณ<br/><span className="text-[9px]"></span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RecentOrdersSectionSkeleton() {
  return (
    <div className="card hardware-surface p-5 space-y-4 h-full">
      <div className="flex items-center justify-between border-b border-base-300/60 pb-3">
        <div className="skeleton h-5 w-32" />
        <div className="skeleton h-4 w-24" />
      </div>
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="p-3 bg-base-200/40 rounded-xl space-y-3">
            <div className="flex justify-between">
              <div className="skeleton h-3 w-28" />
              <div className="skeleton h-4 w-12 rounded-full" />
            </div>
            <div className="flex gap-3 items-center">
              <div className="skeleton w-14 h-14 rounded-lg shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-4 w-20" />
              </div>
            </div>
            <div className="skeleton h-8 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}