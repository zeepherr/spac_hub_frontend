import { useMemo, useState } from "react";
import {
  LoaderCircle,
  PackageCheck,
  RefreshCw,
  Search,
} from "lucide-react";

import { useAdminOrders } from "@/hook/order/useAdminOrder";

import SummarySection from "@/components/admin/order/summary/SummarySection";

function OrderSummary() {
  const [search, setSearch] = useState("");

  const ordersQuery = useAdminOrders({
    statuses: [
      "SHIPPING_TO_BUYER",
      "COMPLETED",
      "REJECTED",
    ],
  });

  const orders = ordersQuery.data ?? [];

  /*
   * ================================
   * Shipped to Buyer
   * ================================
   */
  const shippedToBuyerOrders = useMemo(() => {
    return orders
      .map((order) => {
        const shipment =
          order.shipments?.find(
            (shipment) =>
              shipment.shipmentType ===
              "ADMIN_TO_BUYER",
          );

        if (!shipment) return null;

        return {
          ...order,
          summaryShipment: shipment,
        };
      })
      .filter(Boolean);
  }, [orders]);

  /*
   * ================================
   * Returned to Seller
   * ================================
   */
  const returnedToSellerOrders = useMemo(() => {
    return orders
      .map((order) => {
        const shipment =
          order.shipments?.find(
            (shipment) =>
              shipment.shipmentType ===
              "ADMIN_TO_SELLER",
          );

        if (!shipment) return null;

        return {
          ...order,
          summaryShipment: shipment,
        };
      })
      .filter(Boolean);
  }, [orders]);

  /*
   * ================================
   * SEARCH
   * ================================
   */
  const matchesSearch = (order) => {
    const keyword =
      search.trim().toLowerCase();

    if (!keyword) return true;

    const listing = order.listing;
    const shipment =
      order.summaryShipment;

    return (
      order.orderNumber
        ?.toLowerCase()
        .includes(keyword) ||
      listing?.title
        ?.toLowerCase()
        .includes(keyword) ||
      listing?.brand
        ?.toLowerCase()
        .includes(keyword) ||
      listing?.model
        ?.toLowerCase()
        .includes(keyword) ||
      shipment?.carrier
        ?.toLowerCase()
        .includes(keyword) ||
      shipment?.trackingNumber
        ?.toLowerCase()
        .includes(keyword)
    );
  };

  const filteredBuyerOrders = useMemo(
    () =>
      shippedToBuyerOrders.filter(
        matchesSearch,
      ),
    [shippedToBuyerOrders, search],
  );

  const filteredSellerOrders = useMemo(
    () =>
      returnedToSellerOrders.filter(
        matchesSearch,
      ),
    [returnedToSellerOrders, search],
  );

  if (ordersQuery.isPending) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <LoaderCircle
          size={30}
          className="animate-spin text-orange-500"
        />

        <span className="ml-3 text-sm text-neutral-500">
          Loading data...
        </span>
      </div>
    );
  }

  if (ordersQuery.isError) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-red-500">
            Unable to load data
          </p>

          <button
            type="button"
            onClick={() =>
              ordersQuery.refetch()
            }
            className="mt-4 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F4] px-6 py-6">
      <div className="mx-auto w-full max-w-[1500px]">
        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100">
              <PackageCheck
                size={22}
                className="text-orange-500"
              />
            </div>

            <div>
              <h1 className="text-xl font-semibold text-neutral-900">
                Shipping Summary
              </h1>

              <p className="mt-1 text-xs text-neutral-500">
                Summary of products shipped to buyers and
                products returned to sellers.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              ordersQuery.refetch()
            }
            disabled={
              ordersQuery.isFetching
            }
            className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                ordersQuery.isFetching
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>
        </div>

        {/* SEARCH */}
        <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search by order, product, brand, model, carrier, or tracking number"
              className="h-11 w-full rounded-xl border border-neutral-200 bg-white pl-11 pr-4 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>
        </div>

        {/* BUYER TABLE */}
        <SummarySection
          type="BUYER"
          title="Shipped to Buyer"
          description="Products that have been shipped to buyers."
          orders={filteredBuyerOrders}
        />

        {/* SELLER TABLE */}
        <div className="mt-6">
          <SummarySection
            type="SELLER"
            title="Returned to Seller"
            description="Products that failed inspection and were returned to sellers."
            orders={filteredSellerOrders}
          />
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;