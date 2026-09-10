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

  const orders = Array.isArray(
    ordersQuery.data,
  )
    ? ordersQuery.data
    : (ordersQuery.data?.data ?? []);

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
        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100">
              <ClipboardCheck
                size={22}
                className="text-orange-500"
              />
            </div>

            <div>
              <h1 className="text-xl font-semibold text-neutral-900">
                Inspection
              </h1>

              <p className="mt-1 text-xs text-neutral-500">
                Inspect the condition of products received
                from sellers.
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
                  status === "ALL"
                }
                onClick={() =>
                  setStatus("ALL")
                }
              >
                All
              </FilterButton>

              <FilterButton
                active={
                  status ===
                  "INSPECTION_PENDING"
                }
                onClick={() =>
                  setStatus(
                    "INSPECTION_PENDING",
                  )
                }
              >
                Awaiting Inspection
              </FilterButton>

              <FilterButton
                active={
                  status ===
                  "INSPECTING"
                }
                onClick={() =>
                  setStatus(
                    "INSPECTING",
                  )
                }
              >
                Under Inspection
              </FilterButton>
            </div>
          </div>
        </div>

        {/* TABLE */}
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

export default Inspection;