import { RefreshCw } from "lucide-react";

function AdminChatsHeader({ totalCases, unreadCount, onRefresh }) {
  return (
    <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-5">
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider text-orange-500 sm:text-sm">
          Support Center
        </p>

        <h1 className="mt-1 text-balance text-2xl font-bold leading-tight text-neutral-900 sm:text-3xl">
          Support Conversations
        </h1>

        <p className="mt-1.5 max-w-xl text-sm leading-5 text-neutral-500 sm:mt-2">
          Manage Buyer and Seller order-support cases.
        </p>
      </div>

      <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:grid-cols-[auto_auto_auto] sm:gap-3">
        <div className="min-w-0 rounded-xl border border-neutral-200 bg-white px-3 py-2 shadow-sm sm:px-4">
          <p className="text-xs text-neutral-400">Total cases</p>
          <p className="text-lg font-bold text-neutral-900">{totalCases}</p>
        </div>

        <div className="min-w-0 rounded-xl border border-orange-100 bg-orange-50 px-3 py-2 sm:px-4">
          <p className="text-xs text-orange-600">Unread</p>
          <p className="text-lg font-bold text-orange-600">{unreadCount}</p>
        </div>

        <button
          type="button"
          onClick={() => onRefresh()}
          className="col-span-2 inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-700 shadow-sm transition hover:border-orange-200 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-200 sm:col-span-1 sm:w-auto"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>
    </header>
  );
}

export default AdminChatsHeader;
