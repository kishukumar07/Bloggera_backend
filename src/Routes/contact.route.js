import { Router } from "express";
import { getAll, sendMsg } from "../controllers/contact.controller.js";

import { authorize } from "../middlewares/authorization.js";
import { auth } from "../middlewares/auth.js";


const router = Router();

//saving a  contactMsg to db  ..
router.post("/",auth, authorize(['user','admin']),sendMsg);

//getting all contactMsg from db ..
router.get("/",auth,authorize(['admin']), getAll); //this is for admin ..


export default router;
