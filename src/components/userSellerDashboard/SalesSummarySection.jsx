import React, { useMemo } from "react";
import {
  ChevronRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useSellingOrders } from "@/hook/order/useSellingOrder";

// เดียวกับ GLASS_PANEL ที่ใช้ทั้งเว็บ
const GLASS_PANEL =
  "border border-neutral-200/70 bg-white/50 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)]";

export default function SalesSummarySection() {
  const navigate = useNavigate();
  const { data: sellingOrders = [], isLoading } = useSellingOrders();

  const { totalSales, pendingPayout, monthlyData, monthOverMonthChange } =
    useMemo(() => {
      if (!sellingOrders || sellingOrders.length === 0) {
        return {
          totalSales: 0,
          pendingPayout: 0,
          monthlyData: [],
          monthOverMonthChange: 0,
        };
      }

      const pendingStatuses = [
        "PAID",
        "SELLER_SHIPPING",
        "INSPECTION_PENDING",
        "INSPECTING",
        "NEEDS_REVIEW",
        "VERIFIED",
        "SHIPPING_TO_BUYER",
      ];

      let salesTotal = 0;
      let payoutTotal = 0;

      const now = new Date();
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const label = d.toLocaleString("en-US", { month: "short" });
        months.push({ key: monthKey, label, total: 0 });
      }

      const monthlyMap = new Map(months.map((m) => [m.key, m]));

      sellingOrders.forEach((order) => {
        const price = Number(order.agreedPrice || order.totalPrice || 0);

        if (order.status === "COMPLETED") {
          salesTotal += price;

          if (order.createdAt) {
            const orderDate = new Date(order.createdAt);
            const orderMonthKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, "0")}`;

            if (monthlyMap.has(orderMonthKey)) {
              monthlyMap.get(orderMonthKey).total += price;
            }
          }
        }

        if (pendingStatuses.includes(order.status)) {
          payoutTotal += price;
        }
      });

      const chartData = Array.from(monthlyMap.values());

      const currentMonthSales = chartData[chartData.length - 1]?.total || 0;
      const previousMonthSales = chartData[chartData.length - 2]?.total || 0;

      let momChange = 0;
      if (previousMonthSales > 0) {
        momChange = Math.round(
          ((currentMonthSales - previousMonthSales) / previousMonthSales) * 100,
        );
      } else if (currentMonthSales > 0) {
        momChange = 100;
      }

      return {
        totalSales: salesTotal,
        pendingPayout: payoutTotal,
        monthlyData: chartData,
        monthOverMonthChange: momChange,
      };
    }, [sellingOrders]);

  const maxSalesInChart = useMemo(() => {
    const max = Math.max(...monthlyData.map((d) => d.total), 0);
    return max === 0 ? 1 : max;
  }, [monthlyData]);

  if (isLoading) return <SalesSummarySectionSkeleton />;

  return (
    <div
      className={`p-6 space-y-5 rounded-3xl overflow-hidden relative transition-all duration-300 hover:shadow-lg ${GLASS_PANEL}`}
    >
      {/* Background Subtle Gradient Highlight */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200/70 pb-3.5 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-orange-500/10 text-orange-500 rounded-xl">
            <Activity className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-lg text-neutral-900 tracking-tight">
            Sales Summary
          </h3>
        </div>
        <button
          type="button"
          onClick={() => navigate("/user/sell/sales-report")}
          className="text-xs text-neutral-500 hover:text-orange-600 font-bold flex items-center gap-1 transition-colors bg-white/40 backdrop-blur-sm hover:bg-orange-50/70 px-3 py-1.5 rounded-full cursor-pointer"
        >
          View Full Report <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 gap-3.5 relative z-10">
        {/* Total Sales */}
        <div className="p-4 rounded-2xl bg-linear-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-emerald-700">Total Sales</p>
            <div className="p-1.5 bg-emerald-500/15 text-emerald-600 rounded-lg">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-black text-neutral-900 tracking-tight">
            ฿{totalSales.toLocaleString()}
          </p>
          <div
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
              monthOverMonthChange >= 0
                ? "text-emerald-600 bg-emerald-500/10"
                : "text-rose-600 bg-rose-500/10"
            }`}
          >
            {monthOverMonthChange >= 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {monthOverMonthChange >= 0
              ? `+${monthOverMonthChange}%`
              : `${monthOverMonthChange}%`}{" "}
            vs last month
          </div>
        </div>

        {/* Pending Payout */}
        <div className="p-4 rounded-2xl bg-linear-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-amber-700">Pending Payout</p>
            <div className="p-1.5 bg-amber-500/15 text-amber-600 rounded-lg">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 tracking-tight">
            ฿{pendingPayout.toLocaleString()}
          </p>
          <p className="text-[11px] text-neutral-500 font-medium">
            Escrowed until buyer confirms delivery
          </p>
        </div>
      </div>

      {/* Monthly Sales Bar Chart Section */}
      <div className="relative bg-white/40 backdrop-blur-sm rounded-2xl border border-neutral-200/70 p-4 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-neutral-500">
          <span>Monthly Sales Trend</span>
          <span className="text-emerald-500 font-extrabold">Last 6 Months</span>
        </div>

        {/* Bar Chart Visualiser */}
        <div className="h-24 flex items-end justify-between gap-2 pt-2">
          {monthlyData.map((item, index) => {
            const heightPercent = Math.max(
              Math.round((item.total / maxSalesInChart) * 100),
              6,
            );
            const isCurrentMonth = index === monthlyData.length - 1;

            return (
              <div
                key={item.key}
                className="flex-1 flex flex-col items-center h-full justify-end group relative"
              >
                <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-800 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-20">
                  ฿{item.total.toLocaleString()}
                </div>

                <div className="w-full bg-neutral-200/50 rounded-t-md h-full flex items-end overflow-hidden">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-md transition-all duration-500 ${
                      isCurrentMonth
                        ? "bg-emerald-500"
                        : "bg-emerald-500/40 group-hover:bg-emerald-500/70"
                    }`}
                  />
                </div>

                <span
                  className={`text-[10px] mt-1 font-bold ${isCurrentMonth ? "text-emerald-500" : "text-neutral-400"}`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function SalesSummarySectionSkeleton() {
  return (
    <div className={`p-6 space-y-5 rounded-3xl ${GLASS_PANEL}`}>
      <div className="flex items-center justify-between border-b border-neutral-200/70 pb-3.5">
        <div className="skeleton h-6 w-32 rounded-lg" />
        <div className="skeleton h-7 w-24 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-3.5">
        <div className="p-4 rounded-2xl border border-neutral-200/70 space-y-3">
          <div className="flex justify-between items-center">
            <div className="skeleton h-3 w-20" />
            <div className="skeleton h-6 w-6 rounded-lg" />
          </div>
          <div className="skeleton h-7 w-24" />
          <div className="skeleton h-4 w-28 rounded-md" />
        </div>
        <div className="p-4 rounded-2xl border border-neutral-200/70 space-y-3">
          <div className="flex justify-between items-center">
            <div className="skeleton h-3 w-20" />
            <div className="skeleton h-6 w-6 rounded-lg" />
          </div>
          <div className="skeleton h-7 w-24" />
          <div className="skeleton h-3 w-32" />
        </div>
      </div>
      <div className="skeleton h-28 w-full rounded-2xl" />
    </div>
  );
}
