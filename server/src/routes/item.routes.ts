import express from "express";
import { getShop } from "../controller/shop.controller";
import {
  addItem,
  deleteItem,
  getAllItems,
  getItem,
  searchItems,
  updateItem,
} from "../controller/item.controller";
import { isSeller, protectRoute } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/get/items", getAllItems);
router.get("/search", searchItems);
router.get("/get/item", getItem);
router.post("/:id/add", protectRoute, isSeller, addItem);
router.patch("/:id/update", protectRoute, isSeller, updateItem);
router.delete("/:id/delete", protectRoute, isSeller, deleteItem);

export default router;
