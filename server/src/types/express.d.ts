import type { Profile, User, Cart } from "../generated/prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: Omit<User, "password"> & {
        profile: (Profile & { cart: Cart | null }) | null;
      };
    }
  }
}

export {};
