import express, { Router } from "express";
import { checkAuth, login, logout, signup } from "../controller/auth.controller";
import { protectRoute } from "../middleware/auth.middleware";

const router: Router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/check-auth", protectRoute, checkAuth);

export default router;
