import { useEffect } from "react";

import { refreshAccessToken } from "@/api/auth/auth.session";
import {
  disconnectSupportSocket,
  getSupportSocket,
} from "@/lib/support.socket";
import { supportKeys } from "../supportKeys";
import {
  updateMessagesWithNewMessage,
  updateMessagesWithReadReceipt,
} from "./supportSocketCache.utils";
import { emitWithAcknowledgement } from "./supportSocket.utils";

function useSupportSocketLifecycle({
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
}) {
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
      console.log("[Socket] message:new received:", response);
      console.log("[Socket] expected conversation:", parsedConversationId);
      console.log(
        "[Socket] received conversation:",
        response?.data?.conversationId,
      );
      const message = response?.data;
      if (
        !response?.success ||
        !message ||
        Number(message.conversationId) !== parsedConversationId
      ) {
        return;
      }
      queryClient.setQueryData(messagesQueryKey, (oldData) =>
        updateMessagesWithNewMessage(oldData, message),
      );
      void queryClient.invalidateQueries({
        queryKey: messagesQueryKey,
        exact: true,
        refetchType: "active",
      });
      void queryClient.invalidateQueries({ queryKey: listQueryKey, exact: true });
      void queryClient.invalidateQueries({ queryKey: detailQueryKey, exact: true });
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
      queryClient.setQueryData(messagesQueryKey, (oldData) =>
        updateMessagesWithReadReceipt(oldData, readData),
      );
      void queryClient.invalidateQueries({ queryKey: listQueryKey, exact: true });
      void queryClient.invalidateQueries({ queryKey: detailQueryKey, exact: true });
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
      if (!isAdmin) {
        disconnectSupportSocket();
      }
      socketRef.current = null;
    };
  }, [
    accessToken,
    hasValidIds,
    isAdmin,
    parsedConversationId,
    parsedSupportCaseId,
    queryClient,
    joinedRef,
    socketRef,
    setIsConnected,
    setIsJoined,
    setSocketError,
  ]);
}

export default useSupportSocketLifecycle;
