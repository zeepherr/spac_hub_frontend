import { ShoppingBag, Store } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import SupportInboxHeader from "@/components/support/inbox/SupportInboxHeader";
import SupportModeButton from "@/components/support/inbox/SupportModeButton";
import UserOrderSupportPanel, {
  NoSelectedSupportOrder,
} from "@/components/support/UserOrderSupportPanel";
import UserSupportOrderList from "@/components/support/UserSupportOrderList";
import { hasUnreadSupportMessage } from "@/components/support/support.constants";
import { useBuyingOrders } from "@/hook/order/useBuyingOrders";
import { useSellingOrders } from "@/hook/order/useSellingOrder";
import { useMySupportCases } from "@/hook/support/useMySupportCases";
import useAuthStore from "@/stores/auth.store";

// bg หลักมาตรฐานของทั้งเว็บ (เดียวกับที่ตั้งไว้ใน PublicLayout.jsx) - ใช้กับพื้นหลังหลักของหน้าเท่านั้น
// ไม่ใช่ bg ของปุ่มหรือ element ย่อย เดิมหน้านี้ใช้ bg-neutral-50 (สีทึบ)
const PAGE_BG =
  "bg-[linear-gradient(180deg,rgba(59,130,246,0.12)_0%,transparent_35%),linear-gradient(0deg,rgba(59,130,246,0.12)_0%,transparent_35%),linear-gradient(180deg,#fafafa_0%,#f0f0f0_100%)]";
// เดียวกับ GLASS_PANEL ที่ใช้ทั้งเว็บ
const GLASS_PANEL =
  "border border-neutral-200/70 bg-white/50 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)]";

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
    <section
      className={`h-full min-h-0 overflow-hidden px-4 py-4 lg:px-6 ${PAGE_BG}`}
    >
      <div className="mx-auto flex h-full min-h-0 w-full max-w-[1420px] flex-col">
        <SupportInboxHeader />

        <div
          className={`mt-3 grid shrink-0 grid-cols-2 gap-2 rounded-2xl p-1.5 ${GLASS_PANEL}`}
        >
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

export default SupportInbox;
