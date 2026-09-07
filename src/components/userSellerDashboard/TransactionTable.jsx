import React, { useMemo, useState } from "react";
import { Filter, Package } from "lucide-react";
import { OrderProductImage } from "./OrderProductImage";
import { TransactionFilter } from "./TransactionFilter";
import { OrderDetailModal } from "./OrderDetailModaltransection";

export function TransactionTable({ orders = [] }) {
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // State สำหรับควบคุม Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ฟังก์ชันเปิด Modal เมื่อคลิกเลือก Order
  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const statusGroups = {
    TO_SHIP: ["PAID", "SELLER_SHIPPING"],
    IN_TRANSIT: ["INSPECTION_PENDING", "INSPECTING", "VERIFIED", "SHIPPING_TO_BUYER"],
    INSPECTION: ["NEEDS_REVIEW"],
    COMPLETED: ["COMPLETED"],
    CANCELLED: ["CANCELLED", "REFUNDED", "REJECTED"],
  };

  const tabCounts = useMemo(() => {
    const counts = {
      ALL: orders.length,
      TO_SHIP: 0,
      IN_TRANSIT: 0,
      INSPECTION: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };

    orders.forEach((order) => {
      Object.entries(statusGroups).forEach(([key, statuses]) => {
        if (statuses.includes(order.status)) {
          counts[key] += 1;
        }
      });
    });

    return counts;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const listing = order.listing || order.product || {};
      const title = (listing.title || order.title || "").toLowerCase();
      const orderId = String(order.id || "").toLowerCase();
      const query = searchQuery.toLowerCase().trim();

      const matchesSearch =
        !query || title.includes(query) || orderId.includes(query);

      let matchesTab = true;
      if (activeTab !== "ALL") {
        const allowedStatuses = statusGroups[activeTab] || [];
        matchesTab = allowedStatuses.includes(order.status);
      }

      return matchesSearch && matchesTab;
    });
  }, [orders, activeTab, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Filter & Search Bar Component */}
      <TransactionFilter
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabCounts={tabCounts}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Table Section */}
      <div className="card bg-base-100 border border-base-200/80 shadow-sm rounded-3xl overflow-hidden p-6">
        <div className="overflow-x-auto">
          <table className="table w-full text-xs">
            <thead>
              <tr className="text-base-content/60 border-b border-base-200">
                <th className="py-3">Product</th>
                <th className="py-3">Category</th>
                <th className="py-3">Date</th>
                <th className="py-3">Status</th>
                <th className="py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-base-content/50">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    No sales transaction found matching your filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const listing = order.listing || order.product || {};
                  const title = listing.title || order.title || `Order #${order.id}`;
                  const categoryName = listing.category?.name || order.categoryName || "General";
                  const imagesSource = listing.images || listing.image || order.images || order.imageUrl;
                  const price = Number(order.agreedPrice || order.totalPrice || 0);

                  return (
                    <tr 
                      key={order.id} 
                      onClick={() => handleRowClick(order)} // กดที่แถวเพื่อเปิด Modal Detail
                      className="hover:bg-base-200/60 cursor-pointer transition-colors border-b border-base-200/40 group"
                    >
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <OrderProductImage images={imagesSource} title={title} className="w-12 h-12" />
                          <div>
                            <p className="font-bold text-sm text-base-content group-hover:text-orange-500 transition-colors line-clamp-1">
                              {title}
                            </p>
                            <p className="text-[10px] text-base-content/50 font-medium">Order ID: #{order.id}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3">
                        <span className="px-2.5 py-1 rounded-lg bg-base-200 text-base-content/70 font-semibold text-[11px]">
                          {categoryName}
                        </span>
                      </td>

                      <td className="py-3 font-medium text-base-content/70">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "-"}
                      </td>

                      <td className="py-3">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold ${
                            order.status === "COMPLETED"
                              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                              : order.status === "CANCELLED"
                              ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                              : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="py-3 text-right font-black text-sm text-base-content">
                        ฿{price.toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
}