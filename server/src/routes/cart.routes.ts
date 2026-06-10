import express from "express";
import {
  addToCart,
  decrementItemCartQty,
  deleteCartItem,
  getCart,
  incrementItemCartQty,
} from "../controller/buyer/cart.controller.js";
import { isBuyer, protectRoute } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", protectRoute, isBuyer, getCart);
router.patch("/increment", protectRoute, isBuyer, incrementItemCartQty);
router.patch("/decrement", protectRoute, isBuyer, decrementItemCartQty);
router.delete("/delete", protectRoute, isBuyer, deleteCartItem);
router.get("/:id/add", protectRoute, isBuyer, addToCart);

export default router;
