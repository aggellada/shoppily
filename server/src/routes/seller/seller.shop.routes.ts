import express from "express";
import { addItem, deleteItem, getShop, updateItem } from "../../controller/seller/seller.shop.conroller";
import { isSeller, protectRoute } from "../../middleware/auth.middleware";

const router = express.Router();

router.get("/", protectRoute, isSeller, getShop);
router.post("/add", protectRoute, isSeller, addItem);
router.delete("/delete/:shopId/:id", protectRoute, isSeller, deleteItem);
router.patch("/edit/:shopId/:id", protectRoute, isSeller, updateItem);

export default router;
