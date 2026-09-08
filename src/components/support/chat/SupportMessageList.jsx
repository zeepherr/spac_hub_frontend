import {
  Check,
  CheckCheck,
  LoaderCircle,
  MessageSquareText,
  RefreshCw,
} from "lucide-react";

import { formatMessageTime } from "./supportChat.utils";

function SupportMessageList({
  messageContainerRef,
  handleMessageScroll,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  isMessagesPending,
  isMessagesError,
  messagesError,
  refetchMessages,
  messages,
  supportCase,
  currentUserId,
  showNewMessageButton,
  scrollToBottom,
}) {
  return (
    <div className="relative min-h-0 flex-1">
      <div
        ref={messageContainerRef}
        onScroll={handleMessageScroll}
        className="chat-scrollbar h-full overflow-y-auto overscroll-contain bg-white px-4 py-4 sm:px-5"
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
              {messagesError?.response?.data?.message || messagesError?.message}
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
            <p className="mt-4 font-semibold text-neutral-700">No messages yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                supportCase={supportCase}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}
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

function MessageSkeleton() {
  return (
    <div className="space-y-5">
      <div className="h-16 w-2/3 animate-pulse rounded-2xl bg-neutral-100" />
      <div className="ml-auto h-20 w-3/5 animate-pulse rounded-2xl bg-orange-100" />
      <div className="h-14 w-1/2 animate-pulse rounded-2xl bg-neutral-100" />
    </div>
  );
}

export default SupportMessageList;
