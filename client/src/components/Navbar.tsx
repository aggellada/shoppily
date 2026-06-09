import { Link } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import { useEffect } from "react";
import UserDropdown from "./ui/UserDropdown";

function Navbar() {
  const { authUser } = useAuthStore();

  const { cart, getCart } = useCartStore();

  useEffect(() => {
    if (authUser?.profile?.role === "BUYER") {
      getCart();
    }
  }, [getCart, authUser]);

  return (
    <header className="w-full h-16 bg-linear-to-b from-orange-700 to-orange-500 sticky top-0 z-50 text-white shadow-md">
      <nav className="max-w-7xl w-full m-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight hover:scale-105 transition-transform"
          onClick={() => {
            if (window.location.pathname === "/") {
              window.location.reload();
            }
          }}
        >
          Shoppily
        </Link>

        <ul className="flex items-center gap-2 sm:gap-4 font-medium">
          {!authUser && (
            <li>
              <Link to="/signup" className="hover:text-orange-200 transition-colors">
                Signup
              </Link>
            </li>
          )}

          {authUser?.profile?.role === "BUYER" && (
            <li>
              <Link
                to="/cart"
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="View Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cart?._count?.items}
              </Link>
            </li>
          )}

          {authUser?.profile?.role === "SELLER" && (
            <li>
              <Link to="/my-shop/orders">View Orders</Link>
            </li>
          )}

          <li>
            {!authUser && (
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-lg bg-white text-orange-600 hover:bg-orange-50 font-semibold shadow-sm transition-colors"
              >
                Login
              </Link>
            )}
          </li>
          {authUser && <UserDropdown />}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
