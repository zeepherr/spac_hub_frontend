import { LoaderCircle, MessageSquareText, Wifi, WifiOff } from "lucide-react";

import { formatEnumLabel } from "./supportChat.utils";

function SupportChatHeader({
  supportCase,
  recipientLabel,
  recipientRole,
  statusMeta,
  isConnected,
  isJoined,
  showOrderContext,
  socketError,
}) {
  return (
    <>
      <header className="shrink-0 border-b border-neutral-200 px-4 py-3 sm:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
              <MessageSquareText size={20} />
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold text-neutral-900">
                {recipientLabel}
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                {recipientRole === "SELLER"
                  ? "Seller"
                  : recipientRole === "BUYER"
                    ? "Buyer"
                    : "SpecHub Support"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.className}`}
            >
              {statusMeta.label}
            </span>
            <ConnectionStatus isConnected={isConnected} isJoined={isJoined} />
          </div>
        </div>

        {showOrderContext && (
          <div className="mt-3 grid gap-2 rounded-xl border border-neutral-200 bg-neutral-50 p-3 sm:grid-cols-3">
            <ContextItem label="Support Case" value={`#${supportCase.id}`} />
            <ContextItem
              label="Order"
              value={supportCase.order?.orderNumber || `#${supportCase.orderId}`}
            />
            <ContextItem label="Issue" value={formatEnumLabel(supportCase.issueType)} />
          </div>
        )}
      </header>

      {socketError && (
        <div className="flex shrink-0 items-start gap-3 border-b border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 sm:px-5">
          <WifiOff size={18} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Chat connection problem</p>
            <p className="mt-0.5 text-xs text-red-600">{socketError.message}</p>
          </div>
        </div>
      )}
    </>
  );
}

function ConnectionStatus({ isConnected, isJoined }) {
  if (isConnected && isJoined) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
        <Wifi size={14} />
        Connected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400">
      <LoaderCircle size={14} className="animate-spin" />
      Connecting
    </span>
  );
}

function ContextItem({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-semibold text-neutral-800">
        {value}
      </p>
    </div>
  );
}

export default SupportChatHeader;
