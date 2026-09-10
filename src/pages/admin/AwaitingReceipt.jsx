import {
  RefreshCw,
  ScanLine,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";

import { useAdminOrders } from "@/hook/order/useAdminOrder";

import AwaitingReceiptTable from "@/components/admin/order/awaiting-receipt/AwaitingReceiptTable";
import ReceiveProductModal from "@/components/admin/order/awaiting-receipt/ReceiveProductModal";

function AwaitingReceipt() {
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const ordersQuery = useAdminOrders({
    statuses: ["SELLER_SHIPPING"],
  });

  const orders = Array.isArray(
    ordersQuery.data,
  )
    ? ordersQuery.data
    : (ordersQuery.data?.data ?? []);

  /*
   * =========================================
   * FILTER ORDERS
   * =========================================
   */
  const filteredOrders = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase();

    if (!keyword) {
      return orders;
    }

    return orders.filter((order) => {
      const shipment =
        order.shipments?.find(
          (shipment) =>
            shipment.shipmentType ===
            "SELLER_TO_ADMIN",
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
    <div className="min-h-screen bg-[#F5F5F4] px-6 py-6">
      <div className="mx-auto w-full max-w-[1500px]">

        {/* =========================================
            HEADER
        ========================================= */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* ICON */}
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-orange-100">
              <ScanLine
                size={22}
                className="text-orange-500"
              />
            </div>

            {/* TITLE */}
            <div>
              <h1 className="text-xl font-semibold text-neutral-900">
                Awaiting Receive
              </h1>

              <p className="mt-1 text-xs text-neutral-500">
                Review parcels shipped by sellers to
                the inspection center.
              </p>
            </div>
          </div>

          {/* REFRESH */}
          <button
            type="button"
            onClick={() =>
              ordersQuery.refetch()
            }
            disabled={
              ordersQuery.isFetching
            }
            className="
              inline-flex items-center gap-2
              rounded-xl
              border border-neutral-200
              bg-white
              px-4 py-2.5
              text-sm font-medium
              text-neutral-700
              shadow-sm
              transition
              hover:bg-neutral-50
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <RefreshCw
              size={16}
              className={
                ordersQuery.isFetching
                  ? "animate-spin"
                  : ""
              }
            />

            {ordersQuery.isFetching
              ? "Loading..."
              : "Refresh"}
          </button>
        </div>

        {/* =========================================
            SEARCH
        ========================================= */}
        <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
          <div className="relative">
            <Search
              size={17}
              className="
                absolute left-4 top-1/2
                -translate-y-1/2
                text-neutral-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search by order, product, seller, or tracking number"
              className="
                h-11 w-full
                rounded-xl
                border border-neutral-200
                bg-white
                pl-11 pr-4
                text-sm text-neutral-800
                outline-none
                transition
                placeholder:text-neutral-400
                focus:border-orange-400
                focus:ring-2
                focus:ring-orange-100
              "
            />
          </div>
        </div>

        {/* =========================================
            TABLE
        ========================================= */}
        <AwaitingReceiptTable
          orders={filteredOrders}
          isPending={
            ordersQuery.isPending
          }
          isError={
            ordersQuery.isError
          }
          onRetry={() =>
            ordersQuery.refetch()
          }
          onManage={(order) =>
            setSelectedOrder(order)
          }
        />
      </div>

      {/* =========================================
          RECEIVE PRODUCT MODAL
      ========================================= */}
      {selectedOrder && (
        <ReceiveProductModal
          order={selectedOrder}
          onClose={() =>
            setSelectedOrder(null)
          }
        />
      )}
    </div>
  );
}

export default AwaitingReceipt;