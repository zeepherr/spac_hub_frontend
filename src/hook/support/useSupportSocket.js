import { refreshAccessToken } from "@/api/auth/auth.session";
import {
  disconnectSupportSocket,
  getSupportSocket,
} from "@/lib/support.socket";
import useAuthStore from "@/stores/auth.store";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

import { supportKeys } from "./supportKeys";

const ACK_TIMEOUT = 10_000;

function createSocketError(response, fallbackMessage) {
  const error = new Error(response?.message || fallbackMessage);

  error.code = response?.code;

  return error;
}

function emitWithAcknowledgement(socket, eventName, payload) {
  return new Promise((resolve, reject) => {
    socket
      .timeout(ACK_TIMEOUT)
      .emit(eventName, payload, (timeoutError, response) => {
        if (timeoutError) {
          reject(new Error(`${eventName} acknowledgement timed out.`));

          return;
        }

        if (!response?.success) {
          reject(createSocketError(response, `${eventName} failed.`));

          return;
        }

        resolve(response);
      });
  });
}

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

  useEffect(() => {
    if (!accessToken || !hasValidIds) {
      return undefined;
    }

    const socket = getSupportSocket();

    socketRef.current = socket;

    let cancelled = false;
    let refreshingToken = false;

    const messagesQueryKey = isAdmin
      ? supportKeys.adminMessages(parsedSupportCaseId)
      : supportKeys.myMessages(parsedSupportCaseId);

    const detailQueryKey = isAdmin
      ? supportKeys.adminDetail(parsedSupportCaseId)
      : supportKeys.myDetail(parsedSupportCaseId);

    const listQueryKey = isAdmin
      ? supportKeys.adminList()
      : supportKeys.myList();

    const joinConversation = async () => {
      if (cancelled || !socket.connected) {
        return;
      }

      joinedRef.current = false;
      setIsJoined(false);

      try {
        await emitWithAcknowledgement(socket, "conversation:join", {
          conversationId: parsedConversationId,
        });

        if (!cancelled) {
          joinedRef.current = true;
          setIsJoined(true);
          setSocketError(null);
        }
      } catch (error) {
        if (!cancelled) {
          setSocketError(error);
        }
      }
    };

    const handleConnect = () => {
      if (cancelled) {
        return;
      }

      setIsConnected(true);
      setSocketError(null);

      /*
       * Join again after every reconnection.
       */
      void joinConversation();
    };

    const handleDisconnect = () => {
      if (cancelled) {
        return;
      }

      joinedRef.current = false;

      setIsConnected(false);
      setIsJoined(false);
    };

    const handleConnectError = async (error) => {
      if (cancelled) {
        return;
      }

      joinedRef.current = false;

      setIsConnected(false);
      setIsJoined(false);
      setSocketError(error);

      /*
       * Axios interceptor cannot automatically refresh
       * a Socket.IO connection.
       */
      if (error?.data?.code === "SOCKET_TOKEN_EXPIRED" && !refreshingToken) {
        refreshingToken = true;

        try {
          await refreshAccessToken();

          if (!cancelled) {
            socket.connect();
          }
        } catch (refreshError) {
          if (!cancelled) {
            setSocketError(refreshError);
          }
        } finally {
          refreshingToken = false;
        }
      }
    };

    const handleNewMessage = (response) => {
      const message = response?.data;

      if (
        !response?.success ||
        !message ||
        Number(message.conversationId) !== parsedConversationId
      ) {
        return;
      }

      /*
       * Backend broadcasts to the sender too,
       * so optimistic insertion is unnecessary.
       */
      queryClient.setQueryData(messagesQueryKey, (oldData) => {
        if (!oldData?.pages?.length) {
          return oldData;
        }

        const alreadyExists = oldData.pages.some((page) =>
          page.messages.some((item) => item.id === message.id),
        );

        if (alreadyExists) {
          return oldData;
        }

        /*
         * pages[0] contains the newest message page.
         */
        const pages = oldData.pages.map((page, index) => {
          if (index !== 0) {
            return page;
          }

          return {
            ...page,
            messages: [...page.messages, message],
          };
        });

        return {
          ...oldData,
          pages,
        };
      });

      /*
       * Refresh last-message preview, queue order
       * and reopened case status.
       */
      queryClient.invalidateQueries({
        queryKey: listQueryKey,
        exact: true,
      });

      queryClient.invalidateQueries({
        queryKey: detailQueryKey,
        exact: true,
      });
    };

    const handleMessageRead = (response) => {
      const readData = response?.data;

      if (
        !response?.success ||
        !readData ||
        Number(readData.conversationId) !== parsedConversationId
      ) {
        return;
      }

      queryClient.setQueryData(messagesQueryKey, (oldData) => {
        if (!oldData?.pages?.length) {
          return oldData;
        }

        return {
          ...oldData,

          pages: oldData.pages.map((page) => ({
            ...page,

            messages: page.messages.map((message) => {
              const shouldMarkRead =
                message.senderId !== readData.readerId && !message.readAt;

              return shouldMarkRead
                ? {
                    ...message,
                    readAt: readData.readAt,
                  }
                : message;
            }),
          })),
        };
      });
      queryClient.invalidateQueries({
        queryKey: listQueryKey,
        exact: true,
      });

      queryClient.invalidateQueries({
        queryKey: detailQueryKey,
        exact: true,
      });
    };

    socket.on("connect", handleConnect);

    socket.on("disconnect", handleDisconnect);

    socket.on("connect_error", handleConnectError);

    socket.on("message:new", handleNewMessage);

    socket.on("message:read", handleMessageRead);

    if (socket.connected) {
      setIsConnected(true);
      void joinConversation();
    } else {
      socket.connect();
    }

    return () => {
      cancelled = true;
      joinedRef.current = false;

      socket.off("connect", handleConnect);

      socket.off("disconnect", handleDisconnect);

      socket.off("connect_error", handleConnectError);

      socket.off("message:new", handleNewMessage);

      socket.off("message:read", handleMessageRead);

      if (socket.connected) {
        socket.emit("conversation:leave", {
          conversationId: parsedConversationId,
        });
      }

      /*
       * Current MVP has no global notification socket,
       * so disconnect when leaving the chat screen.
       */
      disconnectSupportSocket();

      socketRef.current = null;
    };
  }, [
    accessToken,
    hasValidIds,
    isAdmin,
    parsedConversationId,
    parsedSupportCaseId,
    queryClient,
  ]);

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
