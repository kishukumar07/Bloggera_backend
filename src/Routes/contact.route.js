import { Router, Router } from "express";
import { getAll, sendMsg } from "../controllers/contact.controller.js";

const router = Router();

//saving a  contactMsg to db  ..
router.post("/", sendMsg);

//getting all contactMsg from db ..
router.get("/", getAll); //this is for admin ..
