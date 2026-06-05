import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getShop = async (req: Request, res: Response) => {
  try {
    const shopId = req.params.id as string;

    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
      include: { items: true },
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: shop,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in getShop:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
};

export const getShopByName = async (req: Request, res: Response) => {
  try {
    const name = req.params.shopName as unknown as string;

    const shopItems = await prisma.shop.findUnique({ where: { name: name }, include: { items: true } });

    return res.status(200).json({ success: true, data: shopItems });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in getShop:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
};

// export const createShop = async (req: Request, res: Response) => {
//   try {
//     const { name } = req.body;

//     if (!name || !req.user?.profile) {
//       return res.status(400).json({ success: false, message: "ASD" });
//     }

//     const { id } = req.user.profile;

//     const newShop = await prisma.shop.create({ data: { name, profileId: id } });

//     return res
//       .status(200)
//       .json({ success: true, message: "Your shop was successfully created.", data: newShop });
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error("Error in createShop:", error.message);
//       return res.status(500).json({
//         success: false,
//         message: "Internal server error",
//       });
//     }
//   }
// };
