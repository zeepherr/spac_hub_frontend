import { MessageSquareText, ShoppingBag, Store } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import UserOrderSupportPanel, {
  NoSelectedSupportOrder,
} from "@/components/support/UserOrderSupportPanel";
import UserSupportOrderList from "@/components/support/UserSupportOrderList";
import { hasUnreadSupportMessage } from "@/components/support/support.constants";
import { useBuyingOrders } from "@/hook/order/useBuyingOrders";
import { useSellingOrders } from "@/hook/order/useSellingOrder";
import { useMySupportCases } from "@/hook/support/useMySupportCases";
import useAuthStore from "@/stores/auth.store";

const SELLER_HIDDEN_STATUSES = new Set(["PENDING", "AWAITING_PAYMENT"]);
const EMPTY_LIST = [];

function SupportInbox() {
  const currentUserId = useAuthStore((state) => state.user?.id);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [searchText, setSearchText] = useState("");

  const mode = searchParams.get("view") === "selling" ? "selling" : "buying";

  const buyingQuery = useBuyingOrders();
  const sellingQuery = useSellingOrders();
  const supportCasesQuery = useMySupportCases();

  const buyingOrders = buyingQuery.data || EMPTY_LIST;
  const sellingOrders = useMemo(() => {
    return (sellingQuery.data || []).filter(
      (order) => !SELLER_HIDDEN_STATUSES.has(order.status),
    );
  }, [sellingQuery.data]);

  const supportCases = supportCasesQuery.data || EMPTY_LIST;

  const supportCaseByOrderId = useMemo(() => {
    return new Map(
      supportCases.map((supportCase) => [
        String(supportCase.orderId),
        supportCase,
      ]),
    );
  }, [supportCases]);

  const buyingOrderIds = useMemo(
    () => new Set(buyingOrders.map((order) => String(order.id))),
    [buyingOrders],
  );

  const sellingOrderIds = useMemo(
    () => new Set(sellingOrders.map((order) => String(order.id))),
    [sellingOrders],
  );

  const unreadCounts = useMemo(() => {
    return supportCases.reduce(
      (counts, supportCase) => {
        if (!hasUnreadSupportMessage(supportCase, currentUserId)) {
          return counts;
        }

        const orderId = String(supportCase.orderId);

        if (buyingOrderIds.has(orderId)) {
          counts.buying += 1;
        }

        if (sellingOrderIds.has(orderId)) {
          counts.selling += 1;
        }

        return counts;
      },
      { buying: 0, selling: 0 },
    );
  }, [supportCases, currentUserId, buyingOrderIds, sellingOrderIds]);

  const activeOrders = mode === "buying" ? buyingOrders : sellingOrders;
  const activeOrderQuery = mode === "buying" ? buyingQuery : sellingQuery;

  const selectedOrder = activeOrders.find(
    (order) => String(order.id) === String(selectedOrderId),
  );

  const selectedSupportCase = selectedOrder
    ? supportCaseByOrderId.get(String(selectedOrder.id))
    : null;

  function handleModeChange(nextMode) {
    setSearchParams(nextMode === "selling" ? { view: "selling" } : {});
    setSelectedOrderId(null);
    setSearchText("");
  }

  return (
    <section className="h-full min-h-0 overflow-hidden bg-neutral-50 px-4 py-4 lg:px-6">
      <div className="mx-auto flex h-full min-h-0 w-full max-w-[1420px] flex-col">
        <header className="flex shrink-0 items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
              Support center
            </p>
            <h1 className="mt-1 text-2xl font-bold text-neutral-900">
              Support Inbox
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Choose an order and talk privately with SpecHub Support.
            </p>
          </div>

          <span className="hidden size-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500 sm:flex">
            <MessageSquareText size={22} />
          </span>
        </header>

        <div className="mt-3 grid shrink-0 grid-cols-2 gap-2 rounded-2xl border border-neutral-200 bg-white p-1.5 shadow-sm">
          <SupportModeButton
            icon={ShoppingBag}
            label="Buying"
            count={buyingOrders.length}
            unreadCount={unreadCounts.buying}
            isActive={mode === "buying"}
            onClick={() => handleModeChange("buying")}
          />
          <SupportModeButton
            icon={Store}
            label="Selling"
            count={sellingOrders.length}
            unreadCount={unreadCounts.selling}
            isActive={mode === "selling"}
            onClick={() => handleModeChange("selling")}
          />
        </div>

        <div className="mt-3 grid min-h-0 flex-1 grid-rows-[minmax(210px,0.45fr)_minmax(0,1fr)] gap-3 lg:grid-cols-[340px_minmax(0,1fr)] lg:grid-rows-1">
          <UserSupportOrderList
            orders={activeOrders}
            supportCaseByOrderId={supportCaseByOrderId}
            selectedOrderId={selectedOrderId}
            currentUserId={currentUserId}
            searchText={searchText}
            onSearchChange={setSearchText}
            onSelectOrder={setSelectedOrderId}
            isPending={activeOrderQuery.isPending}
            isError={activeOrderQuery.isError}
            onRetry={activeOrderQuery.refetch}
            mode={mode}
          />

          <main className="min-h-0 min-w-0 overflow-hidden">
            {selectedOrder ? (
              <UserOrderSupportPanel
                key={`${mode}-${selectedOrder.id}`}
                order={selectedOrder}
                mode={mode}
                listedSupportCase={selectedSupportCase}
                isSupportListPending={supportCasesQuery.isPending}
                isSupportListError={supportCasesQuery.isError}
                supportListError={supportCasesQuery.error}
                onRetrySupportList={supportCasesQuery.refetch}
              />
            ) : (
              <NoSelectedSupportOrder mode={mode} />
            )}
          </main>
        </div>
      </div>
    </section>
  );
}

function SupportModeButton({
  icon: Icon,
  label,
  count,
  unreadCount,
  isActive,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`relative flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition ${
        isActive
          ? "bg-neutral-900 text-white shadow-sm"
          : "text-neutral-500 hover:bg-orange-50 hover:text-orange-600"
      }`}
    >
      <Icon size={18} />
      {label}
      <span
        className={`inline-flex min-w-6 items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] ${
          isActive
            ? "bg-white/15 text-white"
            : "bg-neutral-100 text-neutral-500"
        }`}
      >
        {count}
      </span>

      {unreadCount > 0 && (
        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 py-0.5 text-[10px] font-black text-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
}

export default SupportInbox;
