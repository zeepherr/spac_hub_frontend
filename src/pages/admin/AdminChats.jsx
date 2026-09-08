import {
  AlertCircle,
  ChevronRight,
  Inbox,
  LoaderCircle,
  MessageSquareText,
  RefreshCw,
  Search,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  AdminOrderDetailsModal,
  AdminOrderPreview,
} from "@/components/admin/support/AdminOrderContext";
import SupportChatPanel from "@/components/support/SupportChatPanel";
import {
  hasUnreadSupportMessage,
  SUPPORT_STATUS_META,
} from "@/components/support/support.constants";

import { useAdminOrderById } from "@/hook/order/useAdminOrderById";
import { useAdminSupportCaseById } from "@/hook/support/useAdminSupportCaseById";
import { useAdminSupportCases } from "@/hook/support/useAdminSupportCases";
import { useUpdateSupportCaseStatus } from "@/hook/support/useUpdateSupportCaseStatus";
import useAuthStore from "@/stores/auth.store";

const STATUS_FILTERS = [
  { value: "ALL", label: "All cases" },
  { value: "OPEN", label: "Open" },
  { value: "INVESTIGATING", label: "Investigating" },
  { value: "WAITING_FOR_BUYER", label: "Waiting for Buyer" },
  { value: "WAITING_FOR_SELLER", label: "Waiting for Seller" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
];

const STATUS_OPTIONS = STATUS_FILTERS.filter(
  (status) => status.value !== "ALL",
);

function AdminChats() {
  const currentUser = useAuthStore((state) => state.user);

  const [selectedSupportCaseId, setSelectedSupportCaseId] = useState(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const {
    data: supportCases = [],
    isPending: isCasesPending,
    isError: isCasesError,
    refetch: refetchCases,
  } = useAdminSupportCases();

  const unreadCount = useMemo(() => {
    return supportCases.filter((supportCase) =>
      hasUnreadSupportMessage(supportCase, currentUser?.id),
    ).length;
  }, [supportCases, currentUser?.id]);

  const filteredSupportCases = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return supportCases
      .filter((supportCase) => {
        if (statusFilter === "ALL") {
          return true;
        }

        return supportCase.status === statusFilter;
      })
      .filter((supportCase) => {
        if (!normalizedSearch) {
          return true;
        }

        const openedByName = [
          supportCase.openedBy?.firstName,
          supportCase.openedBy?.lastName,
        ]
          .filter(Boolean)
          .join(" ");

        const searchableText = [
          supportCase.id,
          supportCase.orderId,
          supportCase.order?.orderNumber,
          supportCase.order?.listing?.title,
          supportCase.issueType,
          supportCase.status,
          openedByName,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(normalizedSearch);
      })
      .sort((firstCase, secondCase) => {
        const firstUnread = hasUnreadSupportMessage(firstCase, currentUser?.id);

        const secondUnread = hasUnreadSupportMessage(
          secondCase,
          currentUser?.id,
        );

        // Unread cases appear first.
        if (firstUnread !== secondUnread) {
          return firstUnread ? -1 : 1;
        }

        return (
          new Date(secondCase.updatedAt).getTime() -
          new Date(firstCase.updatedAt).getTime()
        );
      });
  }, [supportCases, statusFilter, searchText, currentUser?.id]);

  /* Close the active conversation if filtering removes it from the queue. */
  useEffect(() => {
    if (!selectedSupportCaseId) {
      return;
    }

    const selectedCaseStillVisible = filteredSupportCases.some(
      (supportCase) => Number(supportCase.id) === Number(selectedSupportCaseId),
    );

    if (!selectedCaseStillVisible) {
      setSelectedSupportCaseId(null);
      setIsOrderDetailOpen(false);
    }
  }, [filteredSupportCases, selectedSupportCaseId]);

  const {
    data: supportCaseDetail,
    isPending: isDetailPending,
    isError: isDetailError,
    error: detailError,
    refetch: refetchDetail,
  } = useAdminSupportCaseById(selectedSupportCaseId);

  const {
    data: adminOrder,
    isPending: isOrderPending,
    isError: isOrderError,
    refetch: refetchOrder,
  } = useAdminOrderById(
    supportCaseDetail?.order?.id || supportCaseDetail?.orderId,
  );

  const orderPreview = adminOrder || supportCaseDetail?.order;

  function handleSelectSupportCase(supportCaseId) {
    setSelectedSupportCaseId(supportCaseId);
    setIsOrderDetailOpen(false);
  }

  function handleCloseOrderDetails() {
    setIsOrderDetailOpen(false);
  }

  return (
    <section className="h-full min-h-0 overflow-hidden bg-[#F5F5F4] px-4 py-4 lg:px-6">
      <div className="mx-auto flex h-full min-h-0 w-full max-w-[1500px] flex-col">
        <div className="shrink-0">
          <AdminChatsHeader
            totalCases={supportCases.length}
            unreadCount={unreadCount}
            onRefresh={refetchCases}
          />
        </div>

        <div className="mt-4 grid min-h-0 flex-1 grid-rows-[minmax(160px,0.45fr)_minmax(0,1fr)] gap-4 xl:grid-cols-[360px_minmax(0,1fr)] xl:grid-rows-1">
          {/* Left: Support queue */}
          <aside className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <div className="border-b border-neutral-200 p-4">
              <label className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-3 transition focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
                <Search size={18} className="shrink-0 text-neutral-400" />

                <input
                  type="search"
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Search order, user or issue..."
                  className="h-11 min-w-0 flex-1 bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
                />
              </label>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="mt-3 h-11 w-full cursor-pointer rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              >
                {STATUS_FILTERS.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto p-2">
              {isCasesPending ? (
                <CaseListSkeleton />
              ) : isCasesError ? (
                <QueueError onRetry={refetchCases} />
              ) : filteredSupportCases.length === 0 ? (
                <EmptyQueue />
              ) : (
                <div className="space-y-2">
                  {filteredSupportCases.map((supportCase) => (
                    <SupportCaseListItem
                      key={supportCase.id}
                      supportCase={supportCase}
                      currentUserId={currentUser?.id}
                      isSelected={
                        Number(selectedSupportCaseId) === Number(supportCase.id)
                      }
                      onSelect={() => handleSelectSupportCase(supportCase.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* Right: Selected conversation */}
          <main className="min-h-0 min-w-0 overflow-hidden">
            {!selectedSupportCaseId ? (
              <NoSelectedCase />
            ) : isDetailPending && !supportCaseDetail ? (
              <ConversationSkeleton />
            ) : isDetailError ? (
              <ConversationError error={detailError} onRetry={refetchDetail} />
            ) : supportCaseDetail ? (
              <div className="flex h-full min-h-0 flex-col gap-3">
                <AdminOrderPreview
                  order={orderPreview}
                  fallbackOrderNumber={
                    supportCaseDetail.order?.orderNumber ||
                    `Order #${supportCaseDetail.orderId}`
                  }
                  supportCaseId={supportCaseDetail.id}
                  issueType={supportCaseDetail.issueType}
                  isPending={isOrderPending}
                  isError={isOrderError}
                  hasFullDetails={Boolean(adminOrder)}
                  onRetry={refetchOrder}
                  onViewDetails={() => setIsOrderDetailOpen(true)}
                />

                <SupportCaseStatusControl supportCase={supportCaseDetail} />

                <SupportChatPanel
                  key={supportCaseDetail.id}
                  supportCase={supportCaseDetail}
                  isAdmin
                  fillAvailableHeight
                  showOrderContext={false}
                />
              </div>
            ) : (
              <NoSelectedCase />
            )}
          </main>
        </div>
      </div>

      <AdminOrderDetailsModal
        isOpen={isOrderDetailOpen}
        order={adminOrder}
        onClose={handleCloseOrderDetails}
      />
    </section>
  );
}

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

  const openedByName =
    [supportCase.openedBy?.firstName, supportCase.openedBy?.lastName]
      .filter(Boolean)
      .join(" ") || "Unknown user";

  const openedByRole = getSupportCaseOpenerRole(supportCase);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className={`w-full cursor-pointer rounded-xl border p-4 text-left transition ${
        isSelected
          ? "border-orange-300 bg-orange-50 shadow-sm"
          : hasUnread
            ? "border-orange-200 bg-white hover:bg-orange-50/50"
            : "border-transparent bg-white hover:border-neutral-200 hover:bg-neutral-50"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {hasUnread && (
              <span className="relative flex size-2.5 shrink-0">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-orange-400 opacity-60" />
                <span className="relative inline-flex size-2.5 rounded-full bg-orange-500" />
              </span>
            )}

            <p className="truncate text-sm font-bold text-neutral-900">
              {supportCase.order?.orderNumber ||
                `Order #${supportCase.orderId}`}
            </p>
          </div>

          <p className="mt-1 truncate text-xs text-neutral-500">
            Case #{supportCase.id}
          </p>
        </div>

        <ChevronRight
          size={18}
          className={
            isSelected
              ? "shrink-0 text-orange-500"
              : "shrink-0 text-neutral-300"
          }
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-600">
          <UserRound size={12} />
          {openedByRole}
        </span>

        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusMeta.className}`}
        >
          {statusMeta.label}
        </span>

        {hasUnread && (
          <span className="rounded-full bg-orange-500 px-2.5 py-1 text-[11px] font-bold text-white">
            New
          </span>
        )}
      </div>

      <p className="mt-3 truncate text-sm font-semibold text-neutral-700">
        {openedByName}
      </p>

      <p className="mt-1 line-clamp-2 text-xs leading-5 text-neutral-500">
        {latestMessage?.content || formatEnumLabel(supportCase.issueType)}
      </p>

      <time className="mt-3 block text-[11px] text-neutral-400">
        {formatCaseDate(latestMessage?.createdAt || supportCase.updatedAt)}
      </time>
    </button>
  );
}

function SupportCaseStatusControl({ supportCase }) {
  const [status, setStatus] = useState(supportCase.status);

  const [resolutionNote, setResolutionNote] = useState(
    supportCase.resolutionNote || "",
  );

  const updateStatusMutation = useUpdateSupportCaseStatus();

  useEffect(() => {
    setStatus(supportCase.status);
    setResolutionNote(supportCase.resolutionNote || "");
  }, [supportCase.id, supportCase.status, supportCase.resolutionNote]);

  const normalizedNote = resolutionNote.trim();

  const hasChanges =
    status !== supportCase.status ||
    normalizedNote !== (supportCase.resolutionNote || "").trim();

  function handleSubmit(event) {
    event.preventDefault();

    if (!hasChanges || updateStatusMutation.isPending) {
      return;
    }

    updateStatusMutation.mutate({
      supportCaseId: supportCase.id,
      payload: {
        status,
        ...(normalizedNote ? { resolutionNote: normalizedNote } : {}),
      },
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="shrink-0 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm"
    >
      <div className="grid gap-3 lg:grid-cols-[220px_minmax(0,1fr)_120px]">
        <div>
          <label
            htmlFor="support-case-status"
            className="text-xs font-bold uppercase tracking-wider text-neutral-400"
          >
            Case status
          </label>

          <select
            id="support-case-status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            disabled={updateStatusMutation.isPending}
            className="mt-2 h-11 w-full cursor-pointer rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="resolution-note"
            className="text-xs font-bold uppercase tracking-wider text-neutral-400"
          >
            Resolution note
          </label>

          <input
            id="resolution-note"
            type="text"
            value={resolutionNote}
            onChange={(event) => setResolutionNote(event.target.value)}
            maxLength={2000}
            disabled={updateStatusMutation.isPending}
            placeholder="Optional note about the resolution..."
            className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={!hasChanges || updateStatusMutation.isPending}
            className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-neutral-900 px-4 text-sm font-bold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {updateStatusMutation.isPending ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              "Update"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

function QueueError({ onRetry }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center p-6 text-center">
      <AlertCircle size={34} className="text-red-500" />

      <p className="mt-3 text-sm font-bold text-neutral-800">
        Unable to load support cases
      </p>

      <button
        type="button"
        onClick={() => onRetry()}
        className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600"
      >
        <RefreshCw size={14} />
        Try Again
      </button>
    </div>
  );
}

function EmptyQueue() {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center p-6 text-center">
      <Inbox size={38} className="text-neutral-300" />

      <p className="mt-3 font-bold text-neutral-700">No support cases found</p>

      <p className="mt-1 text-xs text-neutral-400">
        New Buyer and Seller cases will appear here.
      </p>
    </div>
  );
}

function NoSelectedCase() {
  return (
    <div className="flex h-full min-h-0 flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-orange-50 text-orange-500">
        <MessageSquareText size={30} />
      </span>

      <h2 className="mt-4 text-lg font-bold text-neutral-900">
        Select a support case
      </h2>

      <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-500">
        Choose the order you want to handle. Its details and conversation will
        open here.
      </p>
    </div>
  );
}

function ConversationError({ error, onRetry }) {
  return (
    <div className="flex h-full min-h-0 flex-col items-center justify-center rounded-2xl border border-red-100 bg-white p-8 text-center">
      <AlertCircle size={38} className="text-red-500" />

      <p className="mt-4 font-bold text-neutral-900">
        Unable to open conversation
      </p>

      <p className="mt-2 text-sm text-neutral-500">
        {error?.response?.data?.message || error?.message}
      </p>

      <button
        type="button"
        onClick={() => onRetry()}
        className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white"
      >
        <RefreshCw size={16} />
        Try Again
      </button>
    </div>
  );
}

function CaseListSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((item) => (
        <div
          key={item}
          className="h-36 animate-pulse rounded-xl bg-neutral-100"
        />
      ))}
    </div>
  );
}

function ConversationSkeleton() {
  return (
    <div className="h-full min-h-0 animate-pulse rounded-2xl border border-neutral-200 bg-white p-6">
      <div className="h-8 w-48 rounded bg-neutral-100" />
      <div className="mt-5 h-24 rounded-xl bg-neutral-100" />
      <div className="mt-5 h-[460px] rounded-xl bg-neutral-50" />
    </div>
  );
}

function getSupportCaseOpenerRole(supportCase) {
  const openerParticipant = supportCase.conversation?.participants?.find(
    (participant) => participant.userId === supportCase.openedById,
  );

  if (openerParticipant?.roleInChat === "BUYER") {
    return "Buyer";
  }

  if (openerParticipant?.roleInChat === "SELLER") {
    return "Seller";
  }

  if (String(supportCase.order?.buyerId) === String(supportCase.openedById)) {
    return "Buyer";
  }

  if (String(supportCase.order?.sellerId) === String(supportCase.openedById)) {
    return "Seller";
  }

  return "User";
}

function formatEnumLabel(value) {
  if (!value) {
    return "-";
  }

  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatCaseDate(date) {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate);
}

export default AdminChats;
