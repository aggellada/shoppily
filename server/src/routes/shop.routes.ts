import express from "express";
import { getShop, getShopByName } from "../controller/shop.controller";

const router = express.Router();

router.get("/:id", getShop);
router.get("/:shopName/items", getShopByName);

export default router;
