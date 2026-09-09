import { ChevronRight, ImageIcon, RefreshCw } from "lucide-react";

import { OrderStatusBadge } from "./AdminOrderDetailParts";
import {
  formatEnumLabel,
  formatPrice,
  getCoverImage,
  getProductName,
} from "./adminOrderContext.utils";

function AdminOrderPreview({
  order,
  fallbackOrderNumber,
  supportCaseId,
  issueType,
  isPending,
  isError,
  hasFullDetails,
  onRetry,
  onViewDetails,
}) {
  if (isPending && !order) {
    return <OrderPreviewSkeleton />;
  }

  if (isError && !order) {
    return (
      <section className="flex shrink-0 flex-col items-stretch justify-between gap-3 rounded-2xl border border-red-100 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:gap-4">
        <div className="min-w-0">
          <p className="text-sm font-bold text-neutral-900">
            Order details are unavailable
          </p>
          <p className="mt-1 truncate text-xs text-neutral-500">
            {fallbackOrderNumber || "Unable to load this order."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onRetry()}
          className="inline-flex h-11 w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 px-3 text-xs font-bold text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-100 sm:h-10 sm:w-auto"
        >
          <RefreshCw size={15} />
          Retry
        </button>
      </section>
    );
  }

  if (!order) {
    return null;
  }

  const productName = getProductName(order);
  const coverImage = getCoverImage(order);

  return (
    <section className="shrink-0 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
      <div className="grid grid-cols-[64px_minmax(0,1fr)] items-center gap-3 sm:flex">
        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
          {coverImage ? (
            <img
              src={coverImage}
              alt={productName}
              className="size-full object-cover"
            />
          ) : (
            <ImageIcon size={24} className="text-neutral-300" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h2 className="max-w-full truncate text-sm font-bold text-neutral-900">
              {productName}
            </h2>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="mt-1 truncate text-xs text-neutral-500">
            {order.orderNumber || fallbackOrderNumber || `Order #${order.id}`}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
            <span className="font-bold text-orange-600">
              {formatPrice(order.agreedPrice)}
            </span>
            <span className="truncate text-neutral-500">
              Case #{supportCaseId} · {formatEnumLabel(issueType)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={isError ? () => onRetry() : onViewDetails}
          disabled={isPending || (!hasFullDetails && !isError)}
          className="col-span-2 inline-flex h-11 w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 text-xs font-bold text-white transition hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 disabled:cursor-not-allowed disabled:opacity-45 sm:h-10 sm:w-auto"
        >
          {isError
            ? "Retry Order Details"
            : isPending
              ? "Loading Details..."
              : "View Order Details"}
          {isError ? <RefreshCw size={15} /> : <ChevronRight size={15} />}
        </button>
      </div>
    </section>
  );
}

function OrderPreviewSkeleton() {
  return (
    <div className="grid shrink-0 animate-pulse grid-cols-[64px_minmax(0,1fr)] items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm sm:flex">
      <div className="size-16 shrink-0 rounded-xl bg-neutral-100" />
      <div className="min-w-0 flex-1">
        <div className="h-4 w-48 rounded bg-neutral-100" />
        <div className="mt-2 h-3 w-64 max-w-full rounded bg-neutral-100" />
        <div className="mt-2 h-3 w-36 rounded bg-neutral-100" />
      </div>
      <div className="col-span-2 h-11 w-full rounded-xl bg-neutral-100 sm:h-10 sm:w-36" />
    </div>
  );
}

export default AdminOrderPreview;
