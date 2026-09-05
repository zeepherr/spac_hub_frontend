import React from "react";
import { XCircle } from "lucide-react";

const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL || "";
const DEFAULT_IMAGE = "https://placehold.co/150x150?text=No+Image";

// Steps for Stepper (Seller view)
const ORDER_STEPS = [
  { key: "PAID", label: "Paid" },
  { key: "SELLER_SHIP", label: "Ship to Admin" },
  { key: "INSPECTION", label: "SPEC CHECK" },
  { key: "DELIVERY", label: "Deliver to Buyer" },
];

// Calculate step progress based on OrderStatus
const getStepIndex = (status) => {
  switch (status) {
    case "PAID":
      return 0;
    case "SELLER_SHIPPING":
      return 1;
    case "INSPECTION_PENDING":
    case "INSPECTING":
    case "NEEDS_REVIEW":
    case "VERIFIED":
      return 2;
    case "SHIPPING_TO_BUYER":
    case "COMPLETED":
      return 3;
    case "REJECTED":
    case "CANCELLED":
      return -2;
    default:
      return 0;
  }
};

// Status badge styling with improved contrast for Light/Dark themes
const getStatusBadge = (status) => {
  const badgeBaseClass =
    "px-3 py-1 text-xs font-bold rounded-full border shrink-0 min-w-[110px] text-center inline-block";

  switch (status) {
    case "PAID":
      return (
        <span className={`${badgeBaseClass} bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30`}>
          Awaiting Shipment
        </span>
      );
    case "SELLER_SHIPPING":
      return (
        <span className={`${badgeBaseClass} bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30`}>
          In Transit to Warehouse
        </span>
      );
    case "INSPECTION_PENDING":
    case "INSPECTING":
      return (
        <span className={`${badgeBaseClass} bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/30`}>
          Inspecting SPEC
        </span>
      );
    case "NEEDS_REVIEW":
      return (
        <span className={`${badgeBaseClass} bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30`}>
          Requires Further Review
        </span>
      );
    case "VERIFIED":
      return (
        <span className={`${badgeBaseClass} bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30`}>
          SPEC Passed
        </span>
      );
    case "SHIPPING_TO_BUYER":
      return (
        <span className={`${badgeBaseClass} bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30`}>
          Shipping to Buyer
        </span>
      );
    case "COMPLETED":
      return (
        <span className={`${badgeBaseClass} bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30`}>
          Order Completed
        </span>
      );
    case "REJECTED":
      return (
        <span className={`${badgeBaseClass} bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30`}>
          SPEC Failed
        </span>
      );
    case "CANCELLED":
      return (
        <span className={`${badgeBaseClass} bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30`}>
          Cancelled
        </span>
      );
    default:
      return (
        <span className={`${badgeBaseClass} bg-base-200 text-base-content border-base-300`}>
          {status}
        </span>
      );
  }
};

export function OrderItemCard({ order, onClick }) {
  const currentStepIndex = getStepIndex(order.status);
  const isFailedOrCancelled = ["REJECTED", "CANCELLED"].includes(order.status);

  // Extract and format cover image URL
  const coverImage =
    order.listing?.images?.find((img) => img.isCover) ||
    order.listing?.images?.[0];

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

  return (
    <div
      onClick={onClick}
      className="p-5 bg-base-100 border border-base-200 rounded-2xl cursor-pointer hover:border-primary hover:shadow-[0_4px_16px_rgba(249,115,22,0.15)] transition-all duration-200 space-y-4"
    >
      {/* Header: Order ID & High-Contrast Status Badge */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-base-content/70 tracking-tight">
          Order ID: #{order.orderNumber || order.id}
        </span>

        <div>{getStatusBadge(order.status)}</div>
      </div>

      {/* Main Content: Product Image & Price Details */}
      <div className="flex items-center gap-5 min-w-0">
        <div className="bg-base-300 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-base-200 w-[90px] h-[90px]">
          <img
            src={imageUrl}
            alt={order.listing?.title || "Product"}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="min-w-0 space-y-1.5 flex-1">
          <p className="text-base font-bold truncate text-base-content">
            {order.listing?.title || "Untitled Product"}
          </p>
          <p className="text-lg font-black text-primary">
            ฿{Number(order.agreedPrice || order.price || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Stepper Tracking */}
      {!isFailedOrCancelled ? (
        <div className="grid grid-cols-4 gap-1 text-center text-[11px] font-semibold pt-3 border-t border-base-200 text-base-content/60">
          {ORDER_STEPS.map((step, idx) => {
            const isPassed = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={step.key}
                className={`transition-all ${
                  isCurrent
                    ? "text-primary font-black scale-105"
                    : isPassed
                    ? "text-emerald-500 dark:text-emerald-400 font-bold"
                    : "opacity-40"
                }`}
              >
                <div>{step.label}</div>
                <span className="text-[9px] font-normal block opacity-75 mt-0.5">
                  {isPassed ? "Completed" : isCurrent ? "In Progress" : "-"}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="pt-2 border-t border-base-200 flex items-center justify-center gap-1.5 text-xs font-semibold text-rose-500 dark:text-rose-400">
          <XCircle className="w-4 h-4" />
          <span>
            This order was{" "}
            {order.status === "REJECTED"
              ? "rejected during SPEC inspection"
              : "cancelled"}
          </span>
        </div>
      )}
    </div>
  );
}