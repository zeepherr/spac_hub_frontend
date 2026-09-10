import {
  LayoutGrid,
  RefreshCw,
} from "lucide-react";

function DashboardHeader({
  isFetching,
  onRefresh,
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-orange-100">
          <LayoutGrid
            size={22}
            className="text-orange-500"
          />
        </div>

        <div>
          <h1 className="text-xl font-semibold text-neutral-900">
            Dashboard
          </h1>

          <p className="mt-1 text-xs text-neutral-500">
            Overview of orders that require
            admin action.
          </p>
        </div>
      </div>

      {/* REFRESH */}
      <button
        type="button"
        onClick={onRefresh}
        disabled={isFetching}
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
            isFetching
              ? "animate-spin"
              : ""
          }
        />

        {isFetching
          ? "Loading..."
          : "Refresh"}
      </button>
    </div>
  );
}

export default DashboardHeader;