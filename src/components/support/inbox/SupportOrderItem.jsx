import { ChevronRight, ImageIcon } from "lucide-react";

import {
  SUPPORT_STATUS_META,
  hasUnreadSupportMessage,
} from "../support.constants";
import {
  formatSupportOrderDate,
  getSupportOrderImage,
  getSupportOrderName,
} from "../supportOrder.utils";

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

export default SupportOrderItem;
