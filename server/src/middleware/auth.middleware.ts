import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { ROLES } from "../lib/roles";

interface JwtPayload {
  id: string;
  role: string;
}

export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ message: "No token provided." });

    const SECRET = process.env.JWT_SECRET;
    if (!SECRET) return res.status(500).json({ message: "Server configuration error." });

    const decoded = jwt.verify(token, SECRET) as JwtPayload;

    // Fetch the user and their profile relations in ONE query
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        profile: {
          include: {
            cart: true,
            shop: true,
          },
        },
      },
      omit: { password: true },
    });

    if (!user) return res.status(404).json({ message: "User not found." });

    // Attach to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json({ success: false, message: "Unauthorized - Invalid or expired token" });
  }
};

export const isSeller = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User is not logged in." });
    }

    if (req.user.profile?.role !== ROLES.SELLER) {
      return res.status(400).json({ success: false, message: "You are not a seller." });
    }

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json({ success: false, message: "Unauthorized - Invalid or expired token" });
  }
};

export const isBuyer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "User is not logged in." });
    }

    if (req.user.profile?.role !== ROLES.BUYER) {
      return res.status(400).json({ success: false, message: "You are not a buyer." });
    }

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json({ success: false, message: "Unauthorized - Invalid or expired token" });
  }
};
