import { Link, useNavigate } from "react-router"; // Use react-router-dom for web
import { useAuthStore } from "../store/useAuthStore";
import { ShoppingCart } from "lucide-react";
import { useGlobalStore } from "../store/useGlobalStore";
import { useCartStore } from "../store/useCartStore";
import { useEffect } from "react";

function Navbar() {
  const { authUser, logout } = useAuthStore();

  const { searchInput } = useGlobalStore();
  const { cartQuantity, getCartItemsTotalQuantity } = useCartStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (authUser?.profile?.role === "BUYER") {
      getCartItemsTotalQuantity();
    }
  }, [getCartItemsTotalQuantity]);

  const handleLogOutBtn = async () => {
    await logout();
    navigate("/login");
  };

  console.log(authUser);

  return (
    <header className="w-full h-16 bg-linear-to-b from-orange-700 to-orange-500 sticky top-0 z-50 text-white shadow-md">
      {/* 1. Added horizontal padding (px-4 sm:px-6) so it doesn't touch mobile screen edges */}
      <nav className="max-w-7xl w-full m-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          // 2. Added tracking-tight and a subtle hover scale
          className="text-2xl font-bold tracking-tight hover:scale-105 transition-transform"
          onClick={() => {
            if (searchInput !== "" && window.location.pathname === "/") {
              window.location.reload();
            }
          }}
        >
          Shoppily
        </Link>

        {/* Navigation Links */}
        <ul className="flex items-center gap-4 sm:gap-6 font-medium">
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
                <span>{cartQuantity?._count?.items}</span>
              </Link>
            </li>
          )}

          {/* Login/Logout Buttons */}
          <li>
            {authUser ? (
              <button
                onClick={handleLogOutBtn}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-colors hover:cursor-pointer"
              >
                Log out
              </button>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-lg bg-white text-orange-600 hover:bg-orange-50 font-semibold shadow-sm transition-colors"
              >
                Login
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
