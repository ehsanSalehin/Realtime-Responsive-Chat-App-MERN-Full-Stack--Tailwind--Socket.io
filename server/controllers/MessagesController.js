import Message from "../models/MessageModel.js";
import Group from "../models/GroupModel.js";
import { mkdirSync, renameSync } from "fs";

// Saving messages
export const getMessages = async (req, res, next) => {
  try {
    const user1 = req.userId;
    const user2 = req.body.id;
    if (!user1 || !user2) {
      return res.status(400).send("Users Required!");
    }
    const messages = await Message.find({
      $or: [
        { sender: user1, recipent: user2 },
        { sender: user2, recipent: user1 },
      ],
    }).sort({ timestamp: 1 });
    return res.status(200).json({ messages });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send("SELECT YOUR FILE");
    }

    const date = Date.now();
    let fileDir = `uploads/files/${date}`;
    let fileName = `${fileDir}/${req.file.originalname}`;
    mkdirSync(fileDir, { recursive: true });
    renameSync(req.file.path, fileName);

    // Create a new message with the file information
    const newMessage = new Message({
      sender: req.userId,
      recipent: req.body.recipentId, 
      messageType: "file",
      fileUrl: fileName,
      timestamp: new Date(),
    });

    await newMessage.save(); // Save the message to MongoDB

    return res.status(200).json({ filePath: fileName });
  } catch (err) {
    console.error("Error in uploadFile:", err);
    return res.status(500).send("Internal Server Error");
  }
};
