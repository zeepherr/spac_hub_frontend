import { ChevronRight, PackageSearch, UserRound } from "lucide-react";

import {
  hasUnreadSupportMessage,
  SUPPORT_STATUS_META,
} from "@/components/support/support.constants";

import {
  formatCaseDate,
  formatEnumLabel,
  getSupportCaseOpenerRole,
} from "./adminChats.utils";

function SupportCaseListItem({
  supportCase,
  currentUserId,
  isSelected,
  onSelect,
}) {
  const statusMeta = SUPPORT_STATUS_META[supportCase.status] || {
    label: supportCase.status,
    className: "bg-neutral-100 text-neutral-600",
  };

  const hasUnread = hasUnreadSupportMessage(supportCase, currentUserId);

  const latestMessage = supportCase.conversation?.messages?.[0];

  const listing = supportCase.order?.listing;

  const productImage = listing?.images?.[0]?.imageUrl || null;

  const productTitle =
    listing?.title ||
    [listing?.brand, listing?.model].filter(Boolean).join(" ") ||
    "Unknown product";

  const openedByName =
    [supportCase.openedBy?.firstName, supportCase.openedBy?.lastName]
      .filter(Boolean)
      .join(" ") || "Unknown user";

  const openedByRole = getSupportCaseOpenerRole(supportCase);

  const issueLabel = formatEnumLabel(supportCase.issueType);

  const latestActivity = latestMessage?.createdAt || supportCase.updatedAt;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className={[
        "group relative w-full rounded-xl border p-2 text-left transition-all duration-200 sm:p-2.5",
        isSelected
          ? "border-orange-300 bg-orange-50/80 shadow-sm"
          : hasUnread
            ? "border-orange-200 bg-white hover:bg-orange-50/40"
            : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50/70",
      ].join(" ")}
    >
      <div className="flex gap-2.5 sm:gap-3">
        {/* Product image */}
        <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100 sm:size-16">
          {productImage ? (
            <img
              src={productImage}
              alt={productTitle}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-neutral-400">
              <PackageSearch size={20} />
            </div>
          )}

          {hasUnread && (
            <span className="absolute right-1 top-1 size-2.5 rounded-full border-2 border-white bg-orange-500" />
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Product + status */}
          <div className="flex items-start justify-between gap-2">
            <p
              className={[
                "truncate text-sm text-neutral-900",
                hasUnread ? "font-bold" : "font-semibold",
              ].join(" ")}
            >
              {productTitle}
            </p>

            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusMeta.className}`}
            >
              {statusMeta.label}
            </span>
          </div>

          {/* User + role */}
          <div className="mt-1 flex min-w-0 items-center gap-1.5">
            <p className="truncate text-xs font-medium text-neutral-700">
              {openedByName}
            </p>

            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500">
              <UserRound size={10} />
              {openedByRole}
            </span>
          </div>

          {/* Case + issue */}
          <p className="mt-1 truncate text-[11px] text-neutral-500">
            <span className="font-medium">Case #{supportCase.id}</span>
            <span className="mx-1 text-neutral-300">•</span>
            <span className={hasUnread ? "font-medium text-orange-600" : ""}>
              {issueLabel}
            </span>
          </p>

          {/* Latest message + time */}
          <div className="mt-1.5 flex items-center justify-between gap-3">
            <p
              className={[
                "min-w-0 flex-1 truncate text-[11px]",
                hasUnread
                  ? "font-semibold text-neutral-700"
                  : "text-neutral-400",
              ].join(" ")}
            >
              {latestMessage?.content || "No messages yet"}
            </p>

            <div className="flex shrink-0 items-center gap-1.5">
              <time className="text-[10px] text-neutral-400">
                {formatCaseDate(latestActivity)}
              </time>

              <ChevronRight
                size={14}
                className={isSelected ? "text-orange-500" : "text-neutral-300"}
              />
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

export default SupportCaseListItem;
