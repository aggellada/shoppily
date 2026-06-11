import { Navigate, Route, Routes } from "react-router";
import "./App.css";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import Home from "./pages/Home";
import { useEffect } from "react";
import ShopPage from "./pages/Shop";
import Cart from "./pages/Cart";
import ItemPage from "./pages/ItemPage";
import { Loader2 } from "lucide-react";
import { BuyerRoute, SellerRoute } from "./components/RoleRoute";
import MyShop from "./pages/seller/MyShop";
import OrdersProfile from "./pages/OrdersProfile";
import MyShopOrders from "./pages/seller/MyShopOrders";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-orange-600 mb-4" />
        <p className="text-gray-500 font-medium">Loading Shoppily...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Navbar />
      <div className="m-auto w-full max-w-7xl">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              !authUser ? (
                <Login />
              ) : authUser.profile.role === "SELLER" ? (
                <Navigate to="/my-shop" />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to="/" />} />

          <Route element={<BuyerRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<OrdersProfile />} />
            <Route path="/shop/:shopName" element={<ShopPage />} />
            <Route path="/shop/:shopId/:itemId" element={<ItemPage />} />
          </Route>

          <Route element={<SellerRoute />}>
            <Route path="/my-shop" element={<MyShop />} />
            <Route path="/my-shop/orders" element={<MyShopOrders />} />
          </Route>

          <Route
            path="*"
            element={<Navigate to={authUser?.profile?.role === "SELLER" ? "/my-shop" : "/"} />}
          />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
