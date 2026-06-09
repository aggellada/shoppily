import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronDown } from "lucide-react"; // Assuming you still have lucide-react installed
import { useAuthStore } from "../../store/useAuthStore";

function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  const { authUser, logout } = useAuthStore();

  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogOutBtn = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <li className="relative list-none" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 font-semibold  text-white rounded-lg  focus:outline-none hover:cursor-pointer"
      >
        {authUser.username}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 w-48 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
          <div className="flex flex-col">
            {authUser.profile.role === "BUYER" && (
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Profile
              </Link>
            )}

            {authUser.profile.role === "BUYER" && (
              <Link
                to="/orders"
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Orders
              </Link>
            )}

            <div className="h-px bg-gray-100" />
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogOutBtn();
              }}
              className="px-4 py-3 text-sm font-medium text-left text-red-600 hover:bg-red-50 transition-colors hover:cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

export default UserDropdown;
