import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { useSupportMessages } from "./useSupportMessage";
import { useSupportSocket } from "./useSupportSocket";
import useAuthStore from "@/stores/auth.store";

function useSupportChatPanel({ supportCase, isAdmin, initialDraft }) {
  const currentUserId = useAuthStore((state) => state.user?.id);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showNewMessageButton, setShowNewMessageButton] = useState(false);
  const messageContainerRef = useRef(null);
  const composerRef = useRef(null);
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
  } = useSupportMessages({ supportCaseId, isAdmin, limit: 50 });

  const { isConnected, isJoined, socketError, sendMessage, markAsRead } =
    useSupportSocket({ supportCaseId, conversationId, isAdmin });

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
    if (!currentUserId) {
      return false;
    }
    return messages.some(
      (message) => message.senderId !== currentUserId && !message.readAt,
    );
  }, [messages, currentUserId]);
  const lastMessageId = lastMessage?.id;
  const lastMessageSenderId = lastMessage?.senderId;

  useEffect(() => {
    if (!initialDraft || appliedInitialDraftRef.current) {
      return;
    }
    appliedInitialDraftRef.current = true;
    setDraft(initialDraft);
  }, [initialDraft]);

  useEffect(() => {
    const composer = composerRef.current;
    if (!composer) {
      return;
    }
    const maximumHeight = 112;
    composer.style.height = "auto";
    composer.style.height = `${Math.min(composer.scrollHeight, maximumHeight)}px`;
    composer.style.overflowY =
      composer.scrollHeight > maximumHeight ? "auto" : "hidden";
  }, [draft]);

  useEffect(() => {
    if (!isJoined) {
      return;
    }
    void refetchMessages();
  }, [isJoined, refetchMessages]);

  function scrollToBottom(behavior = "smooth") {
    const container = messageContainerRef.current;
    if (!container) {
      return;
    }
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: prefersReducedMotion ? "auto" : behavior,
    });
    isNearBottomRef.current = true;
    setShowNewMessageButton(false);
  }

  useEffect(() => {
    if (!lastMessageId) {
      return;
    }
    const isOwnMessage = lastMessageSenderId === currentUserId;
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
  }, [lastMessageId, lastMessageSenderId, currentUserId]);

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
        // A temporary read-receipt failure should not interrupt the UI.
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
      await sendMessage({ content });
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

  const normalizedDraft = draft.trim();
  const canSend =
    isJoined &&
    normalizedDraft.length > 0 &&
    normalizedDraft.length <= 2000 &&
    !isSending;

  return {
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
  };
}

export default useSupportChatPanel;
