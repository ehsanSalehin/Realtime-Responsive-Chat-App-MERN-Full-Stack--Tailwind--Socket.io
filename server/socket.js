import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessageModel.js";
import mongoose from "mongoose";

const setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  console.log("Socket.IO server is set up and ready to handle connections");

  const userSocketMap = new Map();

  const sendMessage = async (message) => {
    console.log("Received message:", message);
    const { sender, content, recipent, messageType, fileUrl } = message;

    if (!sender || !content || !recipent) {
      console.error("Missing required fields:", { sender, content, recipent });
      return;
    }

    try {
      console.log("MongoDB connection state:", mongoose.connection.readyState); // Should log 1

      const newMessage = new Message({
        sender,
        content,
        recipent,
        messageType: messageType || "text",
        fileUrl,
      });

      console.log("Attempting to save message:", newMessage); // Log the message to be saved
      const createdMessage = await newMessage.save();
      console.log("Message saved successfully:", createdMessage);

      const messageData = await Message.findById(createdMessage._id)
        .populate("sender", "id email firstName lastName image color")
        .populate("recipent", "id email firstName lastName image color");

      console.log("Populated message data:", messageData);

      // Verify the message was saved
      const verifyMessage = await Message.findById(createdMessage._id);
      console.log("Verified saved message:", verifyMessage);

      const senderSocketId = userSocketMap.get(sender);
      const recipentSocketId = userSocketMap.get(recipent);

      if (recipentSocketId) {
        io.to(recipentSocketId).emit("recievedMessage", messageData);
      }
      if (senderSocketId) {
        io.to(senderSocketId).emit("senderMessage", messageData);
      }
    } catch (error) {
      console.error("Error creating message:", error);
      if (error.name === 'ValidationError') {
        for (let field in error.errors) {
          console.error(`Field ${field}: ${error.errors[field].message}`);
        }
      }
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`${userId} connected with ${socket.id}`);
    } else {
      console.log("User ID not provided.");
    }

    socket.on("sendMessage", sendMessage);
    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
      for (const [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(userId);
          break;
        }
      }
    });
  });
};

export default setupSocket;