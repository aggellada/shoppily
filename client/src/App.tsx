import { Navigate, Route, Routes } from "react-router";
import "./App.css";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import Home from "./pages/Home";
import CreateShop from "./pages/CreateShop";
import { useEffect } from "react";
import ShopPage from "./pages/Shop";
import Cart from "./pages/Cart";
import ItemPage from "./pages/ItemPage";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <h1>Checking Auth</h1>;
  }

  return (
    <div className="w-full min-h-screen bg-[#F5F5F5]">
      <Navbar />
      <div className="m-auto w-full max-w-5xl ">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/shop/:shopName" element={<ShopPage />} />
          <Route path="/shop/:shopId/:itemId" element={<ItemPage />} />
          <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
          <Route path="/cart" element={authUser ? <Cart /> : <Navigate to="/" />} />
          <Route path="/shop/create" element={authUser ? <CreateShop /> : <Navigate to="/" />} />
        </Routes>
        <Toaster />
      </div>
    </div>
  );
}

export default App;
