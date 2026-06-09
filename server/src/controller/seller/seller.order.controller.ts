import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

export const getShopOrders = async (req: Request, res: Response) => {
  try {
    if (!req.user?.profile) {
      return res.status(401).json({ success: false, message: "You are not authenticated" });
    }

    const storeId = req.params.shopId as string;
    const { id } = req.user?.profile;

    if (!storeId) {
      return res.status(400).json({ message: "Shop ID does not exists." });
    }

    const userMatchShop = await prisma.shop.findUnique({ where: { profileId: id } });

    if (!userMatchShop) {
      return res.status(400).json({ message: "You are not the owner of this shop." });
    }

    const shopOrders = await prisma.shop.findUnique({
      where: { id: storeId },
      select: {
        id: true,
        name: true,
        orders: {
          take: 50,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            //   status: true,
            //   totalAmount: true,
            cartItems: {
              select: {
                items: {
                  select: {
                    quantity: true,
                    item: {
                      select: {
                        id: true,
                        name: true,
                        price: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return res.status(200).json({ success: true, data: shopOrders });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in getShopOrders controller:", error.message);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
};
