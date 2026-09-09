import { Search } from "lucide-react";
import { useMemo } from "react";

import { hasUnreadSupportMessage } from "./support.constants";
import SupportOrderItem from "./inbox/SupportOrderItem";
import {
  EmptyOrderList,
  OrderListError,
  OrderListSkeleton,
} from "./inbox/SupportOrderListStates";

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

export default UserSupportOrderList;
