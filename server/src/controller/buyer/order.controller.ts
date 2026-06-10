import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";

export const placeOrder = async (req: Request, res: Response) => {
  try {
    if (!req.user?.profile) {
      return res.status(401).json({ success: false, message: "You are not authenticated" });
    }

    const { id: profileId } = req.user.profile;

    const profileCart = await prisma.cart.findUnique({
      where: { profileId },
      include: {
        items: {
          include: {
            item: {
              select: {
                id: true,
                name: true,
                shopId: true,
                price: true,
              },
            },
          },
        },
      },
    });

    if (!profileCart || profileCart.items.length === 0) {
      return res.status(400).json({ success: false, message: "No cart or items found." });
    }

    const profileCartId = profileCart?.id;
    const cartItems = profileCart?.items || [];

    const shopsId = cartItems.map((cartItem: any) => cartItem.item.shopId);
    const uniqueShopIds = [...new Set(shopsId)];

    const createOrderPromises = uniqueShopIds.map((shopId) => {
      const itemsForThisShop = cartItems.filter((cartItem: any) => cartItem.item.shopId === shopId);

      const shopTotalAmount = itemsForThisShop.reduce((total: number, cartItem: any) => {
        const itemPrice = Number(cartItem.item.price);
        return total + itemPrice * cartItem.quantity;
      }, 0);

      return prisma.order.create({
        data: {
          profileId,
          shopId,
          cartId: profileCartId,
          totalAmount: shopTotalAmount,
          orderItems: {
            create: itemsForThisShop.map((cartItem: any) => ({
              itemId: cartItem.item.id,
              productName: cartItem.item.name,
              priceAtTime: cartItem.item.price,
              quantity: cartItem.quantity,
            })),
          },
        },
      });
    });

    const transactionResults = await prisma.$transaction([
      ...createOrderPromises,
      prisma.cartItem.deleteMany({
        where: {
          cartId: profileCartId,
        },
      }),
    ]);

    if (!transactionResults || transactionResults.length < 2) {
      return res.status(500).json({ success: false, message: "Orders failed to create." });
    }

    const createdOrders = transactionResults.slice(0, -1);

    return res.status(200).json({
      success: true,
      message: "Successfully placed your order.",
      data: createdOrders,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in placeOrder controller:", error.message);
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

    const orders = await prisma.order.findMany({
      where: {
        profileId: profileId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        totalAmount: true,
        status: true,
        createdAt: true,
        shop: {
          select: {
            name: true,
          },
        },
        orderItems: {
          select: {
            id: true,
            productName: true,
            priceAtTime: true,
            quantity: true,
            item: {
              select: {
                image: true,
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
