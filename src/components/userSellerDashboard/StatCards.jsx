import React from "react";
import { DollarSign, Clock, ShoppingBag, Calendar, TrendingUp, TrendingDown } from "lucide-react";

export function StatCards({ analytics }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Revenue */}
      <div className="card bg-base-100 border border-base-200/80 shadow-sm p-5 rounded-2xl space-y-2">
        <div className="flex items-center justify-between text-emerald-600">
          <span className="text-xs font-bold text-base-content/70">Total Revenue</span>
          <div className="p-2 bg-emerald-500/10 rounded-xl">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-black text-base-content">฿{analytics.totalSales.toLocaleString()}</p>
        <div
          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
            analytics.monthOverMonthChange >= 0
              ? "text-emerald-600 bg-emerald-500/10"
              : "text-rose-600 bg-rose-500/10"
          }`}
        >
          {analytics.monthOverMonthChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {analytics.monthOverMonthChange >= 0 ? `+${analytics.monthOverMonthChange}%` : `${analytics.monthOverMonthChange}%`} vs last month
        </div>
      </div>

      {/* Pending Escrow */}
      <div className="card bg-base-100 border border-base-200/80 shadow-sm p-5 rounded-2xl space-y-2">
        <div className="flex items-center justify-between text-amber-600">
          <span className="text-xs font-bold text-base-content/70">Pending Escrow</span>
          <div className="p-2 bg-amber-500/10 rounded-xl">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-black text-amber-600">฿{analytics.pendingPayout.toLocaleString()}</p>
        <p className="text-[11px] text-base-content/50 font-medium">Processing & Delivery</p>
      </div>

      {/* Completed Orders */}
      <div className="card bg-base-100 border border-base-200/80 shadow-sm p-5 rounded-2xl space-y-2">
        <div className="flex items-center justify-between text-primary">
          <span className="text-xs font-bold text-base-content/70">Completed Orders</span>
          <div className="p-2 bg-primary/10 rounded-xl">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-black text-base-content">{analytics.completedCount}</p>
        <p className="text-[11px] text-base-content/50 font-medium">Successful deliveries</p>
      </div>

      {/* Average Order Value */}
      <div className="card bg-base-100 border border-base-200/80 shadow-sm p-5 rounded-2xl space-y-2">
        <div className="flex items-center justify-between text-indigo-600">
          <span className="text-xs font-bold text-base-content/70">Avg. Order Value</span>
          <div className="p-2 bg-indigo-500/10 rounded-xl">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-black text-base-content">฿{analytics.averageOrderValue.toLocaleString()}</p>
        <p className="text-[11px] text-base-content/50 font-medium">Per completed order</p>
      </div>
    </div>
  );
}