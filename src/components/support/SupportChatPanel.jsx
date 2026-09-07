import {
  Check,
  CheckCheck,
  LoaderCircle,
  MessageSquareText,
  RefreshCw,
  Send,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { useSupportMessages } from "@/hook/support/useSupportMessage";
import { useSupportSocket } from "@/hook/support/useSupportSocket";
import useAuthStore from "@/stores/auth.store";

import { SUPPORT_STATUS_META } from "./support.constants";

function SupportChatPanel({ supportCase, isAdmin = false, initialDraft = "" }) {
  const currentUser = useAuthStore((state) => state.user);

  const [draft, setDraft] = useState("");

  const [isSending, setIsSending] = useState(false);

  const [showNewMessageButton, setShowNewMessageButton] = useState(false);

  const messageContainerRef = useRef(null);

  const messagesEndRef = useRef(null);

  const isNearBottomRef = useRef(true);

  const initialScrollCompletedRef = useRef(false);

  const appliedInitialDraftRef = useRef(false);

  const supportCaseId = supportCase?.id;

  const conversationId = supportCase?.conversationId;

  const {
    data: messagePages,
    isPending: isMessagesPending,
    isError: isMessagesError,
    error: messagesError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch: refetchMessages,
  } = useSupportMessages({
    supportCaseId,
    isAdmin,
    limit: 50,
  });

  const { isConnected, isJoined, socketError, sendMessage, markAsRead } =
    useSupportSocket({
      supportCaseId,
      conversationId,
      isAdmin,
    });

  /*
   * Backend returns the newest page first.
   * Reverse pages, but keep messages inside
   * each page in their existing order.
   */
  const messages = useMemo(() => {
    return (
      messagePages?.pages
        ?.slice()
        .reverse()
        .flatMap((page) => page.messages) ?? []
    );
  }, [messagePages]);

  const lastMessage = messages[messages.length - 1];

  const hasUnreadIncomingMessages = useMemo(() => {
    if (!currentUser?.id) {
      return false;
    }

    return messages.some(
      (message) => message.senderId !== currentUser.id && !message.readAt,
    );
  }, [messages, currentUser?.id]);

  /*
   * Used when POST /support-cases returned
   * an existing case and did not save the
   * newly submitted message.
   */
  useEffect(() => {
    if (!initialDraft || appliedInitialDraftRef.current) {
      return;
    }

    appliedInitialDraftRef.current = true;
    setDraft(initialDraft);
  }, [initialDraft]);

  /*
   * After initial connection and every reconnect,
   * reload REST history to recover missed messages.
   */
  useEffect(() => {
    if (!isJoined) {
      return;
    }

    void refetchMessages();
  }, [isJoined, refetchMessages]);

  function scrollToBottom(behavior = "smooth") {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    messagesEndRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : behavior,
      block: "end",
    });

    isNearBottomRef.current = true;
    setShowNewMessageButton(false);
  }

  /*
   * Scroll automatically when:
   * - message history first loads
   * - current user sends a message
   * - user is already near the bottom
   *
   * Do not pull the user downward while
   * they are reading older messages.
   */
  useEffect(() => {
    if (!lastMessage) {
      return;
    }

    const isOwnMessage = lastMessage.senderId === currentUser?.id;

    if (
      !initialScrollCompletedRef.current ||
      isOwnMessage ||
      isNearBottomRef.current
    ) {
      requestAnimationFrame(() => {
        scrollToBottom(initialScrollCompletedRef.current ? "smooth" : "auto");
      });

      initialScrollCompletedRef.current = true;

      return;
    }

    setShowNewMessageButton(true);
  }, [lastMessage?.id, currentUser?.id]);

  /*
   * Mark messages as read only while
   * the browser tab is visible.
   */
  useEffect(() => {
    async function readVisibleMessages() {
      if (
        !isJoined ||
        !hasUnreadIncomingMessages ||
        document.visibilityState !== "visible"
      ) {
        return;
      }

      try {
        await markAsRead();
      } catch {
        /*
         * A temporary read-receipt failure should not
         * interrupt the conversation UI.
         */
      }
    }

    void readVisibleMessages();

    document.addEventListener("visibilitychange", readVisibleMessages);

    return () => {
      document.removeEventListener("visibilitychange", readVisibleMessages);
    };
  }, [isJoined, hasUnreadIncomingMessages, markAsRead]);

  function handleMessageScroll() {
    const container = messageContainerRef.current;

    if (!container) {
      return;
    }

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    const isNearBottom = distanceFromBottom < 120;

    isNearBottomRef.current = isNearBottom;

    if (isNearBottom) {
      setShowNewMessageButton(false);
    }
  }

  async function handleSendMessage(event) {
    event.preventDefault();

    const content = draft.trim();

    if (!content || !isJoined || isSending) {
      return;
    }

    setIsSending(true);

    try {
      await sendMessage({
        content,
      });

      setDraft("");

      requestAnimationFrame(() => {
        scrollToBottom("smooth");
      });
    } catch (error) {
      toast.error(error.message || "Unable to send message.");
    } finally {
      setIsSending(false);
    }
  }

  function handleComposerKeyDown(event) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  const statusMeta = SUPPORT_STATUS_META[supportCase?.status] ?? {
    label: supportCase?.status || "Unknown",
    className: "bg-neutral-100 text-neutral-600",
  };

  const openedBy = supportCase?.openedBy;

  const openerName = [openedBy?.firstName, openedBy?.lastName]
    .filter(Boolean)
    .join(" ");

  const openerParticipant = supportCase?.conversation?.participants?.find(
    (participant) => participant.userId === supportCase.openedById,
  );

  const recipientLabel = isAdmin
    ? openerName || openerParticipant?.roleInChat || "Customer"
    : "SpecHub Admin";

  const recipientRole = isAdmin ? openerParticipant?.roleInChat : "ADMIN";

  const normalizedDraft = draft.trim();

  const canSend =
    isJoined &&
    normalizedDraft.length > 0 &&
    normalizedDraft.length <= 2000 &&
    !isSending;

  if (!supportCase) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      {/* Header */}
      <header className="border-b border-neutral-200 px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
              <MessageSquareText size={21} />
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

        {/* Order context */}
        <div className="mt-4 grid gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4 sm:grid-cols-3">
          <ContextItem label="Support Case" value={`#${supportCase.id}`} />

          <ContextItem
            label="Order"
            value={supportCase.order?.orderNumber || `#${supportCase.orderId}`}
          />

          <ContextItem
            label="Issue"
            value={formatEnumLabel(supportCase.issueType)}
          />
        </div>
      </header>

      {/* Socket error */}
      {socketError && (
        <div className="flex items-start gap-3 border-b border-red-100 bg-red-50 px-5 py-3 text-sm text-red-700 sm:px-6">
          <WifiOff size={18} className="mt-0.5 shrink-0" />

          <div>
            <p className="font-semibold">Chat connection problem</p>

            <p className="mt-0.5 text-xs text-red-600">{socketError.message}</p>
          </div>
        </div>
      )}

      {/* Message history */}
      <div className="relative">
        <div
          ref={messageContainerRef}
          onScroll={handleMessageScroll}
          className="scrollbar-hide h-[460px] overflow-y-auto bg-white px-4 py-5 sm:px-6"
          aria-live="polite"
        >
          {hasNextPage && (
            <div className="mb-5 flex justify-center">
              <button
                type="button"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-600 transition hover:border-orange-200 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isFetchingNextPage ? (
                  <LoaderCircle size={15} className="animate-spin" />
                ) : (
                  <RefreshCw size={15} />
                )}
                Load older messages
              </button>
            </div>
          )}

          {isMessagesPending ? (
            <MessageSkeleton />
          ) : isMessagesError ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-sm font-semibold text-red-500">
                Unable to load messages
              </p>

              <p className="mt-1 text-xs text-neutral-400">
                {messagesError?.response?.data?.message ||
                  messagesError?.message}
              </p>

              <button
                type="button"
                onClick={() => refetchMessages()}
                className="mt-4 cursor-pointer rounded-lg border border-orange-500 px-4 py-2 text-sm font-semibold text-orange-500 transition hover:bg-orange-50"
              >
                Try Again
              </button>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
                <MessageSquareText size={26} />
              </span>

              <p className="mt-4 font-semibold text-neutral-700">
                No messages yet
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  supportCase={supportCase}
                  currentUserId={currentUser?.id}
                />
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {showNewMessageButton && (
          <button
            type="button"
            onClick={() => scrollToBottom("smooth")}
            className="animate-in fade-in slide-in-from-bottom-2 absolute bottom-4 left-1/2 -translate-x-1/2 cursor-pointer rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold text-white shadow-lg duration-200 hover:bg-neutral-800"
          >
            New message
          </button>
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={handleSendMessage}
        className="border-t border-neutral-200 bg-neutral-50 p-4 sm:p-5"
      >
        <div className="rounded-xl border border-neutral-200 bg-white p-2 shadow-sm transition focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleComposerKeyDown}
            maxLength={2000}
            rows={3}
            disabled={!isJoined || isSending}
            placeholder={
              isJoined ? "Write a message..." : "Connecting to support..."
            }
            className="w-full resize-none bg-transparent px-2 py-2 text-sm leading-6 text-neutral-800 outline-none placeholder:text-neutral-400 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <div className="flex items-center justify-between gap-3 px-1 pb-1">
            <div>
              {draft.length > 0 && (
                <span className="text-xs text-neutral-400">
                  {draft.length}/2000
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={!canSend}
              className="inline-flex min-w-24 cursor-pointer items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSending ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <Send size={17} />
              )}

              {isSending ? "Sending" : "Send"}
            </button>
          </div>
        </div>

        <p className="mt-2 text-center text-xs text-neutral-400">
          Enter to send · Shift + Enter for a new line
        </p>
      </form>
    </section>
  );
}

function MessageBubble({ message, supportCase, currentUserId }) {
  const isMine = message.senderId === currentUserId;

  const participant = supportCase.conversation?.participants?.find(
    (item) => item.userId === message.senderId,
  );

  const senderRole = participant?.roleInChat;

  const senderLabel = isMine
    ? "You"
    : senderRole === "ADMIN" || message.sender?.role === "ADMIN"
      ? "SpecHub Admin"
      : senderRole === "SELLER"
        ? "Seller"
        : "Buyer";

  return (
    <article
      className={`animate-in fade-in slide-in-from-bottom-2 flex duration-200 ${
        isMine ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[85%] sm:max-w-[72%] ${
          isMine ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`mb-1 flex items-center gap-2 text-xs ${
            isMine ? "justify-end" : "justify-start"
          }`}
        >
          <span className="font-semibold text-neutral-600">{senderLabel}</span>

          <time className="text-neutral-400">
            {formatMessageTime(message.createdAt)}
          </time>
        </div>

        <div
          className={`whitespace-pre-wrap wrap-break-word rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
            isMine
              ? "rounded-br-md bg-orange-500 text-white"
              : "rounded-bl-md border border-neutral-200 bg-neutral-100 text-neutral-800"
          }`}
        >
          {message.content}
        </div>

        {isMine && (
          <div className="mt-1 flex justify-end">
            {message.readAt ? (
              <span className="inline-flex items-center gap-1 text-[11px] text-orange-600">
                <CheckCheck size={14} />
                Read
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] text-neutral-400">
                <Check size={14} />
                Sent
              </span>
            )}
          </div>
        )}
      </div>
    </article>
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

function MessageSkeleton() {
  return (
    <div className="space-y-5">
      <div className="h-16 w-2/3 animate-pulse rounded-2xl bg-neutral-100" />
      <div className="ml-auto h-20 w-3/5 animate-pulse rounded-2xl bg-orange-100" />
      <div className="h-14 w-1/2 animate-pulse rounded-2xl bg-neutral-100" />
    </div>
  );
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

function formatMessageTime(date) {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate);
}

export default SupportChatPanel;
