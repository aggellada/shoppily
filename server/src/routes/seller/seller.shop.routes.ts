import express from "express";
import { addItem, deleteItem, getShop, updateItem } from "../../controller/seller/seller.shop.conroller.js";
import { isSeller, protectRoute } from "../../middleware/auth.middleware.js";
import { updateOrderStatus } from "../../controller/seller/seller.order.controller.js";

const router = express.Router();

router.get("/", protectRoute, isSeller, getShop);
router.post("/add", protectRoute, isSeller, addItem);
router.delete("/delete/:shopId/:id", protectRoute, isSeller, deleteItem);
router.patch("/update/:status/:orderId", protectRoute, isSeller, updateOrderStatus);
router.patch("/edit/:shopId/:id", protectRoute, isSeller, updateItem);

export default router;
