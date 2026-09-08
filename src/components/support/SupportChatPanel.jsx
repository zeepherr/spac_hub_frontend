import useSupportChatPanel from "@/hook/support/useSupportChatPanel";

import SupportChatHeader from "./chat/SupportChatHeader";
import SupportMessageComposer from "./chat/SupportMessageComposer";
import SupportMessageList from "./chat/SupportMessageList";
import { SUPPORT_STATUS_META } from "./support.constants";

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

  if (!supportCase) {
    return null;
  }

  return (
    <section
      className={`flex min-h-0 flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm ${
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
