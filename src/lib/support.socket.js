import { io } from "socket.io-client";

import useAuthStore from "@/stores/auth.store";

let supportSocket = null;

export function getSupportSocket() {
  if (supportSocket) {
    return supportSocket;
  }

  const socketUrl = import.meta.env.VITE_SOCKET_URL;

  if (!socketUrl) {
    throw new Error(
      "VITE_SOCKET_URL is missing from the frontend environment.",
    );
  }

  supportSocket = io(socketUrl, {
    autoConnect: false,
    withCredentials: true,

    // The newest access token is supplied on every connection/reconnection.
    auth: (callback) => {
      const accessToken = useAuthStore.getState().accessToken;

      callback(accessToken ? { token: accessToken } : {});
    },
  });

  return supportSocket;
}

export function connectSupportSocket() {
  const accessToken = useAuthStore.getState().accessToken;

  // Guest users must not connect to the protected chat socket.
  if (!accessToken) {
    return null;
  }

  const socket = getSupportSocket();

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
}

export function disconnectSupportSocket() {
  if (!supportSocket) {
    return;
  }

  supportSocket.disconnect();
}
