import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  ClipboardCheck,
  RefreshCw,
  Search,
} from "lucide-react";

import { useAdminOrders } from "@/hook/order/useAdminOrder";
import { useStartOrderInspection } from "@/hook/order/useStartOrderInspection";

import InspectionTable from "@/components/admin/order/inspection/InspectionTable";

const statusOptions = [
  {
    label: "All",
    value: "ALL",
  },
  {
    label: "Awaiting Inspection",
    value: "INSPECTION_PENDING",
  },
  {
    label: "Under Inspection",
    value: "INSPECTING",
  },
];

function Inspection() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const startInspectionMutation =
    useStartOrderInspection();

  const statuses =
    status === "ALL"
      ? ["INSPECTION_PENDING", "INSPECTING"]
      : [status];

  const ordersQuery = useAdminOrders({
    statuses,
  });

  const orders = Array.isArray(ordersQuery.data)
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
      const values = [
        order.orderNumber,
        order.listing?.title,
        order.listing?.brand,
        order.listing?.model,
        order.seller?.firstName,
        order.seller?.lastName,
      ];

      return values.some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(keyword),
      );
    });
  }, [orders, search]);

  /*
   * =========================================
   * START / CONTINUE INSPECTION
   * =========================================
   */
  const handleInspection = (order) => {
    if (order.status === "INSPECTING") {
      navigate(
        `/admin/orders/inspection/${order.id}`,
      );

      return;
    }

    startInspectionMutation.mutate(
      {
        orderId: order.id,
      },
      {
        onSuccess: () => {
          navigate(
            `/admin/orders/inspection/${order.id}`,
          );
        },
      },
    );
  };

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
              <ClipboardCheck
                size={22}
                className="text-orange-500"
              />
            </div>

            {/* TITLE */}
            <div>
              <h1 className="text-xl font-semibold text-neutral-900">
                Inspection
              </h1>

              <p className="mt-1 text-xs text-neutral-500">
                Inspect the condition of products
                received from sellers.
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
            FILTER
        ========================================= */}
        <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            {/* SEARCH */}
            <div className="relative min-w-0 flex-1">
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
                placeholder="Search by order, product, brand, or model"
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

            {/* STATUS FILTER */}
            <div className="flex shrink-0 flex-wrap gap-2">
              {statusOptions.map((option) => {
                const isActive =
                  status === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setStatus(
                        option.value,
                      )
                    }
                    className={`
                      h-11 cursor-pointer
                      whitespace-nowrap
                      rounded-xl
                      px-4
                      text-sm font-medium
                      transition
                      ${
                        isActive
                          ? "bg-orange-500 text-white shadow-sm hover:bg-orange-600"
                          : "border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                      }
                    `}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* =========================================
            TABLE
        ========================================= */}
        <InspectionTable
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
          onInspection={
            handleInspection
          }
          startInspectionMutation={
            startInspectionMutation
          }
        />
      </div>
    </div>
  );
}

export default Inspection;