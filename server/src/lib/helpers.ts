import { prisma } from "./prisma.js";

export const fetchCartData = async (profileId: string) => {
  const userCart = await prisma.cart.findUnique({
    where: { profileId },
    include: {
      items: {
        include: { item: true, shop: true },
        orderBy: {
          itemId: "desc",
        },
      },
      _count: {
        select: { items: true },
      },
    },
  });

  return userCart;
};
