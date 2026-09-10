import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  LoaderCircle,
  PackageCheck,
  RefreshCw,
  Search,
} from "lucide-react";

import { useAdminOrders } from "@/hook/order/useAdminOrder";

import ReadyToShipTable from "@/components/admin/order/ready-to-ship/ReadyToShipTable";

function ReadyToShip() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const ordersQuery = useAdminOrders({
    statuses: ["VERIFIED", "REJECTED"],
  });

  const orders = Array.isArray(
    ordersQuery.data,
  )
    ? ordersQuery.data
    : (ordersQuery.data?.data ?? []);

  const filteredOrders = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase();

    return orders.filter((order) => {
      const listing = order.listing;

      /*
       * REJECTED order จะยังคงเป็น REJECTED
       * แม้ Admin จะสร้าง shipment
       * สำหรับส่งสินค้าคืน Seller แล้ว
       */
      const hasReturnShipment =
        order.shipments?.some(
          (shipment) =>
            shipment.shipmentType ===
            "ADMIN_TO_SELLER",
        );

      /*
       * ถ้าส่งคืน Seller ไปแล้ว
       * ไม่ต้องแสดงใน Ready to Ship
       */
      if (
        order.status === "REJECTED" &&
        hasReturnShipment
      ) {
        return false;
      }

      /*
       * SEARCH
       */
      const values = [
        order.orderNumber,
        listing?.title,
        listing?.brand,
        listing?.model,
      ];

      const matchesSearch =
        !keyword ||
        values.some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(keyword),
        );

      /*
       * FILTER
       */
      const matchesFilter =
        filter === "ALL" ||
        order.status === filter;

      return (
        matchesSearch &&
        matchesFilter
      );
    });
  }, [orders, search, filter]);

  /*
   * ================================
   * LOADING
   * ================================
   */
  if (ordersQuery.isPending) {
    return (
      <div className="min-h-screen bg-[#F5F5F4] px-6 py-6">
        <div className="mx-auto flex min-h-[500px] w-full max-w-[1500px] items-center justify-center">
          <LoaderCircle
            size={30}
            className="animate-spin text-orange-500"
          />

          <span className="ml-3 text-sm text-neutral-500">
            Loading data...
          </span>
        </div>
      </div>
    );
  }

  /*
   * ================================
   * ERROR
   * ================================
   */
  if (ordersQuery.isError) {
    return (
      <div className="min-h-screen bg-[#F5F5F4] px-6 py-6">
        <div className="mx-auto flex min-h-[500px] w-full max-w-[1500px] items-center justify-center">
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
                Ready to Ship
              </h1>

              <p className="mt-1 text-xs text-neutral-500">
                Manage products that have completed
                inspection.
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

        {/* SEARCH + FILTER */}
        <div className="mb-5 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            {/* SEARCH */}
            <div className="relative flex-1">
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
                placeholder="Search by order, product, brand, or model"
                className="h-11 w-full rounded-xl border border-neutral-200 bg-white pl-11 pr-4 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* FILTER */}
            <div className="flex gap-2">
              <FilterButton
                active={
                  filter === "ALL"
                }
                onClick={() =>
                  setFilter("ALL")
                }
              >
                All
              </FilterButton>

              <FilterButton
                active={
                  filter === "VERIFIED"
                }
                onClick={() =>
                  setFilter("VERIFIED")
                }
              >
                Ship to Buyer
              </FilterButton>

              <FilterButton
                active={
                  filter === "REJECTED"
                }
                onClick={() =>
                  setFilter("REJECTED")
                }
              >
                Return to Seller
              </FilterButton>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <ReadyToShipTable
          orders={filteredOrders}
          onOpen={(order) =>
            navigate(
              `/admin/orders/ready-to-ship/${order.id}`,
            )
          }
        />
      </div>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-11 whitespace-nowrap rounded-xl border px-5 text-sm font-medium transition ${
        active
          ? "border-orange-500 bg-orange-500 text-white shadow-sm"
          : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
      }`}
    >
      {children}
    </button>
  );
}

export default ReadyToShip;