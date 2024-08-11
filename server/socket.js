import { Server as SocketIOServer } from "socket.io";
import mongoose from "mongoose";
import Message from "./models/MessageModel.js";
import Group from "./models/GroupModel.js";
import Users from './models/UserModel.js'; 

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
            console.log("MongoDB connection state:", mongoose.connection.readyState);
            const newMessage = new Message({
                sender,
                content,
                recipent,
                messageType: messageType || "text",
                fileUrl,
            });

            console.log("Attempting to save message:", newMessage);
            const createdMessage = await newMessage.save();
            console.log("Message saved successfully:", createdMessage);

            const messageData = await Message.findById(createdMessage._id)
                .populate("sender", "id email firstName lastName image color")
                .populate("recipent", "id email firstName lastName image color");

            console.log("Populated message data:", messageData);

            const senderSocketId = userSocketMap.get(sender);
            const recipentSocketId = userSocketMap.get(recipent);

            if (recipentSocketId) {
                io.to(recipentSocketId).emit("receivedMessage", messageData);
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

    const sendGroupMessage = async (message) => {
        const { groupId, sender, content, messageType, fileUrl } = message;
        try {
            const createdMessage = await Message.create({
                sender,
                recipent: null, 
                content,
                messageType: messageType || "text",
                timestamp: new Date(),
                fileUrl,
            });

            const messageData = await Message.findById(createdMessage._id)
                .populate("sender", "id email firstName lastName image color")
                .exec();

            await Group.findByIdAndUpdate(groupId, {
                $push: { messages: createdMessage._id },
            });

            const group = await Group.findById(groupId).populate("members");

            const finalData = { ...messageData._doc, groupId: group._id };

            if (group && group.members) {
                group.members.forEach((member) => {
                    const memberSocketId = userSocketMap.get(member._id.toString());
                    if (memberSocketId) {
                        io.to(memberSocketId).emit('received-group-message', finalData);
                    }
                });

                const adminSocketId = userSocketMap.get(group.admin._id.toString());
                if (adminSocketId) {
                    io.to(adminSocketId).emit('received-group-message', finalData);
                }
            }
        } catch (error) {
            console.error("Error sending group message:", error);
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
        socket.on("send-group-message", sendGroupMessage);

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