import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const placeOrder = async (req: Request, res: Response) => {
  try {
    if (!req.user?.profile) {
      return res.status(401).json({ success: false, message: "You are not authenticated" });
    }

    const { id: profileId } = req.user.profile;

    const profileCart = await prisma.cart.findUnique({
      where: { profileId },
      include: { items: { include: { item: { select: { shopId: true } } } } },
    });

    const profileCartId = profileCart?.id;
    const shopsId = profileCart?.items?.map((cartItem) => cartItem.item.shopId) || [];

    // FIX 1: Properly check if the cart exists AND has items
    if (!profileCartId || shopsId.length === 0) {
      return res.status(400).json({ success: false, message: "No cart or items found." });
    }

    // FIX 2: Deduplicate shop IDs (so you don't create multiple orders for the same shop)
    const uniqueShopIds = [...new Set(shopsId)];

    // FIX 3: Prepare the data array for createMany
    const orderData = uniqueShopIds.map((shopId) => ({
      profileId,
      shopId,
      cartId: profileCartId,
    }));

    // FIX 4: Use a single await call to insert all orders at once
    const newOrders = await prisma.order.createMany({
      data: orderData,
    });

    // createMany returns an object like { count: 3 }
    if (newOrders.count === 0) {
      return res.status(500).json({ success: false, message: "Orders failed to create." });
    }

    return res
      .status(200)
      .json({ success: true, message: "Successfully placed your order.", data: newOrders });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in placeOrder controller:", error.message);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
};

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

export const getProfileOrders = async (req: Request, res: Response) => {
  try {
    if (!req.user?.profile) {
      return res.status(401).json({ success: false, message: "You are not authenticated" });
    }

    const { id: profileId } = req.user.profile;

    // Query the Order model directly!
    const orders = await prisma.order.findMany({
      where: {
        profileId: profileId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        createdAt: true,
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
    });

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in getProfileOrders controller:", error.message);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
};
