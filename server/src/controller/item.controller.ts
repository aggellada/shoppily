import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const addItem = async (req: Request, res: Response) => {
  try {
    if (!req.user?.profile) {
      return res.status(400).json({ message: "No profile found." });
    }

    const shopId = req.params.id as string;
    const { name, price, description } = req.body;
    const { id: profileId } = req.user?.profile;

    if (!shopId || !name || !price || !description || !profileId) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const userShopOwner = await prisma.shop.findUnique({ where: { id: shopId, profileId } });

    if (!userShopOwner) {
      return res.status(400).json({ message: "You are not the owner of the shop." });
    }

    const newItem = await prisma.item.create({ data: { shopId, name, price, description } });

    return res.status(200).json({ success: true, message: "An item was added to your shop", data: newItem });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in addItem controller", error.message);
      return res.status(400).json({ success: false, message: "Internal Server Error" });
    }
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "No id provided." });
    }

    const deletedItem = await prisma.item.delete({ where: { id } });

    return res
      .status(200)
      .json({ status: true, message: "An item was deleted from your shop", data: deletedItem });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in addItem controller", error.message);
      return res.status(400).json({ success: false, message: "Internal Server Error" });
    }
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const { id, name, price, description } = req.body;

    if (!id) {
      return res.status(400).json({ message: "No id provided." });
    }

    const updatedItem = await prisma.item.update({ where: { id }, data: { name, price, description } });

    return res
      .status(200)
      .json({ status: true, message: "Item was updated from your shop", data: updatedItem });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in addItem controller", error.message);
      return res.status(400).json({ success: false, message: "Internal Server Error" });
    }
  }
};

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
    const { shopId, itemId } = req.query as {
      shopId?: string;
      itemId?: string;
    };

    if (!shopId || !itemId) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const parsedItemId = Number(itemId);
    if (isNaN(parsedItemId)) {
      return res.status(400).json({ success: false, message: "itemId must be a valid number." });
    }

    const item = await prisma.item.findUnique({ where: { id: parsedItemId, shopId } });

    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in addItem controller", error.message);
      return res.status(400).json({ success: false, message: "Internal Server Error" });
    }
  }
};
