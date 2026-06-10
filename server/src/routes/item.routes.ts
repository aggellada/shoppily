import express from "express";
import { getAllItems, getItem, searchItems } from "../controller/item.controller.js";


const router = express.Router();

router.get("/get/items", getAllItems);
router.get("/search", searchItems);
router.get("/get/item", getItem);

export default router;
