import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (userId) => {
  if (socket) return socket; 

  const SOCKET_URL = import.meta.env.VITE_BACKEND_URL;

  socket = io(SOCKET_URL, {
    query: { userId },
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket error:", err.message);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (!socket) return;

  socket.disconnect();
  socket = null;
};