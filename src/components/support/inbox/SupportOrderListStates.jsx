import { AlertCircle, MessageSquareText, RefreshCw } from "lucide-react";

function OrderListSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((item) => (
        <div
          key={item}
          className="h-[82px] animate-pulse rounded-xl bg-neutral-100"
        />
      ))}
    </div>
  );
}

function OrderListError({ onRetry }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center p-5 text-center">
      <AlertCircle size={30} className="text-red-500" />
      <p className="mt-3 text-sm font-bold text-neutral-800">
        Unable to load orders
      </p>
      <button
        type="button"
        onClick={() => onRetry()}
        className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50"
      >
        <RefreshCw size={14} />
        Try Again
      </button>
    </div>
  );
}

function EmptyOrderList({ hasSearch, mode }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center p-5 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-orange-50 text-orange-500">
        <MessageSquareText size={22} />
      </span>
      <p className="mt-3 text-sm font-bold text-neutral-800">
        {hasSearch
          ? "No matching orders"
          : `No ${mode === "buying" ? "buying" : "selling"} orders yet`}
      </p>
      <p className="mt-1 text-xs leading-5 text-neutral-400">
        {hasSearch
          ? "Try another order number or product name."
          : "Orders will appear here when they are available."}
      </p>
    </div>
  );
}

export { EmptyOrderList, OrderListError, OrderListSkeleton };
