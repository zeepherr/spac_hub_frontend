import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";

import useAuthStore from "@/stores/auth.store";
import { emitWithAcknowledgement } from "./socket/supportSocket.utils";
import useSupportSocketLifecycle from "./socket/useSupportSocketLifecycle";

export const useSupportSocket = ({
  supportCaseId,
  conversationId,
  isAdmin = false,
}) => {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const socketRef = useRef(null);
  const joinedRef = useRef(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [socketError, setSocketError] = useState(null);
  const parsedSupportCaseId = Number(supportCaseId);
  const parsedConversationId = Number(conversationId);
  const hasValidIds =
    Number.isInteger(parsedSupportCaseId) &&
    parsedSupportCaseId > 0 &&
    Number.isInteger(parsedConversationId) &&
    parsedConversationId > 0;

  useSupportSocketLifecycle({
    accessToken,
    hasValidIds,
    isAdmin,
    parsedConversationId,
    parsedSupportCaseId,
    queryClient,
    socketRef,
    joinedRef,
    setIsConnected,
    setIsJoined,
    setSocketError,
  });

  const sendMessage = useCallback(
    async ({ content, clientMessageId }) => {
      const socket = socketRef.current;
      if (!socket?.connected) {
        throw new Error("Chat is not connected.");
      }
      if (!joinedRef.current) {
        throw new Error("Conversation has not been joined.");
      }
      const normalizedContent = content?.trim();
      if (!normalizedContent) {
        throw new Error("Message is required.");
      }
      if (normalizedContent.length > 2000) {
        throw new Error("Message must not exceed 2000 characters.");
      }
      const resolvedClientMessageId = clientMessageId || crypto.randomUUID();
      return emitWithAcknowledgement(socket, "message:send", {
        conversationId: parsedConversationId,
        clientMessageId: resolvedClientMessageId,
        content: normalizedContent,
      });
    },
    [parsedConversationId],
  );

  const markAsRead = useCallback(async () => {
    const socket = socketRef.current;
    if (!socket?.connected || !joinedRef.current) {
      return null;
    }
    return emitWithAcknowledgement(socket, "message:read", {
      conversationId: parsedConversationId,
    });
  }, [parsedConversationId]);

  return {
    isConnected,
    isJoined,
    socketError,
    sendMessage,
    markAsRead,
  };
};
