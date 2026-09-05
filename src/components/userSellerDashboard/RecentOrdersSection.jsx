import React, { useState } from "react";
import { ChevronRight, PackageX } from "lucide-react";
import { OrderItemCard } from "./OrderItemCard";
import { useBuyingOrders } from "@/hook/order/useBuyingOrders";
import { useSellingOrders } from "@/hook/order/useSellingOrder";
import { useNavigate } from "react-router";
import ShipOrderModal from "./ShipOrderModal";

export default function RecentOrdersSection() {
  const navigate = useNavigate();
  const { data: sellingOrders = [], isLoading, isError } = useSellingOrders();

  // State for Modal Management
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Filter out orders in initial/unprocessed states (PENDING / AWAITING_PAYMENT)
  // 2. Sort by latest updated/created date
  const activeSellingOrders = (sellingOrders || [])
    .filter(
      (order) =>
        order.status !== "PENDING" && order.status !== "AWAITING_PAYMENT"
    )
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt || 0) -
        new Date(a.updatedAt || a.createdAt || 0)
    );

  // Handle clicking on a selling order card
  const handleCardClick = (order) => {
    if (order.status === "PAID") {
      // If status is "PAID" (Awaiting Shipment), open the shipping modal
      setSelectedOrder(order);
      setIsModalOpen(true);
    } else {
      // Navigate to order details for other statuses
      navigate(`/user/sell/orders/${order.id}`);
    }
  };

  if (isLoading) return <RecentOrdersSectionSkeleton />;

  return (
    <>
      <div className="card hardware-surface p-6 space-y-4 h-150 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-base-300/60 pb-4 shrink-0">
          <h3 className="font-bold text-xl text-base-content">
            My Sales Status
          </h3>
          <button
            type="button"
            onClick={() => navigate("/user/sell/orders")}
            className="text-sm text-base-content/70 hover:text-primary font-semibold flex items-center gap-1 transition-colors"
          >
            View All Sales <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Orders List Container */}
        <div className="space-y-4 flex-1 pr-2 p-1.5 scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-100 overflow-y-auto">
          {isError ? (
            <div className="text-center py-8 text-sm text-error">
              Unable to load order data.
            </div>
          ) : activeSellingOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-base-content/50 space-y-2">
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

      {/* Modal for entering shipping details */}
      <ShipOrderModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
      />
    </>
  );
}

export function RecentOrdersSectionSkeleton() {
  return (
    <div className="card hardware-surface p-6 space-y-4 h-[600px] flex flex-col">
      <div className="flex items-center justify-between border-b border-base-300/60 pb-4">
        <div className="skeleton h-6 w-40" />
        <div className="skeleton h-4 w-24" />
      </div>
      <div className="space-y-4 flex-1 overflow-hidden">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-5 border border-base-200 rounded-2xl space-y-4"
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