import { useMemo, useState } from "react";
import { Package, RefreshCw, Search } from "lucide-react";

import { useAdminOrders } from "@/hook/order/useAdminOrder";

import AwaitingReceiptTable from "@/components/admin/order/awaiting-receipt/AwaitingReceiptTable";
import ReceiveProductModal from "@/components/admin/order/awaiting-receipt/ReceiveProductModal";

function AwaitingReceipt() {
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const ordersQuery = useAdminOrders({
    statuses: ["SELLER_SHIPPING"],
  });

  const orders = Array.isArray(ordersQuery.data)
    ? ordersQuery.data
    : (ordersQuery.data?.data ?? []);

  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return orders;
    }

    return orders.filter((order) => {
      const shipment = order.shipments?.find(
        (shipment) => shipment.shipmentType === "SELLER_TO_ADMIN",
      );

      const values = [
        order.orderNumber,
        order.listing?.title,
        order.listing?.brand,
        order.listing?.model,
        order.seller?.firstName,
        order.seller?.lastName,
        order.seller?.email,
        shipment?.carrier,
        shipment?.trackingNumber,
      ];

      return values.some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(keyword),
      );
    });
  }, [orders, search]);

  return (
    <div className="min-h-screen bg-[#F5F5F4] p-8">
      <div className="w-full">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100">
              <Package size={23} className="text-orange-500" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-neutral-900">
                Awaiting Receipt
              </h1>

              <p className="mt-1 text-sm text-neutral-500">
                Review parcels shipped by sellers to the inspection center.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => ordersQuery.refetch()}
            disabled={ordersQuery.isFetching}
            className="flex h-11 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={ordersQuery.isFetching ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Search */}
        <div className="mb-5 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by order, product, seller, or tracking number"
              className="h-11 w-full rounded-xl border border-neutral-200 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>
        </div>

        <AwaitingReceiptTable
          orders={filteredOrders}
          isPending={ordersQuery.isPending}
          isError={ordersQuery.isError}
          onRetry={() => ordersQuery.refetch()}
          onManage={(order) => setSelectedOrder(order)}
        />
      </div>

      {selectedOrder && (
        <ReceiveProductModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}

export default AwaitingReceipt;
