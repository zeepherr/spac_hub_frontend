import { Box, ChevronRight } from "lucide-react";

// เดียวกับ GLASS_PANEL ที่ใช้ทั้งเว็บ
const GLASS_PANEL =
  "border border-neutral-200/70 bg-white/50 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)]";

// สถานะเป็น accent เล็ก ๆ ปล่อยสีไว้ตามเดิมตามเกณฑ์เดียวกับทั้งเว็บ
const ORDER_STATUS_CONFIG = {
  AWAITING_PAYMENT: {
    label: "AWAITING PAYMENT",
    className: "border border-orange-200 bg-orange-50 text-orange-600",
  },
  PAID: {
    label: "PAID",
    className: "border border-neutral-200 bg-neutral-100 text-neutral-700",
  },
  SELLER_SHIPPING: {
    label: "SELLER SHIPPING",
    className: "border border-orange-200 bg-orange-50 text-orange-600",
  },
  SHIPPING_TO_ADMIN: {
    label: "SHIPPING TO ADMIN",
    className: "border border-orange-200 bg-orange-50 text-orange-600",
  },
  RECEIVED_BY_ADMIN: {
    label: "RECEIVED BY ADMIN",
    className: "border border-orange-200 bg-orange-50 text-orange-600",
  },
  INSPECTING: {
    label: "INSPECTING",
    className: "border border-orange-200 bg-orange-50 text-orange-600",
  },
  SHIPPING_TO_BUYER: {
    label: "SHIPPING TO BUYER",
    className: "border border-orange-200 bg-orange-50 text-orange-600",
  },
  COMPLETED: {
    label: "COMPLETED",
    className: "border border-neutral-800 bg-neutral-900 text-white",
  },
  CANCELLED: {
    label: "CANCELLED",
    className: "border border-red-200 bg-red-50 text-red-600",
  },
  REJECTED: {
    label: "REJECTED",
    className: "border border-red-200 bg-red-50 text-red-600",
  },
  REFUNDED: {
    label: "REFUNDED",
    className: "border border-neutral-300 bg-neutral-100 text-neutral-600",
  },
};

function RecentOrders({ orders = [], onViewAll, onSelectOrder }) {
  return (
    <section
      className={`flex h-[500px] w-full flex-col rounded-2xl p-5 lg:p-6 ${GLASS_PANEL}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-neutral-900 text-white">
            <Box size={20} />
          </span>

          <h2 className="text-lg font-bold text-neutral-900">Recent Orders</h2>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="shrink-0 cursor-pointer text-sm font-bold text-orange-500 transition hover:text-orange-600"
        >
          See All
        </button>
      </div>

      {orders.length > 0 ? (
        <div className="dashboard-scroll mt-5 min-h-0 flex-1 space-y-3 overflow-y-auto pr-2">
          {orders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              onClick={() => onSelectOrder(order.id)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-5 flex min-h-64 items-center justify-center rounded-2xl bg-neutral-50/60 backdrop-blur-sm p-6">
          <p className="text-sm text-neutral-400">No orders yet</p>
        </div>
      )}
    </section>
  );
}

function OrderRow({ order, onClick }) {
  const status = ORDER_STATUS_CONFIG[order.status] ?? {
    label: order.status || "UNKNOWN",
    className: "border border-neutral-200 bg-neutral-100 text-neutral-600",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="grid w-full cursor-pointer grid-cols-[64px_minmax(0,1fr)_20px] items-center gap-4 rounded-2xl border border-neutral-200/70 bg-white/60 backdrop-blur-sm p-3 text-left transition hover:border-orange-200 hover:bg-orange-50/40 sm:grid-cols-[72px_minmax(0,1fr)_110px_150px_20px]"
    >
      <div className="flex size-16 items-center justify-center overflow-hidden rounded-xl bg-neutral-100 sm:size-[72px]">
        {order.productImageUrl ? (
          <img
            src={order.productImageUrl}
            alt={order.productName}
            className="size-full object-cover"
          />
        ) : (
          <Box size={26} className="text-neutral-300" />
        )}
      </div>

      <div className="min-w-0">
        <p className="truncate text-xs font-bold text-neutral-900 sm:text-sm">
          {order.orderNumber}
        </p>

        <p className="mt-1 truncate text-sm text-neutral-600">
          {order.productName}
        </p>

        <p className="mt-1 text-xs text-neutral-400">
          Ordered on {formatOrderDate(order.createdAt)}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2 sm:hidden">
          <p className="font-bold text-neutral-900">
            ฿{Number(order.price).toLocaleString("th-TH")}
          </p>

          <span
            className={`rounded-full px-3 py-1 text-[10px] font-bold ${status.className}`}
          >
            {status.label}
          </span>
        </div>
      </div>

      <p className="hidden text-right text-base font-bold text-neutral-900 sm:block">
        ฿{Number(order.price).toLocaleString("th-TH")}
      </p>

      <div className="hidden text-right sm:block">
        <span
          className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-bold ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      <ChevronRight size={19} className="text-neutral-400" />
    </button>
  );
}

function formatOrderDate(date) {
  if (!date) return "-";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "-";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

export default RecentOrders;
