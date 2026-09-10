import React, { useState } from "react";
import {
  ChevronRight,
  PackageX,
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { OrderItemCard } from "./OrderItemCard";
import { useSellingOrders } from "@/hook/order/useSellingOrder";
import { useNavigate } from "react-router";
import ShipOrderModal from "./ShipOrderModal";

const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL || "";
const DEFAULT_IMAGE = "https://placehold.co/150x150?text=No+Image";

// เดียวกับ GLASS_PANEL/GLASS_MODAL/CTA_GLASS ที่ใช้ทั้งเว็บ
const GLASS_PANEL =
  "border border-neutral-200/70 bg-white/50 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)]";
const GLASS_MODAL =
  "border border-neutral-200/80 bg-white/92 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_20px_40px_rgba(0,0,0,0.14)]";
const CTA_GLASS =
  "bg-orange-500 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(249,115,22,0.3)] hover:bg-orange-600";

export default function RecentOrdersSection() {
  const navigate = useNavigate();
  const { data: sellingOrders = [], isLoading, isError } = useSellingOrders();
  console.log("sellingOrders", sellingOrders);
  // State for Modal Management
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isShipModalOpen, setIsShipModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const activeSellingOrders = (sellingOrders || [])
    .filter(
      (order) =>
        order.status !== "PENDING" && order.status !== "AWAITING_PAYMENT",
    )
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt || 0) -
        new Date(a.updatedAt || a.createdAt || 0),
    );

  const handleCardClick = (order) => {
    setSelectedOrder(order);
    if (order.status === "PAID") {
      setIsShipModalOpen(true);
    } else {
      setIsDetailModalOpen(true);
    }
  };

  if (isLoading) return <RecentOrdersSectionSkeleton />;

  return (
    <>
      <div
        className={`rounded-2xl p-6 space-y-4 h-150 flex flex-col ${GLASS_PANEL}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200/70 pb-4 shrink-0">
          <h3 className="font-bold text-xl text-neutral-900">
            My Sales Status
          </h3>
          <button
            type="button"
            onClick={() => navigate("/user/sell/selling-orders")}
            className="text-sm text-neutral-500 hover:text-orange-600 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            View All Sales <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Orders List Container */}
        <div className="space-y-4 flex-1 pr-2 p-1.5 scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent overflow-y-auto">
          {isError ? (
            <div className="text-center py-8 text-sm text-red-500">
              Unable to load order data.
            </div>
          ) : activeSellingOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-neutral-400 space-y-2">
              <PackageX className="w-12 h-12 stroke-1" />
              <p className="text-base">No active sales status updates found</p>
            </div>
          ) : (
            activeSellingOrders.map((order) => (
              <OrderItemCard
                key={order.id}
                order={order}
                onClick={() => handleCardClick(order)}
              />
            ))
          )}
        </div>
      </div>

      <ShipOrderModal
        isOpen={isShipModalOpen}
        onClose={() => {
          setIsShipModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
      />

      <OrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
      />
    </>
  );
}

// Sub-component: OrderDetailModal สำหรับแสดง Status & Details (เฉพาะไฟล์นี้ ไม่ใช่ตัวที่ import จาก OrderDetailModal.jsx)
function OrderDetailModal({ isOpen, onClose, order }) {
  if (!isOpen || !order) return null;

  const item = order.listing || order.product || {};

  const coverImage =
    item.images?.find((img) => img.isCover) || item.images?.[0];

  let imageUrl = DEFAULT_IMAGE;
  const rawUrl = coverImage?.imageUrl || coverImage?.url;
  const rawKey = coverImage?.imageKey || coverImage?.key;

  if (rawUrl) {
    imageUrl = rawUrl;
  } else if (rawKey) {
    imageUrl = rawKey.startsWith("http")
      ? rawKey
      : `${R2_PUBLIC_URL}/${rawKey}`;
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "SELLER_SHIPPING":
        return {
          label: "Shipping to Admin",
          color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
          icon: Truck,
        };
      case "INSPECTION_PENDING":
      case "INSPECTING":
      case "NEEDS_REVIEW":
        return {
          label: "Admin Verification Pending",
          color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
          icon: ShieldCheck,
        };
      case "VERIFIED":
      case "SHIPPING_TO_BUYER":
        return {
          label: "Shipping to Buyer",
          color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
          icon: Package,
        };
      case "COMPLETED":
        return {
          label: "Completed",
          color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
          icon: CheckCircle2,
        };
      case "REJECTED":
      case "CANCELLED":
        return {
          label: "Rejected / Cancelled",
          color: "bg-rose-500/10 text-rose-500 border-rose-500/20",
          icon: AlertCircle,
        };
      default:
        return {
          label: status,
          color: "bg-neutral-100 text-neutral-600 border-neutral-300",
          icon: Clock,
        };
    }
  };

  const statusInfo = getStatusBadge(order.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className={`rounded-3xl max-w-lg w-full p-6 relative space-y-6 animate-in fade-in zoom-in-95 duration-200 ${GLASS_MODAL}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="flex size-8 cursor-pointer items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 absolute right-4 top-4"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-neutral-200/70 pb-4">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
            Order Details
          </span>
          <h3 className="text-lg font-bold text-neutral-900 mt-0.5">
            Order #{order.orderNumber || order.id}
          </h3>
        </div>

        {/* Current Status Badge Banner */}
        <div
          className={`p-4 rounded-2xl border flex items-center gap-3.5 ${statusInfo.color}`}
        >
          <div className="p-2.5 rounded-xl bg-white/40 shrink-0">
            <StatusIcon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase opacity-80 block">
              Current Status
            </span>
            <span className="text-base font-bold block">
              {statusInfo.label}
            </span>
          </div>
        </div>

        {/* Product Details Card */}
        <div className="flex gap-4 p-3 bg-white/40 backdrop-blur-sm rounded-2xl border border-neutral-200/70">
          <div className="w-20 h-20 bg-neutral-100 rounded-xl overflow-hidden shrink-0 border border-neutral-200/70 flex items-center justify-center">
            <img
              src={imageUrl}
              alt={item.title || "Product"}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <h4 className="font-bold text-sm text-neutral-900 truncate">
              {item.title || "Untitled Product"}
            </h4>
            <p className="text-xs text-neutral-500">
              Category: {item.category?.name || "General"}
            </p>
            <p className="text-sm font-black text-orange-500">
              ฿
              {Number(
                order.agreedPrice || order.totalPrice || item.price || 0,
              ).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Order Information Grid */}
        <div className="space-y-2 text-xs bg-white/30 backdrop-blur-sm p-4 rounded-2xl border border-neutral-200/70">
          <div className="flex justify-between">
            <span className="text-neutral-500">Order Date:</span>
            <span className="font-semibold text-neutral-900">
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString("th-TH")
                : "-"}
            </span>
          </div>
          {order.trackingNumber && (
            <div className="flex justify-between">
              <span className="text-neutral-500">Tracking Number:</span>
              <span className="font-mono font-bold text-orange-500">
                {order.trackingNumber}
              </span>
            </div>
          )}
          {order.courier && (
            <div className="flex justify-between">
              <span className="text-neutral-500">Courier:</span>
              <span className="font-semibold text-neutral-900">
                {order.courier}
              </span>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className={`w-full rounded-xl py-2.5 font-bold cursor-pointer transition ${CTA_GLASS}`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function RecentOrdersSectionSkeleton() {
  return (
    <div
      className={`rounded-2xl p-6 space-y-4 h-[600px] flex flex-col ${GLASS_PANEL}`}
    >
      <div className="flex items-center justify-between border-b border-neutral-200/70 pb-4">
        <div className="skeleton h-6 w-40" />
        <div className="skeleton h-4 w-24" />
      </div>
      <div className="space-y-4 flex-1 overflow-hidden">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-5 border border-neutral-200/70 rounded-2xl space-y-4"
          >
            <div className="flex justify-between items-center">
              <div className="skeleton h-5 w-28 rounded-md" />
              <div className="skeleton h-6 w-20 rounded-full" />
            </div>
            <div className="flex gap-5 items-center">
              <div className="skeleton w-[90px] h-[90px] rounded-xl shrink-0" />
              <div className="space-y-3 flex-1">
                <div className="skeleton h-5 w-2/3" />
                <div className="skeleton h-6 w-1/3" />
              </div>
            </div>
            <div className="skeleton h-8 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
