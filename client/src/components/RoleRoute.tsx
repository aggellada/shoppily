import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

export const BuyerRoute = () => {
  const { authUser } = useAuthStore();

  if (!authUser) return <Navigate to="/login" replace />;

  if (authUser.profile.role === "SELLER") {
    return <Navigate to="/my-shop" replace />;
  }

  return <Outlet />;
};

export const SellerRoute = () => {
  const { authUser } = useAuthStore();

  if (!authUser) return <Navigate to="/login" replace />;

  if (authUser.profile.role === "BUYER") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
