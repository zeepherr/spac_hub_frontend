import useSupportChatPanel from "@/hook/support/useSupportChatPanel";

import SupportChatHeader from "./chat/SupportChatHeader";
import SupportMessageComposer from "./chat/SupportMessageComposer";
import SupportMessageList from "./chat/SupportMessageList";
import { SUPPORT_STATUS_META } from "./support.constants";

// เดียวกับ GLASS_PANEL ที่ใช้ทั้งเว็บ
const GLASS_PANEL =
  "border border-neutral-200/70 bg-white/50 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)]";

function SupportChatPanel({
  supportCase,
  isAdmin = false,
  initialDraft = "",
  fillAvailableHeight = false,
  showOrderContext = true,
}) {
  const {
    canSend,
    composerRef,
    currentUserId,
    draft,
    fetchNextPage,
    handleComposerKeyDown,
    handleMessageScroll,
    handleSendMessage,
    hasNextPage,
    isConnected,
    isFetchingNextPage,
    isJoined,
    isMessagesError,
    isMessagesPending,
    isSending,
    messageContainerRef,
    messages,
    messagesError,
    refetchMessages,
    scrollToBottom,
    setDraft,
    showNewMessageButton,
    socketError,
  } = useSupportChatPanel({ supportCase, isAdmin, initialDraft });

  const statusMeta = SUPPORT_STATUS_META[supportCase?.status] ?? {
    label: supportCase?.status || "Unknown",
    className: "bg-neutral-100 text-neutral-600",
  };
  const participantUser = supportCase?.participantUser;

  const participantName = [
    participantUser?.firstName,
    participantUser?.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const recipientLabel = isAdmin
    ? participantName || "Customer"
    : "SpecHub Admin";

  const recipientRole = isAdmin
    ? supportCase?.participantRole || "USER"
    : "ADMIN";

  if (!supportCase) {
    return null;
  }

  return (
    <section
      className={`flex min-h-0 flex-col overflow-hidden rounded-xl sm:rounded-2xl ${GLASS_PANEL} ${
        fillAvailableHeight ? "h-full" : "h-[min(680px,70dvh)] min-h-[420px]"
      }`}
    >
      <SupportChatHeader
        supportCase={supportCase}
        recipientLabel={recipientLabel}
        recipientRole={recipientRole}
        statusMeta={statusMeta}
        isConnected={isConnected}
        isJoined={isJoined}
        showOrderContext={showOrderContext}
        socketError={socketError}
      />

      <SupportMessageList
        messageContainerRef={messageContainerRef}
        handleMessageScroll={handleMessageScroll}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isMessagesPending={isMessagesPending}
        isMessagesError={isMessagesError}
        messagesError={messagesError}
        refetchMessages={refetchMessages}
        messages={messages}
        supportCase={supportCase}
        currentUserId={currentUserId}
        showNewMessageButton={showNewMessageButton}
        scrollToBottom={scrollToBottom}
      />

      <SupportMessageComposer
        handleSendMessage={handleSendMessage}
        composerRef={composerRef}
        draft={draft}
        setDraft={setDraft}
        handleComposerKeyDown={handleComposerKeyDown}
        isJoined={isJoined}
        isSending={isSending}
        canSend={canSend}
      />
    </section>
  );
}

export default SupportChatPanel;
