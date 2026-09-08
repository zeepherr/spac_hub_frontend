import {
  AlertCircle,
  ChevronRight,
  ImageIcon,
  MessageSquareText,
  RefreshCw,
  Search,
} from "lucide-react";
import { useMemo } from "react";

import {
  SUPPORT_STATUS_META,
  hasUnreadSupportMessage,
} from "./support.constants";
import {
  formatSupportOrderDate,
  getSupportOrderImage,
  getSupportOrderName,
} from "./supportOrder.utils";

function UserSupportOrderList({
  orders,
  supportCaseByOrderId,
  selectedOrderId,
  currentUserId,
  searchText,
  onSearchChange,
  onSelectOrder,
  isPending,
  isError,
  onRetry,
  mode,
}) {
  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return orders
      .filter((order) => {
        if (!normalizedSearch) {
          return true;
        }

        return [
          order.orderNumber,
          order.id,
          order.listing?.title,
          order.listing?.brand,
          order.listing?.model,
          order.status,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);
      })
      .sort((firstOrder, secondOrder) => {
        const firstCase = supportCaseByOrderId.get(String(firstOrder.id));
        const secondCase = supportCaseByOrderId.get(String(secondOrder.id));

        const firstUnread = hasUnreadSupportMessage(firstCase, currentUserId);
        const secondUnread = hasUnreadSupportMessage(secondCase, currentUserId);

        if (firstUnread !== secondUnread) {
          return firstUnread ? -1 : 1;
        }

        return (
          new Date(
            secondCase?.updatedAt ||
              secondOrder.updatedAt ||
              secondOrder.createdAt ||
              0,
          ).getTime() -
          new Date(
            firstCase?.updatedAt ||
              firstOrder.updatedAt ||
              firstOrder.createdAt ||
              0,
          ).getTime()
        );
      });
  }, [orders, supportCaseByOrderId, searchText, currentUserId]);

  return (
    <aside className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="shrink-0 border-b border-neutral-200 p-3">
        <label className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 transition focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
          <Search size={17} className="shrink-0 text-neutral-400" />
          <input
            type="search"
            value={searchText}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={`Search ${mode === "buying" ? "purchases" : "sales"}...`}
            className="h-10 min-w-0 flex-1 bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
          />
        </label>

        <div className="mt-3 flex items-center justify-between gap-3 px-1">
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            {mode === "buying" ? "Buying orders" : "Selling orders"}
          </p>
          <span className="text-xs font-semibold text-neutral-500">
            {filteredOrders.length} shown
          </span>
        </div>
      </div>

      <div className="chat-scrollbar min-h-0 flex-1 overflow-y-auto p-2">
        {isPending ? (
          <OrderListSkeleton />
        ) : isError ? (
          <OrderListError onRetry={onRetry} />
        ) : filteredOrders.length === 0 ? (
          <EmptyOrderList hasSearch={Boolean(searchText.trim())} mode={mode} />
        ) : (
          <div className="space-y-1.5">
            {filteredOrders.map((order) => {
              const supportCase = supportCaseByOrderId.get(String(order.id));

              return (
                <SupportOrderItem
                  key={order.id}
                  order={order}
                  supportCase={supportCase}
                  currentUserId={currentUserId}
                  isSelected={String(selectedOrderId) === String(order.id)}
                  onSelect={() => onSelectOrder(order.id)}
                />
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}

function SupportOrderItem({
  order,
  supportCase,
  currentUserId,
  isSelected,
  onSelect,
}) {
  const productName = getSupportOrderName(order);
  const imageUrl = getSupportOrderImage(order);
  const latestMessage = supportCase?.conversation?.messages?.[0];
  const hasUnread = hasUnreadSupportMessage(supportCase, currentUserId);
  const supportStatus = supportCase
    ? SUPPORT_STATUS_META[supportCase.status] || {
        label: supportCase.status,
        className: "bg-neutral-100 text-neutral-600",
      }
    : null;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className={`grid w-full cursor-pointer grid-cols-[58px_minmax(0,1fr)_16px] items-center gap-3 rounded-xl border p-2.5 text-left transition ${
        isSelected
          ? "border-orange-300 bg-orange-50 shadow-sm"
          : hasUnread
            ? "border-orange-100 bg-white hover:bg-orange-50/60"
            : "border-transparent bg-white hover:border-neutral-200 hover:bg-neutral-50"
      }`}
    >
      <div className="flex size-[58px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
        {imageUrl ? (
          <img src={imageUrl} alt={productName} className="size-full object-cover" />
        ) : (
          <ImageIcon size={22} className="text-neutral-300" />
        )}
      </div>

      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-2">
          {hasUnread && (
            <span className="relative flex size-2 shrink-0">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-orange-400 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-orange-500" />
            </span>
          )}

          <p className="truncate text-sm font-bold text-neutral-900">
            {productName}
          </p>
        </div>

        <div className="mt-0.5 flex min-w-0 items-center justify-between gap-2 text-[10px] text-neutral-400">
          <p className="min-w-0 flex-1 truncate">
            {order.orderNumber || `Order #${order.id}`}
          </p>
          <time className="shrink-0">
            {formatSupportOrderDate(
              latestMessage?.createdAt ||
                supportCase?.updatedAt ||
                order.updatedAt,
            )}
          </time>
        </div>

        <div className="mt-1.5 flex min-w-0 items-center gap-2">
          {supportStatus ? (
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${supportStatus.className}`}
            >
              {supportStatus.label}
            </span>
          ) : (
            <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-500">
              Start chat
            </span>
          )}

          <p className="min-w-0 flex-1 truncate text-[11px] text-neutral-500">
            {latestMessage?.content || "Select this order for support"}
          </p>
        </div>
      </div>

      <ChevronRight
        size={16}
        className={isSelected ? "text-orange-500" : "text-neutral-300"}
      />
    </button>
  );
}

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

export default UserSupportOrderList;
