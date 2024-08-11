import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddle.js";
import { createGroup, getGroupMessages, getUserGroup } from "../controllers/GroupController.js";

const groupRoutes = Router();
groupRoutes.post("/create-group", verifyToken, createGroup);
groupRoutes.get("/get-user-groups", verifyToken, getUserGroup);
groupRoutes.get("/get-message-groups/:groupId", verifyToken, getGroupMessages);

export default groupRoutes;
