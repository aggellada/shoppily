import { prisma } from "./prisma";

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
    },
  });

  return userCart;
};
