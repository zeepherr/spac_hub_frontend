import { OrderItemCard } from "@/components/userSellerDashboard/OrderItemCard";
import SellingOrderDetailModal from "@/components/userSellerDashboard/SellingOrderDetailModal";
import SellingOrderFilter, {
  FILTER_TABS,
} from "@/components/userSellerDashboard/SellingOrderFilter";
import ShipOrderModal from "@/components/userSellerDashboard/ShipOrderModal";
import { useSellingOrders } from "@/hook/order/useSellingOrder";
import { useMySupportCases } from "@/hook/support/useMySupportCases";
import { ArrowLeft, PackageX } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

import { hasUnreadSupportMessage } from "@/components/support/support.constants";
import useAuthStore from "../../stores/auth.store.js";

// bg หลักมาตรฐานของทั้งเว็บ (เดียวกับที่ตั้งไว้ใน PublicLayout.jsx) - ใช้กับพื้นหลังหลักของหน้าเท่านั้น
const PAGE_BG =
  "bg-[linear-gradient(180deg,rgba(59,130,246,0.12)_0%,transparent_35%),linear-gradient(0deg,rgba(59,130,246,0.12)_0%,transparent_35%),linear-gradient(180deg,#fafafa_0%,#f0f0f0_100%)]";
// เดียวกับ GLASS_PANEL ที่ใช้ทั้งเว็บ
const GLASS_PANEL =
  "border border-neutral-200/70 bg-white/50 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)]";

export default function SellingOrdersPage() {
  const navigate = useNavigate();
  const {
    data: sellingOrders = [],
    isLoading,
    isError,
    refetch,
  } = useSellingOrders();
  const currentUser = useAuthStore((state) => state.user);

  const { data: supportCases = [] } = useMySupportCases();
  const supportCaseByOrderId = useMemo(() => {
    return new Map(
      supportCases.map((supportCase) => [
        String(supportCase.orderId),
        supportCase,
      ]),
    );
  }, [supportCases]);

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
          order.status !== "PENDING" && order.status !== "AWAITING_PAYMENT",
      )
      .sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt || 0) -
          new Date(a.updatedAt || a.createdAt || 0),
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
    setIsDetailModalOpen(true);
  };

  const handleOpenShipModal = () => {
    setIsDetailModalOpen(false);
    setIsShipModalOpen(true);
  };

  const selectedSupportCase = selectedOrder
    ? supportCaseByOrderId.get(String(selectedOrder.id))
    : null;

  const selectedOrderHasUnread = hasUnreadSupportMessage(
    selectedSupportCase,
    currentUser?.id,
  );

  return (
    <div className={`min-h-screen w-full p-4 sm:p-6 md:p-8 ${PAGE_BG}`}>
      {/* 🟢 เปลี่ยนจาก mx-auto max-w-6xl เป็น w-full เพื่อขยายให้เต็มจอ */}
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-1 inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 transition-colors hover:text-orange-500 cursor-pointer"
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

        {/* Orders List Component */}
        <div className="space-y-4">
          {isLoading ? (
            <SellingOrdersSkeleton />
          ) : isError ? (
            <div
              className={`space-y-2 rounded-2xl p-8 text-center text-red-500 ${GLASS_PANEL}`}
            >
              <p className="font-bold">Unable to load order data.</p>
              <button
                type="button"
                onClick={() => refetch && refetch()}
                className="mt-2 rounded-lg border border-red-500 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 cursor-pointer"
              >
                Try Again
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div
              className={`space-y-3 rounded-2xl p-12 text-center text-neutral-400 ${GLASS_PANEL}`}
            >
              <PackageX className="mx-auto h-16 w-16 stroke-1" />
              <p className="text-lg font-bold text-neutral-700">
                No orders found
              </p>
              <p className="mx-auto max-w-sm text-sm text-neutral-400">
                {searchQuery
                  ? `No sales orders match "${searchQuery}"`
                  : `There are no sales orders in "${
                      FILTER_TABS.find((t) => t.id === activeTab)?.label
                    }".`}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const supportCase = supportCaseByOrderId.get(String(order.id));

              const hasUnreadSupport = hasUnreadSupportMessage(
                supportCase,
                currentUser?.id,
              );

              return (
                <OrderItemCard
                  key={order.id}
                  order={order}
                  hasUnreadSupport={hasUnreadSupport}
                  onClick={() => handleCardClick(order)}
                />
              );
            })
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
        onOpenShip={handleOpenShipModal}
        order={selectedOrder}
        hasUnreadSupport={selectedOrderHasUnread}
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
          className="rounded-2xl border border-neutral-200/70 bg-white/60 backdrop-blur-sm p-5 shadow-sm space-y-4"
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
