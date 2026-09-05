import React, { useState } from "react";
import { PackageCheck } from "lucide-react";
import { useSellingOrders } from "@/hook/order/useSellingOrder";
import ShipOrderModal from "./ShipOrderModal";
import { ActionRequiredItem } from "./ActionRequiredItem";

export default function ActionRequiredSection() {
  const { data: sellingOrders = [], isLoading, isError } = useSellingOrders();

  // State สำหรับจัดการ Modal จัดส่ง
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // กรองเฉพาะสถานะ "รอผู้ขายจัดส่ง" (PAID)
  const pendingShipmentOrders = (sellingOrders || []).filter(
    (order) => order.status === "PAID"
  );

  const handleOpenShipModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  if (isLoading) return <ActionRequiredSectionSkeleton />;

  return (
    <>
      <div className="card hardware-surface p-5 space-y-4 max-h-[420px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-base-300/60 pb-3 shrink-0">
          <h3 className="font-bold text-base text-base-content">
            Action Required
          </h3>
          {pendingShipmentOrders.length > 0 && (
            <span className="badge badge-warning text-white text-xs font-bold">
              {pendingShipmentOrders.length} {pendingShipmentOrders.length === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>

        {/* List Container with Scrollbar */}
        <div className="space-y-3 flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-100">
          {isError ? (
            <div className="text-center py-6 text-xs text-error">
              Unable to load action required items
            </div>
          ) : pendingShipmentOrders.length === 0 ? (
            <div className="flex items-center justify-center gap-2 py-8 text-base-content/50 text-xs">
              <PackageCheck className="w-5 h-5 stroke-1" />
              <span>No pending shipments at this time</span>
            </div>
          ) : (
            pendingShipmentOrders.map((order) => (
              <ActionRequiredItem
                key={order.id}
                order={order}
                onOpenModal={handleOpenShipModal}
              />
            ))
          )}
        </div>
      </div>

      {/* ShipOrderModal */}
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

export function ActionRequiredSectionSkeleton() {
  return (
    <div className="card hardware-surface p-5 space-y-4 max-h-[420px]">
      <div className="flex justify-between items-center border-b border-base-300 pb-3">
        <div className="skeleton h-5 w-40" />
        <div className="skeleton h-5 w-16 rounded-full" />
      </div>
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 border border-base-200 rounded-2xl gap-3"
          >
            <div className="flex items-center gap-3 w-full">
              <div className="skeleton w-12 h-12 rounded-xl shrink-0" />
              <div className="space-y-2 w-full">
                <div className="skeleton h-3.5 w-3/4" />
                <div className="skeleton h-4 w-24 rounded-md" />
              </div>
            </div>
            <div className="skeleton h-8 w-24 rounded-xl shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}