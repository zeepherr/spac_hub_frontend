import React from "react";
import {
  ShoppingBag,
  Tag,
  ShieldCheck,
  XCircle,
  ChevronRight,
} from "lucide-react";
import { useBuyingOrders } from "@/hook/order/useBuyingOrders";
import { useSellingOrders } from "@/hook/order/useSellingOrder";
import { useNavigate } from "react-router";

// glass shadow เดียวกับ GLASS_PANEL ที่ใช้ทั้งเว็บ ทำให้การ์ดดูเป็นกระจกมี highlight บาง ๆ
const GLASS_SHADOW =
  "shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_12px_28px_rgba(0,0,0,0.08)]";

export default function StatCardsGroup() {
  const navigate = useNavigate();
  const { data: buyingOrders = [], isLoading: isLoadingBuying } =
    useBuyingOrders();
  const { data: sellingOrders = [], isLoading: isLoadingSelling } =
    useSellingOrders();

  const buyingCount = sellingOrders.filter((order) => {
    const status = String(order.status || "").toUpperCase();
    return ["COMPLETED", "DELIVERED", "RECEIVED", "SUCCESS"].includes(status);
  }).length;

  const sellingCount = sellingOrders.filter((order) => {
    const status = String(order.status || "").toUpperCase();
    return status !== "CANCELLED" && status !== "REJECTED";
  }).length;

  const pendingVerificationCount = sellingOrders.filter((order) => {
    const status = String(order.status || "").toUpperCase();
    return ["INSPECTION_PENDING", "INSPECTING", "NEEDS_REVIEW"].includes(
      status,
    );
  }).length;

  const rejectedCount = sellingOrders.filter((order) => {
    const status = String(order.status || "").toUpperCase();
    return status === "REJECTED";
  }).length;

  // ลด opacity ของสีพื้นหลัง + เพิ่ม backdrop-blur ให้ทุกการ์ดดูเป็นกระจกโปร่งแสง (liquid glass) แทนสีทึบเดิม
  const stats = [
    {
      label: "Buying",
      value: buyingCount,
      icon: ShoppingBag,
      actionText: "View completed →",
      path: "/user/sell/selling-orders",
      filterTab: "COMPLETED",
      cardStyle:
        "bg-amber-50/40 backdrop-blur-xl border-orange-200/60 hover:border-orange-300",
      iconStyle: "bg-orange-100/70 text-orange-600",
      textStyle: "text-orange-500 group-hover:text-orange-600",
    },
    {
      label: "Selling",
      value: sellingCount,
      icon: Tag,
      actionText: "View orders →",
      path: "/user/sell/selling-orders",
      filterTab: "ALL",
      cardStyle:
        "bg-white/50 backdrop-blur-xl border-neutral-200/70 hover:border-neutral-300",
      iconStyle: "bg-neutral-100/80 text-neutral-800",
      textStyle: "text-orange-500 group-hover:text-orange-600",
    },
    {
      label: "Pending Verification",
      value: pendingVerificationCount,
      icon: ShieldCheck,
      actionText: "View details →",
      path: "/user/sell/selling-orders",
      filterTab: "INSPECTION",
      cardStyle:
        "bg-amber-50/40 backdrop-blur-xl border-orange-200/60 hover:border-orange-300",
      iconStyle: "bg-orange-100/70 text-orange-600",
      textStyle: "text-orange-500 group-hover:text-orange-600",
    },
    {
      label: "Rejected Items",
      value: rejectedCount,
      icon: XCircle,
      actionText: "View items →",
      path: "/user/sell/selling-orders",
      filterTab: "CANCELLED",
      cardStyle:
        "bg-rose-50/40 backdrop-blur-xl border-rose-200/60 hover:border-rose-300", // 🔴 การ์ดสีแดง (กระจก)
      iconStyle: "bg-rose-100 text-rose-600", // 🔴 ไอคอนสีแดง
      textStyle: "text-rose-600 group-hover:text-rose-700", // 🔴 ข้อความสีแดง
    },
  ];

  if (isLoadingBuying || isLoadingSelling) {
    return <StatCardsGroupSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 ">
      {stats.map((item, idx) => {
        const IconComponent = item.icon;
        return (
          <div
            key={idx}
            onClick={() =>
              navigate(item.path, { state: { activeTab: item.filterTab } })
            }
            className={`group relative rounded-3xl p-5 md:p-6 transition-all duration-300 cursor-pointer flex items-center gap-4 border hardware-surface ${GLASS_SHADOW} ${item.cardStyle}`}
          >
            {/* Left Icon Container */}
            <div
              className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${item.iconStyle}`}
            >
              <IconComponent className="w-7 h-7 md:w-8 md:h-8 stroke-[1.8]" />
            </div>

            {/* Right Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
                  {item.value}
                </span>
                <span className="text-xs font-semibold text-neutral-400">
                  items
                </span>
              </div>

              <p className="text-sm font-bold text-neutral-700 truncate mt-0.5">
                {item.label}
              </p>

              {/* Action Link */}
              <div
                className={`inline-flex items-center gap-1 text-xs font-bold transition-colors mt-2 ${item.textStyle}`}
              >
                <span>{item.actionText}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function StatCardsGroupSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="rounded-3xl bg-neutral-50 border border-neutral-200/60 p-5 flex items-center gap-4 animate-pulse"
        >
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-neutral-200 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-7 w-12 bg-neutral-200 rounded-lg" />
            <div className="h-4 w-24 bg-neutral-200 rounded-md" />
            <div className="h-3 w-16 bg-neutral-200 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
