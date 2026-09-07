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
// import { useMyListings } from "@/hook/listing/useMyListings"; // Import hook สำหรับดึงรายการสินค้าที่ขาย (ถ้ามี)

export default function StatCardsGroup() {
  const { data: buyingOrders = [], isLoading: isLoadingBuying } = useBuyingOrders();
  const { data: sellingOrders = [], isLoading: isLoadingSelling } = useSellingOrders();
  // const { data: myListings = [] } = useMyListings(); // หรือดึงรายการประกาศขายจาก hook ของคุณ

  // 1. Buying: จำนวนรายการคำสั่งซื้อของฉันที่มีคนกดซื้อและอยู่ระหว่างดำเนินการ/ชำระเงินแล้ว
  const buyingCount = buyingOrders.filter((order) =>
    [
      "PAID",
      "SELLER_SHIPPING",
      "INSPECTION_PENDING",
      "INSPECTING",
      "NEEDS_REVIEW",
      "VERIFIED",
      "SHIPPING_TO_BUYER",
      "COMPLETED",
    ].includes(order.status)
  ).length;

  // 2. Selling: รายการของทั้งหมดที่ฉันขาย (นับจากคำสั่งซื้อขายที่ดำเนินการอยู่ หรือจำนวนประกาศขาย)
  const sellingCount = sellingOrders.filter(
    (order) => order.status !== "CANCELLED" && order.status !== "REJECTED"
  ).length;

  // 3. Pending Verification: รายการที่สินค้ายังอยู่กับ Admin เพื่อตรวจ SPEC
  const pendingVerificationCount = sellingOrders.filter((order) =>
    ["INSPECTION_PENDING", "INSPECTING", "NEEDS_REVIEW"].includes(order.status)
  ).length;

  // 4. Rejected: สินค้าที่โดน Reject กลับ (Logic กรองคำสั่งซื้อที่ถูกปฏิเสธ)
  const rejectedCount = sellingOrders.filter(
    (order) => order.status === "REJECTED"
  ).length;

  const stats = [
    {
      label: "Buying",
      value: buyingCount,
      icon: ShoppingBag,
      color: "text-blue-500 dark:text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "group-hover:border-blue-500/40",
      glowColor: "group-hover:shadow-blue-500/10",
    },
    {
      label: "Selling",
      value: sellingCount,
      icon: Tag,
      color: "text-emerald-500 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "group-hover:border-emerald-500/40",
      glowColor: "group-hover:shadow-emerald-500/10",
    },
    {
      label: "Pending Verification",
      value: pendingVerificationCount,
      icon: ShieldCheck,
      color: "text-amber-500 dark:text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "group-hover:border-amber-500/40",
      glowColor: "group-hover:shadow-amber-500/10",
    },
    {
      label: "Rejected Items",
      value: rejectedCount,
      icon: XCircle,
      color: "text-rose-500 dark:text-rose-400",
      bgColor: "bg-rose-500/10",
      borderColor: "group-hover:border-rose-500/40",
      glowColor: "group-hover:shadow-rose-500/10",
    },
  ];

  if (isLoadingBuying || isLoadingSelling) {
    return <StatCardsGroupSkeleton />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map((item, idx) => {
        const IconComponent = item.icon;
        return (
          <div
            key={idx}
            className={`group relative card bg-base-100 border border-base-200/80 p-4 rounded-2xl flex flex-row items-center justify-between cursor-pointer shadow-sm hover:shadow-xl ${item.glowColor} ${item.borderColor} transition-all duration-300 hover:-translate-y-0.5 overflow-hidden`}
          >
            {/* Soft Glow Background Effect */}
            <div
              className={`absolute -right-6 -bottom-6 w-20 h-20 ${item.bgColor} rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
            />

            <div className="flex items-center gap-3.5 relative z-10 min-w-0">
              <div
                className={`p-3 rounded-xl ${item.bgColor} ${item.color} group-hover:scale-110 transition-transform duration-300 shrink-0`}
              >
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-base-content/60 block truncate">
                  {item.label}
                </span>
                <span className="text-2xl font-black text-base-content tracking-tight mt-0.5 block">
                  {item.value}
                </span>
              </div>
            </div>

            <div className="p-1 rounded-full bg-base-200/50 group-hover:bg-primary/10 group-hover:text-primary text-base-content/40 transition-colors shrink-0 z-10">
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function StatCardsGroupSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="card bg-base-100 border border-base-200 p-4 rounded-2xl flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5 w-full">
            <div className="skeleton w-11 h-11 rounded-xl shrink-0" />
            <div className="space-y-2 w-full">
              <div className="skeleton h-3 w-16 rounded-md" />
              <div className="skeleton h-6 w-8 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}