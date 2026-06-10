import express from "express";
import { isBuyer, isSeller, protectRoute } from "../middleware/auth.middleware";
import { getProfileOrders, placeOrder } from "../controller/buyer/order.controller";
import { getShopOrders } from "../controller/seller/seller.order.controller";

const router = express.Router();

router.post("/", protectRoute, isBuyer, placeOrder);
router.get("/profile/orders", protectRoute, isBuyer, getProfileOrders);
router.get("/:shopId/orders", protectRoute, isSeller, getShopOrders);

export default router;
