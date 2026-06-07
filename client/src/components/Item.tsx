import { Loader2, Star } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useCartStore } from "../store/useCartStore";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

function Item({ item }: { item: any }) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const navigate = useNavigate();

  const { addToCart } = useCartStore();
  const { authUser } = useAuthStore();

  const handleAddToCartBtn = async (shopId: string, itemId: number) => {
    if (!authUser) {
      return navigate("/login");
    }

    setIsAddingToCart(true);
    await addToCart(shopId, itemId);
    setIsAddingToCart(false);
  };

  return (
    <div
      className="bg-[#FFFFFF] p-4 flex flex-col h-full gap-1 rounded-2xl border-2 border-gray-200 drop-shadow-lg hover:-translate-y-1 transition-transform duration-75 hover:cursor-pointer"
      onClick={() => navigate(`/shop/${item.shop.name}/${item.id}`)}
    >
      <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-lg mb-2" />

      <div className="flex justify-between gap-2">
        {/* Added `truncate` so long titles don't push the star rating off-screen */}
        <p className="font-bold text-lg truncate">{item.name}</p>
        <span className="flex gap-1 shrink-0">
          5 <Star className="text-yellow-300 w-5 h-5" />
        </span>
      </div>

      <p className="font-medium text-red-500">₱{item.price}</p>

      {/* Added `line-clamp-2` so long descriptions don't make this specific card taller than others */}
      <p className="text-sm line-clamp-2">{item.description}</p>

      <div className="flex gap-2 text-sm font-light">
        <p>by:</p>
        <Link
          to={`/shop/${item.shop.name}`}
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="hover:text-violet-700 truncate"
        >
          {item.shop.name}
        </Link>
      </div>

      <button
        className={`hover:cursor-pointer mt-auto drop-shadow-md rounded-md py-2 px-2 hover:bg-red-400 text-white transition-colors ${isAddingToCart ? "bg-red-200" : "bg-red-600"}`}
        onClick={(e) => {
          e.stopPropagation();
          handleAddToCartBtn(item.shop.id, item.id);
        }}
        disabled={isAddingToCart}
      >
        {isAddingToCart ? <Loader2 className="animate-spin m-auto" /> : "Add to Cart"}
      </button>
    </div>
  );
}

export default Item;
