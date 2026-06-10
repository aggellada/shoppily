import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { ROLES } from "../lib/roles";
import type { Prisma } from "@prisma/client/extension";

export const signup = async (req: Request, res: Response) => {
  const { firstName, lastName, username, email, password, role, shopName } = req.body;

  try {
    if (!username || !password || !firstName || !lastName || !email || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be 6 characters more." });
    }

    const hashedPassword = await argon2.hash(password);

    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const newUser = await tx.user.create({
        data: {
          firstName,
          lastName,
          username,
          email,
          password: hashedPassword,
        },
      });

      const newProfile = await tx.profile.create({
        data: {
          userId: newUser.id,
          role,
        },
      });

      if (newProfile.role === ROLES.BUYER) {
        await tx.cart.create({
          data: { profileId: newProfile.id },
        });
      } else if (newProfile.role === ROLES.SELLER) {
        await tx.shop.create({ data: { profileId: newProfile.id, name: shopName } });
      }

      return { newUser, newProfile };
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { newUser: result.newUser, profile: result.newProfile },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in signup controller:", error.message);
    }
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const user = await prisma.user.findUnique({
      where: { username },
      include: { profile: true },
    });

    if (!user) {
      return res.status(400).json({ message: "User does not exists." });
    }

    const verifiedPassword = await argon2.verify(user?.password, password);

    if (!verifiedPassword) {
      return res.status(400).json({ succes: false, message: "Invalid access" });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("No JWT Key");
    }

    const isProduction = process.env.NODE_ENV === "production";
    const token = jwt.sign({ id: user.id, role: user.profile?.role }, secret, { expiresIn: "1d" });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    });

    const { password: _, ...userWithoutPassword } = user;

    return res
      .status(200)
      .json({ data: userWithoutPassword, message: "You have successfully logged in!", success: true });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in login controller:", error.message);
    }
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const checkAuth = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      success: true,
      message: "User authenticated",
      data: req.user,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in checkAuth:", error.message);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("jwt", "", {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
      expires: new Date(0),
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in logout controller", error.message);
    }

    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
