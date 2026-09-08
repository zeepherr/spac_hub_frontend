import { RefreshCw } from "lucide-react";

function AdminChatsHeader({ totalCases, unreadCount, onRefresh }) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-orange-500">
          Support Center
        </p>

        <h1 className="mt-1 text-3xl font-bold text-neutral-900">
          Support Conversations
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          Manage Buyer and Seller order-support cases.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-xl border border-neutral-200 bg-white px-4 py-2 shadow-sm">
          <p className="text-xs text-neutral-400">Total cases</p>
          <p className="text-lg font-bold text-neutral-900">{totalCases}</p>
        </div>

        <div className="rounded-xl border border-orange-100 bg-orange-50 px-4 py-2">
          <p className="text-xs text-orange-600">Unread</p>
          <p className="text-lg font-bold text-orange-600">{unreadCount}</p>
        </div>

        <button
          type="button"
          onClick={() => onRefresh()}
          className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-700 shadow-sm transition hover:border-orange-200 hover:text-orange-600"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>
    </header>
  );
}

export default AdminChatsHeader;
