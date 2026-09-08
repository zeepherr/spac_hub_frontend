import {
  ClipboardCheck,
  LoaderCircle,
  PackageCheck,
  RefreshCw,
  ScanLine,
  TriangleAlert,
} from "lucide-react";
import { Link } from "react-router";

import { useAdminOrders } from "@/hook/order/useAdminOrder";

const summaryItems = [
  {
    title: "Awaiting Receipt",
    statuses: ["SELLER_SHIPPING"],
    path: "/admin/orders/awaiting-receipt",
    icon: ScanLine,
  },
  {
    title: "Under Inspection",
    statuses: ["INSPECTION_PENDING", "INSPECTING"],
    path: "/admin/orders/inspection",
    icon: ClipboardCheck,
  },
  {
    title: "Ready to Ship",
    statuses: ["VERIFIED"],
    path: "/admin/orders/ready-to-ship",
    icon: PackageCheck,
  },
];

const dashboardStatuses = summaryItems.flatMap(
  (item) => item.statuses,
);

const statusConfig = {
  SELLER_SHIPPING: {
    label: "Awaiting Receipt",
    className: "bg-orange-50 text-orange-600",
  },

  INSPECTION_PENDING: {
    label: "Awaiting Inspection",
    className: "bg-orange-50 text-orange-600",
  },

  INSPECTING: {
    label: "Under Inspection",
    className: "bg-blue-50 text-blue-600",
  },

  VERIFIED: {
    label: "Ready to Ship",
    className: "bg-green-50 text-green-600",
  },

  NEEDS_REVIEW: {
    label: "Needs Review",
    className: "bg-amber-50 text-amber-700",
  },

  REJECTED: {
    label: "Inspection Failed",
    className: "bg-red-50 text-red-600",
  },
};

const priceFormatter = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  maximumFractionDigits: 2,
});

function formatPrice(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  const amount = Number(value);

  return Number.isFinite(amount)
    ? priceFormatter.format(amount)
    : "—";
}

function getCreatedTime(order) {
  const time = Date.parse(order.createdAt);

  return Number.isNaN(time) ? 0 : time;
}

function Dashboard() {
  const ordersQuery = useAdminOrders({
    statuses: dashboardStatuses,
  });

  const orders = ordersQuery.data ?? [];
  const hasData = ordersQuery.data !== undefined;

  const latestOrders = [...orders]
    .sort(
      (a, b) =>
        getCreatedTime(b) - getCreatedTime(a),
    )
    .slice(0, 10);

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Overview of orders that require admin
            action.
          </p>
        </div>

        <button
          type="button"
          onClick={() => ordersQuery.refetch()}
          disabled={ordersQuery.isFetching}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 transition hover:border-orange-300 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
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

      {/* Error: keep previously loaded data visible */}
      {ordersQuery.isError && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <p className="font-medium">
            {hasData
              ? "Unable to update data. Showing previously loaded data."
              : "Unable to load orders."}
          </p>

          <p className="mt-1">
            {ordersQuery.error?.response?.data
              ?.message ||
              "Please try refreshing again."}
          </p>
        </div>
      )}

      {/* Summary cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryItems.map((item) => {
          const Icon = item.icon;

          const count = orders.filter((order) =>
            item.statuses.includes(order.status),
          ).length;

          return (
            <Link
              key={item.title}
              to={item.path}
              className="rounded-xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {item.title}
                </p>

                <Icon
                  size={19}
                  className="text-orange-500"
                />
              </div>

              <div className="mt-3 text-2xl font-bold text-gray-900">
                {ordersQuery.isPending ? (
                  <LoaderCircle
                    size={24}
                    aria-label="Loading order count"
                    className="animate-spin text-orange-500"
                  />
                ) : hasData ? (
                  count.toLocaleString("en-US")
                ) : (
                  "—"
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Latest orders */}
      <section className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Recent Orders
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Orders awaiting action, sorted by most
              recently created.
            </p>
          </div>

          {hasData && (
            <p className="text-sm text-gray-500">
              Total{" "}
              {orders.length.toLocaleString("en-US")}{" "}
              orders
            </p>
          )}
        </div>

        {ordersQuery.isPending ? (
          <div
            role="status"
            className="flex min-h-52 items-center justify-center gap-3"
          >
            <LoaderCircle
              size={26}
              className="animate-spin text-orange-500"
            />

            <p className="text-sm text-gray-500">
              Loading orders...
            </p>
          </div>
        ) : !hasData ? (
          <div className="px-6 py-16 text-center text-sm text-gray-500">
            Unable to display data. Please try again.
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16">
            <PackageCheck
              size={36}
              className="text-gray-300"
            />

            <p className="mt-3 font-medium text-gray-700">
              No orders require action
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Orders will appear here when sellers ship
              their items.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">
                      Order
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Product
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Seller
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Price
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Status
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {latestOrders.map((order) => {
                    const status =
                      statusConfig[order.status] ?? {
                        label:
                          order.status ||
                          "Unknown Status",
                        className:
                          "bg-gray-100 text-gray-600",
                      };

                    const sellerName = [
                      order.seller?.firstName,
                      order.seller?.lastName,
                    ]
                      .filter(Boolean)
                      .join(" ");

                    const queue =
                      summaryItems.find((item) =>
                        item.statuses.includes(
                          order.status,
                        ),
                      );

                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-5 font-semibold text-gray-900">
                          {order.orderNumber ||
                            `#${order.id}`}
                        </td>

                        <td className="px-6 py-5 text-gray-700">
                          <p className="max-w-[260px] break-words">
                            {order.listing?.title ||
                              "Product name unavailable"}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-gray-600">
                          {sellerName ||
                            "Name unavailable"}
                        </td>

                        <td className="whitespace-nowrap px-6 py-5 font-medium text-gray-900">
                          {formatPrice(
                            order.agreedPrice,
                          )}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          {queue ? (
                            <Link
                              to={queue.path}
                              className="whitespace-nowrap font-medium text-orange-500 hover:text-orange-600 hover:underline"
                            >
                              Manage
                            </Link>
                          ) : (
                            <span className="text-gray-400">
                              —
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 text-sm text-gray-500">
              Showing {latestOrders.length} of{" "}
              {orders.length.toLocaleString("en-US")}{" "}
              orders
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default Dashboard;