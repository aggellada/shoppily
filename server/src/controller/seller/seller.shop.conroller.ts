import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

export const getShop = async (req: Request, res: Response) => {
  try {
    const userProfileId = req.user?.profile?.id;

    if (!userProfileId) {
      return res.status(400).json({ success: false, message: "Not authenticated." });
    }

    const userShop = await prisma.shop.findUnique({
      where: {
        profileId: userProfileId,
      },
      include: {
        _count: {
          select: { items: true, orders: true },
        },
        items: {
          orderBy: {
            createdAt: "desc",
          },
        },
        orders: true,
      },
    });

    if (!userShop) {
      return res.status(400).json({ success: false, message: "You do not have a shop." });
    }

    return res.status(200).json({ success: true, data: userShop });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in getShop controller", error.message);
    }
    return res.status(500).json({ mesaage: "Internal Server Error" });
  }
};

export const addItem = async (req: Request, res: Response) => {
  try {
    const profileId = req.user?.profile?.id;

    if (!profileId) {
      return res.status(401).json({ message: "Unauthorized: No profile found." });
    }

    const { name, price, description, image } = req.body;

    if (!name || price === undefined || !description) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const userShopOwner = await prisma.shop.findUnique({
      where: { profileId },
    });

    if (!userShopOwner) {
      return res.status(403).json({ message: "Forbidden: You do not own a shop." });
    }

    const newItem = await prisma.item.create({
      data: {
        shopId: userShopOwner.id,
        name,
        price: Number(price),
        description,
        image,
      },
    });

    return res.status(201).json({
      success: true,
      message: "An item was added to your shop",
      data: newItem,
    });
  } catch (error) {
    console.error("Error in addItem controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  try {
    const { id, shopId } = req.params as unknown as {
      id: string;
      shopId: string;
    };

    if (!id) {
      return res.status(400).json({ message: "No id provided." });
    }

    const parsedItemId = Number(id);

    if (isNaN(parsedItemId)) {
      return res.status(400).json({ success: false, message: "Number must be an integer number" });
    }

    const deletedItem = await prisma.item.delete({ where: { id: parsedItemId, shopId } });

    return res
      .status(200)
      .json({ success: true, message: "An item was deleted from your shop", data: deletedItem });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in addItem controller", error.message);
      return res.status(400).json({ success: false, message: "Internal Server Error" });
    }
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const { id, shopId } = req.params as unknown as {
      id: string;
      shopId: string;
    };
    const { name, price, description, image } = req.body;

    if (!name || !price || !description || !image) {
      return res.status(400).json({ message: "Invalid fields." });
    }

    if (!id || !shopId) {
      return res.status(400).json({ message: "No id provided." });
    }

    const parsedItemId = Number(id);

    if (isNaN(parsedItemId)) {
      return res.status(400).json({ success: false, message: "Number must be an integer number" });
    }

    const updatedItem = await prisma.item.update({
      where: { id: parsedItemId, shopId },
      data: { name, price, description, image },
    });

    return res
      .status(200)
      .json({ success: true, message: "Item was updated from your shop", data: updatedItem });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in addItem controller", error.message);
      return res.status(400).json({ success: false, message: "Internal Server Error" });
    }
  }
};
