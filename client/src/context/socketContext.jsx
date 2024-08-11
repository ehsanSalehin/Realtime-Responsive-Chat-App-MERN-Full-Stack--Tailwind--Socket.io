import { createContext, useContext, useEffect, useState } from "react";
import { useAppStore } from "@/store";
import { HOST } from "@/Utils/constants";
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { userInfo } = useAppStore();

  useEffect(() => {
    if (userInfo && userInfo.id) {
      const newSocket = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
        transports: ['websocket', 'polling']
      });

      newSocket.on("connect", () => {
        console.log("Connected to WebSocket");
        setSocket(newSocket);
      });

      newSocket.on("connect_error", (err) => {
        console.error("WebSocket Connection Error:", err);
      });

      newSocket.on("disconnect", (reason) => {
        console.log("WebSocket Disconnected:", reason);
      });

      const handleReceivedMessage = (message) => {
        const { selectedChatData, selectedChatType, addMessage } = useAppStore.getState();
        if (selectedChatType === "contact" && (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipent._id)) {
          addMessage(message);
        }
      };

      const handleReceivedGroupMessage = (message) => {
        const { selectedChatData, selectedChatType, addMessage } = useAppStore.getState();
        if (selectedChatType === "group" && selectedChatData._id === message.groupId) {
          addMessage(message);
        }
      };

      newSocket.on("receivedMessage", handleReceivedMessage);
      newSocket.on("received-group-message", handleReceivedGroupMessage);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};