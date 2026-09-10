import {
  ClipboardCheck,
  History,
  PackageCheck,
  ScanLine,
} from "lucide-react";

import DashboardHeader from "@/components/admin/dashboard/DashboardHeader";
import DashboardSummary from "@/components/admin/dashboard/DashboardSummary";
import RecentOrders from "@/components/admin/dashboard/RecentOrders";
import { useAdminOrders } from "@/hook/order/useAdminOrder";

/*
 * =========================================
 * SUMMARY
 * =========================================
 */
const summaryItems = [
  {
    title: "Awaiting Receive",
    statuses: ["SELLER_SHIPPING"],
    path: "/admin/orders/awaiting-receive",
    icon: ScanLine,
    iconClassName: "bg-orange-50 text-orange-500",
  },
  {
    title: "Under Inspection",
    statuses: [
      "INSPECTION_PENDING",
      "INSPECTING",
    ],
    path: "/admin/orders/inspection",
    icon: ClipboardCheck,
    iconClassName: "bg-blue-50 text-blue-500",
  },
  {
    title: "Ready to Ship",
    statuses: ["VERIFIED"],
    path: "/admin/orders/ready-to-ship",
    icon: PackageCheck,
    iconClassName: "bg-green-50 text-green-600",
  },
  {
    title: "Shipping Summary",
    statuses: [
      "SHIPPING_TO_BUYER",
      "COMPLETED",
      "REJECTED",
    ],
    path: "/admin/orders/summary",
    icon: History,
    iconClassName: "bg-orange-50 text-orange-500",
  },
];

const dashboardStatuses = summaryItems.flatMap(
  (item) => item.statuses,
);

/*
 * =========================================
 * STATUS CONFIG
 * =========================================
 */
const statusConfig = {
  SELLER_SHIPPING: {
    label: "Awaiting Receive",
    className: "bg-orange-50 text-orange-600",
  },

  INSPECTION_PENDING: {
    label: "Awaiting Inspection",
    className: "bg-amber-50 text-amber-700",
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

  SHIPPING_TO_BUYER: {
    label: "Shipping to Buyer",
    className: "bg-blue-50 text-blue-600",
  },

  COMPLETED: {
    label: "Completed",
    className: "bg-green-50 text-green-600",
  },
};

/*
 * =========================================
 * PRICE FORMATTER
 * =========================================
 */
const priceFormatter = new Intl.NumberFormat(
  "th-TH",
  {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 2,
  },
);

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

/*
 * =========================================
 * DATE
 * =========================================
 */
function getCreatedTime(order) {
  const time = Date.parse(order.createdAt);

  return Number.isNaN(time) ? 0 : time;
}

function formatCreatedDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/*
 * =========================================
 * PRODUCT IMAGE
 * =========================================
 */
function getProductImage(order) {
  return (
    order.listing?.images?.[0]?.imageUrl ||
    order.listing?.images?.[0]?.url ||
    order.listing?.imageUrl ||
    null
  );
}

/*
 * =========================================
 * DASHBOARD
 * =========================================
 */
function Dashboard() {
  const ordersQuery = useAdminOrders({
    statuses: dashboardStatuses,
  });

  const orders = ordersQuery.data ?? [];

  const hasData =
    ordersQuery.data !== undefined;

  /*
   * Latest 10 orders
   */
  const latestOrders = [...orders]
    .sort(
      (a, b) =>
        getCreatedTime(b) -
        getCreatedTime(a),
    )
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-[#F5F5F4] px-6 py-6">
      <div className="mx-auto w-full max-w-[1500px]">

        {/* HEADER */}
        <DashboardHeader
          isFetching={
            ordersQuery.isFetching
          }
          onRefresh={() =>
            ordersQuery.refetch()
          }
        />

        {/* ERROR */}
        {ordersQuery.isError && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
            <p className="text-sm font-medium text-red-700">
              {hasData
                ? "Unable to update data. Showing previously loaded data."
                : "Unable to load orders."}
            </p>

            <p className="mt-1 text-xs text-red-500">
              {ordersQuery.error
                ?.response?.data
                ?.message ||
                "Please try refreshing again."}
            </p>
          </div>
        )}

        {/* SUMMARY */}
        <DashboardSummary
          items={summaryItems}
          orders={orders}
          isPending={
            ordersQuery.isPending
          }
          hasData={hasData}
        />

        {/* RECENT ORDERS */}
        <RecentOrders
          orders={orders}
          latestOrders={latestOrders}
          isPending={
            ordersQuery.isPending
          }
          hasData={hasData}
          summaryItems={summaryItems}
          statusConfig={statusConfig}
          formatPrice={formatPrice}
          formatCreatedDate={
            formatCreatedDate
          }
          getProductImage={
            getProductImage
          }
        />
      </div>
    </div>
  );
}

export default Dashboard;