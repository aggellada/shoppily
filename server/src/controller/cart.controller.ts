import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { fetchCartData } from "../lib/helpers";

export const getCart = async (req: Request, res: Response) => {
  try {
    if (!req.user?.profile) {
      return res.status(401).json({ success: false, message: "You are not authenticated" });
    }

    const { id: profileId } = req.user.profile;

    const userCart = await fetchCartData(profileId);

    if (!userCart) {
      return res.status(400).json({ success: false, message: "No cart found." });
    }

    return res.status(200).json({ success: true, data: userCart });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in getCart controller:", error.message);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    if (!req.user?.profile?.cart) {
      return res.status(401).json({ success: false, message: "You are not authenticated" });
    }

    const cartId = req.user?.profile?.cart?.id;
    const shopId = req.params.id as string;
    const itemId = req.query.itemId;
    const quantity = 1;

    if (!itemId || !shopId) {
      return res.status(400).json({ success: false, message: "itemId and shopId is required" });
    }

    const parsedQuantity = Number(quantity);
    const parsedItemId = Number(itemId);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return res.status(400).json({ success: false, message: "Quantity must be a positive number" });
    }

    if (isNaN(parsedItemId)) {
      return res.status(400).json({ success: false, message: "Number must be an integer number" });
    }

    const cartItem = await prisma.cartItem.upsert({
      where: {
        cartId_itemId_shopId: {
          cartId: cartId,
          itemId: parsedItemId,
          shopId: shopId,
        },
      },
      update: {
        quantity: { increment: parsedQuantity },
      },
      create: {
        cartId: cartId,
        itemId: parsedItemId,
        shopId: shopId,
        quantity: parsedQuantity,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      data: cartItem,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in addToCart controller:", error.message);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
};

export const deleteCartItem = async (req: Request, res: Response) => {
  try {
    if (!req.user?.profile) {
      return res.status(401).json({ success: false, message: "You are not authenticated" });
    }

    const { id: profileId } = req.user.profile;
    const { itemId, shopId } = req.query as {
      itemId?: string;
      shopId?: string;
    };

    const parsedItemId = Number(itemId);

    if (!req.user?.profile?.cart) {
      return res.status(401).json({ success: false, message: "You are not authenticated" });
    }

    if (!itemId || isNaN(parsedItemId)) {
      return res.status(400).json({ success: false, message: "Item ID is required" });
    }

    const result = await prisma.cartItem.deleteMany({
      where: {
        itemId: parsedItemId,
        cart: {
          profileId: profileId,
        },
        shopId,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ success: false, message: "Item not found in your cart" });
    }

    const userCart = await fetchCartData(profileId);

    return res
      .status(200)
      .json({ success: true, data: userCart, message: "Item removed from cart successfully" });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in deleteCartItem controller:", error.message);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
};

export const incrementItemCartQty = async (req: Request, res: Response) => {
  try {
    if (!req.user?.profile?.cart) {
      return res.status(401).json({ success: false, message: "You are not authenticated" });
    }

    const profileCartId = req.user?.profile?.cart?.id;
    const { itemId, shopId } = req.query as {
      itemId?: string;
      shopId?: string;
    };

    if (!itemId || !shopId) {
      return res.status(400).json({ success: false, message: "Both itemId and shopId are required." });
    }

    const parsedItemId = Number(itemId);
    if (isNaN(parsedItemId)) {
      return res.status(400).json({ success: false, message: "itemId must be a valid number." });
    }

    if (!profileCartId) {
      return res.status(401).json({ success: false, message: "You are not authenticated" });
    }

    await prisma.cartItem.update({
      where: { cartId_itemId_shopId: { cartId: profileCartId, itemId: parsedItemId, shopId } },
      data: { quantity: { increment: 1 } },
    });

    const { id: profileId } = req.user.profile;

    const userCart = await fetchCartData(profileId);

    return res.status(200).json({ success: true, data: userCart });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in incrementItemCartQty controller:", error.message);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
};

export const decrementItemCartQty = async (req: Request, res: Response) => {
  try {
    const profileCartId = req.user?.profile?.cart?.id;

    if (!req.user?.profile || !profileCartId) {
      return res.status(401).json({ success: false, message: "You are not authenticated" });
    }

    const { itemId, shopId } = req.query as {
      itemId?: string;
      shopId?: string;
    };

    if (!itemId || !shopId) {
      return res.status(400).json({ success: false, message: "Both itemId and shopId are required." });
    }

    const parsedItemId = Number(itemId);
    if (isNaN(parsedItemId)) {
      return res.status(400).json({ success: false, message: "itemId must be a valid number." });
    }

    const compoundWhere = {
      cartId_itemId_shopId: {
        cartId: profileCartId,
        itemId: parsedItemId,
        shopId,
      },
    };

    const currentItem = await prisma.cartItem.findUnique({
      where: compoundWhere,
    });

    if (!currentItem) {
      return res.status(404).json({ success: false, message: "Item not found in cart." });
    }

    if (currentItem.quantity <= 1) {
      await prisma.cartItem.delete({
        where: compoundWhere,
      });
    } else {
      await prisma.cartItem.update({
        where: compoundWhere,
        data: { quantity: { decrement: 1 } },
      });
    }

    const { id: profileId } = req.user.profile;
    const userCart = await fetchCartData(profileId);

    if (!userCart) {
      return res.status(400).json({ success: false, message: "No cart found." });
    }

    return res.status(200).json({ success: true, message: "Cart updated successfully", data: userCart });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in incrementItemCartQty controller:", error.message);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
};

export const getCartItemsTotalQuantity = async (req: Request, res: Response) => {
  try {
    const profileCartId = req.user?.profile?.cart?.id;

    if (!req.user?.profile || !profileCartId) {
      return res.status(401).json({ success: false, message: "You are not authenticated" });
    }

    const cartTotalQuantity = await prisma.cart.findUnique({
      where: { id: profileCartId },
      select: { _count: true },
    });

    return res.status(200).json({ success: true, data: cartTotalQuantity });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in incrementItemCartQty controller:", error.message);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
};
