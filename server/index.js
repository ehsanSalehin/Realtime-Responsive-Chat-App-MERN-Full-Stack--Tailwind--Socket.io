import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactsRoutes.js";
import setupSocket from "./socket.js";
import messagesRoutes from "./routes/MessageRoutes.js";
import groupRoutes from "./routes/GroupRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4444;
const databaseURL = process.env.DATABASE_URL;

app.use(cors({
  origin: [process.env.ORIGIN],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
}));

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/group", groupRoutes);

const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  setupSocket(server); 
});

mongoose.connect(databaseURL)
  .then(() => {
    console.log("DATABASE CONNECTION SUCCESSFUL");
  })
  .catch((error) => {
    console.error("DATABASE CONNECTION ERROR:", error);
  });