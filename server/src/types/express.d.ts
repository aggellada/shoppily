import type { Profile, User, Cart, Shop } from "../generated/prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: Omit<User, "password"> & {
        profile: (Profile & { cart?: Cart | null; shop?: Shop | null }) | null;
      };
    }
  }
}

export {};
