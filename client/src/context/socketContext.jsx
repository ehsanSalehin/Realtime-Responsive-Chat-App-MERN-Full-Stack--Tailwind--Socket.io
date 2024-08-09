// socketContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { useAppStore } from "@/store";
import { HOST } from "@/Utils/constants";
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({children}) => {
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
                setSocket(newSocket);
            });

            const handleReceivedMessage = (message) => {
                const { selectedChatData, selectedChatType, addMessage } = useAppStore.getState();
                if (selectedChatType && (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipent._id)) {
                    addMessage(message);
                }
            };

            newSocket.on("recievedMessage", handleReceivedMessage);

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
