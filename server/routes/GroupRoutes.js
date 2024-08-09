import { Router } from "express";
import {verifyToken}from "../middlewares/AuthMiddle.js"
import { createGroup, getUserGroup } from "../controllers/GroupController.js";


const groupRoutes = Router();
groupRoutes.post("/Create-group", verifyToken , createGroup);
groupRoutes.get("/get-user-groups", verifyToken , getUserGroup)
export default groupRoutes;