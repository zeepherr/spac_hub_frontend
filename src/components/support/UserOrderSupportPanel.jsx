import {
  AlertCircle,
  ImageIcon,
  LoaderCircle,
  MessageSquareText,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

import { useMySupportCaseById } from "@/hook/support/useMySupportCaseById";

import SupportCaseForm from "./SupportCaseForm";
import SupportChatPanel from "./SupportChatPanel";
import {
  formatSupportOrderPrice,
  getOrderStatusMeta,
  getSupportOrderImage,
  getSupportOrderName,
} from "./supportOrder.utils";

function UserOrderSupportPanel({
  order,
  mode,
  listedSupportCase,
  isSupportListPending,
  isSupportListError,
  supportListError,
  onRetrySupportList,
}) {
  const [createdSupportCase, setCreatedSupportCase] = useState(null);
  const [pendingDraft, setPendingDraft] = useState("");

  const supportCase = createdSupportCase || listedSupportCase || null;

  const {
    data: supportCaseDetail,
    isPending: isDetailPending,
    isError: isDetailError,
    error: detailError,
    refetch: refetchDetail,
  } = useMySupportCaseById(supportCase?.id);

  const activeSupportCase = supportCaseDetail || supportCase;

  function handleCreated(newSupportCase, meta) {
    setCreatedSupportCase(newSupportCase);
    setPendingDraft(meta?.pendingMessage || "");
  }

  return (
    <section className="flex h-full min-h-0 flex-col gap-3">
      <SelectedOrderSummary order={order} mode={mode} />

      <div className="min-h-0 flex-1">
        {isSupportListPending && !activeSupportCase ? (
          <PanelLoading label="Checking support history..." />
        ) : isSupportListError && !activeSupportCase ? (
          <PanelError
            message={
              supportListError?.response?.data?.message ||
              "Unable to load your support conversations."
            }
            onRetry={onRetrySupportList}
          />
        ) : !activeSupportCase ? (
          <div className="chat-scrollbar h-full overflow-y-auto rounded-2xl">
            <SupportCaseForm
              orderId={order.id}
              role={mode === "selling" ? "SELLER" : "BUYER"}
              onCreated={handleCreated}
              compact
            />
          </div>
        ) : isDetailPending && !supportCaseDetail ? (
          <PanelLoading label="Opening conversation..." />
        ) : isDetailError && !supportCaseDetail ? (
          <PanelError
            message={
              detailError?.response?.data?.message ||
              "Unable to open this conversation."
            }
            onRetry={refetchDetail}
          />
        ) : (
          <SupportChatPanel
            key={activeSupportCase.id}
            supportCase={activeSupportCase}
            initialDraft={pendingDraft}
            fillAvailableHeight
            showOrderContext={false}
          />
        )}
      </div>
    </section>
  );
}

function SelectedOrderSummary({ order, mode }) {
  const productName = getSupportOrderName(order);
  const imageUrl = getSupportOrderImage(order);
  const statusMeta = getOrderStatusMeta(order.status);

  return (
    <article className="flex shrink-0 items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
      <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
        {imageUrl ? (
          <img src={imageUrl} alt={productName} className="size-full object-cover" />
        ) : (
          <ImageIcon size={24} className="text-neutral-300" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <p className="truncate text-sm font-bold text-neutral-900">
            {productName}
          </p>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${statusMeta.className}`}
          >
            {statusMeta.label}
          </span>
        </div>

        <p className="mt-1 truncate text-xs text-neutral-400">
          {order.orderNumber || `Order #${order.id}`}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          <span className="font-bold text-orange-600">
            {formatSupportOrderPrice(order.agreedPrice)}
          </span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-neutral-500">
            <ShieldCheck size={14} className="text-emerald-500" />
            {mode === "buying" ? "Buying support" : "Selling support"}
          </span>
        </div>
      </div>
    </article>
  );
}

function NoSelectedSupportOrder({ mode }) {
  return (
    <div className="flex h-full min-h-0 flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-orange-50 text-orange-500">
        <MessageSquareText size={29} />
      </span>
      <h2 className="mt-4 text-lg font-bold text-neutral-900">
        Select an order
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-500">
        Choose a {mode === "buying" ? "purchase" : "sale"} from the list to
        open its support chat or start a new conversation.
      </p>
    </div>
  );
}

function PanelLoading({ label }) {
  return (
    <div className="flex h-full min-h-64 items-center justify-center gap-3 rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <LoaderCircle size={24} className="animate-spin text-orange-500" />
      <span className="text-sm text-neutral-500">{label}</span>
    </div>
  );
}

function PanelError({ message, onRetry }) {
  return (
    <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm">
      <AlertCircle size={30} className="text-red-500" />
      <p className="mt-3 text-sm font-bold text-neutral-900">
        Support is unavailable
      </p>
      <p className="mt-1 max-w-sm text-xs leading-5 text-neutral-500">
        {message}
      </p>
      <button
        type="button"
        onClick={() => onRetry()}
        className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50"
      >
        <RefreshCw size={14} />
        Try Again
      </button>
    </div>
  );
}

export { NoSelectedSupportOrder };
export default UserOrderSupportPanel;
