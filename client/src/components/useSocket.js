// useSocket.js
import { useEffect } from "react";
import { io } from "socket.io-client";
let socket;
export const useSocket = () => {
  if (!socket) {
    socket = io(process.env.REACT_APP_API_URL || "http://localhost:5000");
  }
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, []);
  return socket;
};
