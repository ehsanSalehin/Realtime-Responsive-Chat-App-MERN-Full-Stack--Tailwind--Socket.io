import {Router} from "express"
import { getAllContacts, getContactsForDirectMessageList, searchContacts } from "../controllers/ContactsController.js";
import {verifyToken} from "../middlewares/AuthMiddle.js"

const contactsRoutes = Router();

contactsRoutes.get("/get-contacts-for-directmessages", verifyToken, getContactsForDirectMessageList);
contactsRoutes.post("/search", verifyToken, searchContacts);
contactsRoutes.get("/get-all-contacts", verifyToken, getAllContacts);
export default contactsRoutes;