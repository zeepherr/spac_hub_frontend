import {
  ChevronRight,
  PackageCheck,
} from "lucide-react";

function PendingReceipt({
  orders = [],
  onConfirm,
  onViewAll,
}) {
  return (
    <section className="flex h-[480px] w-full flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm lg:p-6">
      {/* ส่วนหัว */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
            <PackageCheck size={21} />
          </span>

          <div>
            <h2 className="text-lg font-bold text-neutral-900">
              Action Items
            </h2>

            {orders.length > 0 && (
              <p className="mt-0.5 text-xs text-neutral-400">
                {orders.length}{" "}
                {orders.length === 1
                  ? "item requires"
                  : "items require"}{" "}
                your attention
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

      {/* รายการ Action */}
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

function ActionItemCard({
  order,
  onConfirm,
}) {
  return (
    <article className="rounded-2xl border border-orange-200 bg-orange-50/40 p-4 transition hover:border-orange-300 hover:bg-orange-50/70">
      {/* ข้อมูล Order */}
      <div className="flex items-start gap-4">
        {/* ใช้ไอคอนกล่องแบบเดิม */}
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-orange-100 bg-white text-orange-500 shadow-sm">
          <PackageCheck size={23} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-orange-500">
            {order.orderNumber}
          </p>

          <h3 className="mt-1 truncate text-sm font-bold text-neutral-900 sm:text-base">
            {order.productName}
          </h3>

          <p className="mt-2 line-clamp-2 text-xs leading-5 text-neutral-500 sm:text-sm">
            {order.message}
          </p>
        </div>
      </div>

      {/* ปุ่มเปิดรายละเอียด */}
      <button
        type="button"
        onClick={() => onConfirm(order.id)}
        className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-orange-600 hover:to-orange-700 active:scale-[0.99]"
      >
        View Order
        <ChevronRight size={17} />
      </button>
    </article>
  );
}

function EmptyActionItems() {
  return (
    <div className="mt-5 flex min-h-64 flex-col items-center justify-center rounded-2xl bg-neutral-50 p-6 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-white text-neutral-300 shadow-sm">
        <PackageCheck size={30} />
      </span>

      <h3 className="mt-4 font-bold text-neutral-700">
        No action items
      </h3>

      <p className="mt-1 text-sm text-neutral-400">
        You&apos;re all caught up!
      </p>
    </div>
  );
}

export default PendingReceipt;