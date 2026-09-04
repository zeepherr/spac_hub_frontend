import React from "react";
import { ChevronRight, TrendingUp, DollarSign, Wallet, Activity } from "lucide-react";

export default function SalesSummarySection() {
  return (
    <div className="card bg-base-100 border border-base-200/80 shadow-sm hover:shadow-md transition-all duration-300 p-6 space-y-5 rounded-3xl overflow-hidden relative">
      {/* Background Subtle Gradient Highlight */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-base-200 pb-3.5 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 text-primary rounded-xl">
            <Activity className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-lg text-base-content tracking-tight">ยอดขายของฉัน</h3>
        </div>
        <button 
          type="button" 
          className="text-xs text-base-content/70 hover:text-primary font-bold flex items-center gap-1 transition-colors bg-base-200/50 hover:bg-primary/10 px-3 py-1.5 rounded-full"
        >
          ดูรายงานทั้งหมด <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 gap-3.5 relative z-10">
        {/* Card 1: ยอดขายทั้งหมด */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">ยอดขายทั้งหมด</p>
            <div className="p-1.5 bg-emerald-500/15 text-emerald-600 rounded-lg">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-black text-base-content tracking-tight">฿24,800</p>
          <div className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
            <TrendingUp className="w-3 h-3" /> +18% จาก 30 วันก่อน
          </div>
        </div>

        {/* Card 2: รอบปล่อยเงิน */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-primary">รอบปล่อยเงิน</p>
            <div className="p-1.5 bg-primary/15 text-primary rounded-lg">
              <Wallet className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-black text-primary tracking-tight">฿8,900</p>
          <p className="text-[11px] text-base-content/60 font-medium">จะโอนเมื่อผู้ซื้อได้รับสินค้า</p>
        </div>
      </div>

      {/* Modern Chart Graphic Visualizer */}
      <div className="relative h-24 w-full bg-base-200/40 rounded-2xl border border-base-200/80 p-3 flex flex-col justify-between overflow-hidden group">
        <div className="flex items-center justify-between text-[11px] font-bold text-base-content/50 relative z-10">
          <span>แนวโน้มการเติบโต</span>
          <span className="text-emerald-500 font-extrabold">สัปดาห์นี้</span>
        </div>

        {/* SVG Area Chart Representation */}
        <div className="absolute inset-x-0 bottom-0 h-16 opacity-80 group-hover:opacity-100 transition-opacity">
          <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Chart Area Fill */}
            <path
              d="M0,35 Q15,20 30,28 T60,10 T80,22 T100,5 L100,40 L0,40 Z"
              fill="url(#salesGradient)"
            />
            {/* Chart Stroke Line */}
            <path
              d="M0,35 Q15,20 30,28 T60,10 T80,22 T100,5"
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function SalesSummarySectionSkeleton() {
  return (
    <div className="card bg-base-100 border border-base-200 p-6 space-y-5 rounded-3xl">
      <div className="flex items-center justify-between border-b border-base-200 pb-3.5">
        <div className="skeleton h-6 w-32 rounded-lg" />
        <div className="skeleton h-7 w-24 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-3.5">
        <div className="p-4 rounded-2xl border border-base-200 space-y-3">
          <div className="flex justify-between items-center">
            <div className="skeleton h-3 w-20" />
            <div className="skeleton h-6 w-6 rounded-lg" />
          </div>
          <div className="skeleton h-7 w-24" />
          <div className="skeleton h-4 w-28 rounded-md" />
        </div>
        <div className="p-4 rounded-2xl border border-base-200 space-y-3">
          <div className="flex justify-between items-center">
            <div className="skeleton h-3 w-20" />
            <div className="skeleton h-6 w-6 rounded-lg" />
          </div>
          <div className="skeleton h-7 w-24" />
          <div className="skeleton h-3 w-32" />
        </div>
      </div>
      <div className="skeleton h-24 w-full rounded-2xl" />
    </div>
  );
}