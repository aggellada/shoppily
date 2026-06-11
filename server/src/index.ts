import express, { type Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";

// BUYER ROUTES
import authRoutes from "./routes/auth.routes.js";
import shopRoutes from "./routes/shop.routes.js";
import itemRoutes from "./routes/item.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";

// SELLER ROUTES
import sellerShopRoutes from "./routes/seller/seller.shop.routes.js";

const app: Application = express();
const PORT = process.env.PORT || 5000;

const isProduction = process.env.NODE_ENV === "production";
const frontendUrl = isProduction ? process.env.FRONTEND_URL : "http://localhost:5173";

app.use(cors({ origin: frontendUrl, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// USER ROUTES //
app.use("/api/auth", authRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/item", itemRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);

// BUYER ROUTES //
app.use("/api/seller/shop", sellerShopRoutes);

app.listen(PORT, () => {
  console.log("Server listening on port:", PORT);
});
