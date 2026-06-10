import { useState } from "react";
import { useCartStore } from "../store/useCartStore";
import { useNavigate } from "react-router";
import { Loader, Star } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

function ShopItem({ item, shop }: { item: any; shop: any }) {
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);

  const { addToCart } = useCartStore();
  const { authUser } = useAuthStore();

  const navigate = useNavigate();

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
      onClick={() => navigate(`/shop/${shop.name}/${item.id}`)}
    >
      <img src={item.image} alt="product image" className="w-full h-48 object-cover rounded-lg mb-2" />

      <div className="flex justify-between gap-2">
        <p className="font-bold text-lg truncate">{item.name}</p>
        <span className="flex gap-1 shrink-0">
          5 <Star className="text-yellow-300 w-5 h-5" />
        </span>
      </div>

      <p className="font-medium text-red-500">₱{item.price}</p>

      <p className="text-sm line-clamp-2">{item.description}</p>

      <button
        className={`hover:cursor-pointer mt-auto drop-shadow-md rounded-md py-2 px-2 hover:bg-red-400 text-white transition-colors ${isAddingToCart ? "bg-red-200" : "bg-red-600"}`}
        onClick={(e) => {
          e.stopPropagation();
          handleAddToCartBtn(shop.id, item.id);
        }}
        disabled={isAddingToCart}
      >
        {isAddingToCart ? <Loader className="animate-spin m-auto" /> : "Add to Cart"}
      </button>
    </div>
  );
}

export default ShopItem;
