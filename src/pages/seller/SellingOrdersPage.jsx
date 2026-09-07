import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, PackageX } from "lucide-react";
import { useSellingOrders } from "@/hook/order/useSellingOrder";
import SellingOrderFilter, { FILTER_TABS } from "@/components/userSellerDashboard/SellingOrderFilter";
import { OrderItemCard } from "@/components/userSellerDashboard/OrderItemCard";
import ShipOrderModal from "@/components/userSellerDashboard/ShipOrderModal";
import SellingOrderDetailModal from "@/components/userSellerDashboard/SellingOrderDetailModal";

// 1. นำเข้า Card ตัวเดิมที่มีอยู่แล้ว
// import { OrderItemCard } from "@/components/sell/OrderItemCard"; 
// import ShipOrderModal from "@/components/sell/ShipOrderModal";

// 2. นำเข้า Components ย่อยที่เราเพิ่งแยก
// import SellingOrderFilter, { FILTER_TABS } from "@/components/sell/SellingOrderFilter";
// import SellingOrderDetailModal from "@/components/sell/SellingOrderDetailModal";

export default function SellingOrdersPage() {
  const navigate = useNavigate();
  const { data: sellingOrders = [], isLoading, isError, refetch } = useSellingOrders();

  // Filters & Search
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isShipModalOpen, setIsShipModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Filter Orders ที่ valid
  const validOrders = useMemo(() => {
    return (sellingOrders || [])
      .filter(
        (order) =>
          order.status !== "PENDING" && order.status !== "AWAITING_PAYMENT"
      )
      .sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt || 0) -
          new Date(a.updatedAt || a.createdAt || 0)
      );
  }, [sellingOrders]);

  // Filter ตาม Status Tab และ Search Box
  const filteredOrders = useMemo(() => {
  return validOrders.filter((order) => {
    let matchStatus = false;
    if (activeTab === "ALL") {
      matchStatus = true;
    } else if (activeTab === "INSPECTION") {
      matchStatus = [
        "INSPECTION_PENDING",
        "INSPECTING",
        "NEEDS_REVIEW",
        "VERIFIED",
        "SHIPPING_TO_BUYER",
      ].includes(order.status);
    } else if (activeTab === "CANCELLED") {
      matchStatus = ["CANCELLED", "REJECTED"].includes(order.status);
    } else {
      matchStatus = order.status === activeTab;
    }

    const item = order.listing || order.product || {};
    const query = searchQuery.trim().toLowerCase();

    // แปลงทุกค่าเป็น String ป้องกัน TypeError ถ้า ID เป็น Number
    const orderNumberStr = String(order.orderNumber || "").toLowerCase();
    const orderIdStr = String(order.id || "").toLowerCase();
    const itemTitleStr = String(item.title || "").toLowerCase();

    const matchSearch =
      !query ||
      orderNumberStr.includes(query) ||
      orderIdStr.includes(query) ||
      itemTitleStr.includes(query);

    return matchStatus && matchSearch;
  });
}, [validOrders, activeTab, searchQuery]);

  // Click Handler สำหรับการ์ด
  const handleCardClick = (order) => {
    setSelectedOrder(order);
    if (order.status === "PAID") {
      setIsShipModalOpen(true);
    } else {
      setIsDetailModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-4 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-1 inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 transition-colors hover:text-orange-500"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <h1 className="text-3xl font-extrabold text-neutral-900">
              Selling Orders
            </h1>
            <p className="text-sm text-neutral-500">
              Track and manage all your sold items and shipment statuses
            </p>
          </div>
        </div>

        {/* Filter Component */}
        <SellingOrderFilter
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          validOrders={validOrders}
        />

        {/* Orders List Component (ใช้ OrderItemCard เดิม) */}
        <div className="space-y-4">
          {isLoading ? (
            <SellingOrdersSkeleton />
          ) : isError ? (
            <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-red-500 shadow-sm space-y-2">
              <p className="font-bold">Unable to load order data.</p>
              <button
                type="button"
                onClick={() => refetch && refetch()}
                className="mt-2 rounded-lg border border-red-500 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50"
              >
                Try Again
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center text-neutral-400 shadow-sm space-y-3">
              <PackageX className="mx-auto h-16 w-16 stroke-1" />
              <p className="text-lg font-bold text-neutral-700">No orders found</p>
              <p className="mx-auto max-w-sm text-sm text-neutral-400">
                {searchQuery
                  ? `No sales orders match "${searchQuery}"`
                  : `There are no sales orders in "${
                      FILTER_TABS.find((t) => t.id === activeTab)?.label
                    }".`}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <OrderItemCard
                key={order.id}
                order={order}
                onClick={() => handleCardClick(order)}
              />
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      <ShipOrderModal
        isOpen={isShipModalOpen}
        onClose={() => {
          setIsShipModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
      />

      <SellingOrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
      />
    </div>
  );
}

function SellingOrdersSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm space-y-4"
        >
          <div className="flex justify-between items-center">
            <div className="h-5 w-28 animate-pulse rounded bg-neutral-200" />
            <div className="h-6 w-20 animate-pulse rounded-full bg-neutral-200" />
          </div>
          <div className="flex gap-5 items-center">
            <div className="h-[90px] w-[90px] shrink-0 animate-pulse rounded-xl bg-neutral-200" />
            <div className="w-full space-y-3">
              <div className="h-5 w-2/3 animate-pulse rounded bg-neutral-200" />
              <div className="h-6 w-1/3 animate-pulse rounded bg-neutral-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}