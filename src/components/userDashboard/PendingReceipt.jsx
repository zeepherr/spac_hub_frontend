import {
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  PackageCheck,
  Truck,
} from "lucide-react";

// เดียวกับ GLASS_PANEL ที่ใช้ทั้งเว็บ
const GLASS_PANEL =
  "border border-neutral-200/70 bg-white/50 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)]";

function PendingReceipt({ orders = [], onConfirm, onViewAll }) {
  return (
    <section
      className={`flex h-[480px] w-full flex-col rounded-2xl p-5 lg:p-6 ${GLASS_PANEL}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
            <PackageCheck size={21} />
          </span>

          <div>
            <h2 className="text-lg font-bold text-neutral-900">Action Items</h2>

            {orders.length > 0 && (
              <p className="mt-0.5 text-xs text-neutral-400">
                {orders.length}{" "}
                {orders.length === 1 ? "item requires" : "items require"} your
                attention
              </p>
            )}
          </div>
        </div>

        {orders.length > 0 && (
          <button
            type="button"
            onClick={onViewAll}
            className="shrink-0 cursor-pointer text-sm font-bold text-orange-500 transition hover:text-orange-600"
          >
            See All
          </button>
        )}
      </div>

      {orders.length > 0 ? (
        <div className="dashboard-scroll mt-5 min-h-0 flex-1 space-y-4 overflow-y-auto pr-2">
          {orders.map((order) => (
            <ActionItemCard
              key={order.id}
              order={order}
              onConfirm={onConfirm}
            />
          ))}
        </div>
      ) : (
        <EmptyActionItems />
      )}
    </section>
  );
}

function ActionItemCard({ order, onConfirm }) {
  const needsPayment = order.actionType === "PAYMENT";

  const delivered = order.actionType === "CONFIRM_DELIVERY";

  const statusClassName = delivered
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-orange-200 bg-orange-50 text-orange-600";

  return (
    <article className="rounded-2xl border border-orange-200 bg-orange-50/40 backdrop-blur-sm p-4 transition hover:border-orange-300 hover:bg-orange-50/70">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* รูปสินค้า */}
        <div className="size-24 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
          {order.productImageUrl ? (
            <img
              src={order.productImageUrl}
              alt={order.productName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-orange-500">
              <PackageCheck size={28} />
            </div>
          )}
        </div>

        {/* ข้อมูลสินค้า */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-orange-500">
            {order.orderNumber}
          </p>

          <h3 className="mt-1 truncate text-base font-bold text-neutral-900">
            {order.productName}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-5 text-neutral-500">
            {order.message}
          </p>
        </div>

        {/* สถานะและปุ่ม */}
        <div className="flex shrink-0 flex-col gap-3 sm:w-52">
          <span
            className={`inline-flex items-center justify-center gap-2 rounded-full border px-3 py-2 text-xs font-bold ${statusClassName}`}
          >
            {needsPayment ? (
              <CircleAlert size={15} />
            ) : delivered ? (
              <CheckCircle2 size={15} />
            ) : (
              <Truck size={15} />
            )}

            {order.statusLabel}
          </span>

          <button
            type="button"
            onClick={() => onConfirm(order)}
            className={`inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition active:scale-[0.99] ${
              delivered
                ? "border border-neutral-900 bg-white text-neutral-900 hover:bg-neutral-100"
                : "bg-orange-500 text-white hover:bg-orange-600"
            }`}
          >
            {order.actionLabel}
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}

function EmptyActionItems() {
  return (
    <div className="mt-5 flex min-h-64 flex-col items-center justify-center rounded-2xl bg-neutral-50/60 backdrop-blur-sm p-6 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-white/70 backdrop-blur-sm text-neutral-300 shadow-sm">
        <PackageCheck size={30} />
      </span>

      <h3 className="mt-4 font-bold text-neutral-700">No action items</h3>

      <p className="mt-1 text-sm text-neutral-400">
        You&apos;re all caught up!
      </p>
    </div>
  );
}

export default PendingReceipt;
