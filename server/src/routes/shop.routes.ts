import express from "express";
import { getShop, getShopByName } from "../controller/shop.controller.js";

const router = express.Router();

router.get("/:id", getShop);
router.get("/:shopName/items", getShopByName);

export default router;
