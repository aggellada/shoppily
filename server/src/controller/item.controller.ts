import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const searchItems = async (req: Request, res: Response) => {
  try {
    const name = req.query.itemName as string;

    const searchedItems = await prisma.item.findMany({
      where: { name: { contains: name, mode: "insensitive" } },
      include: { shop: true },
    });

    if (searchedItems.length === 0) {
      return res.status(200).json({ message: "No products found.", success: true, data: searchedItems });
    }

    return res.status(200).json({ success: true, data: searchedItems });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in searchItems controller", error.message);
      return res.status(400).json({ success: false, message: "Internal Server Error" });
    }
  }
};

export const getAllItems = async (req: Request, res: Response) => {
  try {
    const allItems = await prisma.item.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { shop: true },
    });

    if (!allItems) {
      return res.status(400).json({ success: false, message: "Could not get items" });
    }

    return res.status(200).json({ success: true, data: allItems });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in addItem controller", error.message);
      return res.status(400).json({ success: false, message: "Internal Server Error" });
    }
  }
};

export const getItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.query as {
      shopId?: string;
      itemId?: string;
    };

    if (!itemId) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const parsedItemId = Number(itemId);
    if (isNaN(parsedItemId)) {
      return res.status(400).json({ success: false, message: "itemId must be a valid number." });
    }

    const item = await prisma.item.findUnique({
      where: { id: parsedItemId },
      include: { shop: { select: { id: true } } },
    });

    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in addItem controller", error.message);
      return res.status(400).json({ success: false, message: "Internal Server Error" });
    }
  }
};
