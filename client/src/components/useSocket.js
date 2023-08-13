// useSocket.js
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

let socket;

export const useSocket = () => {
  if (!socket) {
    socket = io("/");
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
