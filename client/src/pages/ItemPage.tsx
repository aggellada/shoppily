import { useEffect, useState } from "react";
import { useItemStore } from "../store/useItemStore";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { useParams, useNavigate } from "react-router";
import { ShoppingCart, Star, ChevronLeft, Loader2 } from "lucide-react";
import ItemPageSkeleton from "../components/loading/ItemPageSkeleton";

function ItemPage() {
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { itemId } = useParams();

  const { getItem, itemDetails, isFetchingItemDetails } = useItemStore();
  const { addToCart } = useCartStore();
  const { authUser } = useAuthStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (itemId) {
      getItem(itemId);
    }
  }, [itemId, getItem]);

  const handleAddToCartBtn = async () => {
    if (!authUser) {
      return navigate("/login");
    }
    if (!itemDetails) return;

    setIsAddingToCart(true);
    await addToCart(itemDetails.shop.id, itemDetails.id);
    setIsAddingToCart(false);
  };

  if (!itemDetails || isFetchingItemDetails) {
    return <ItemPageSkeleton />;
  }

  const formattedPrice = Number(itemDetails.price).toLocaleString();

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8 w-fit hover:cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        <div className="w-full">
          <div className="aspect-square w-full bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
            <img
              src={itemDetails.image ?? ""}
              alt={itemDetails.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col pt-2 md:pt-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            {itemDetails.name}
          </h1>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md">
              <span className="font-bold text-yellow-700 text-sm">5.0</span>
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>

          <div className="mb-8">
            <p className="text-4xl font-black text-gray-900 tracking-tight">₱{formattedPrice}</p>
            <p className="text-sm text-gray-500 mt-1">Tax included. Shipping calculated at checkout.</p>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-gray-900 mb-2">About this item</h3>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">{itemDetails.description}</p>
          </div>

          <div className="mt-auto">
            <button
              onClick={handleAddToCartBtn}
              disabled={isAddingToCart}
              className={`
                w-full h-14 rounded-xl font-bold text-lg flex justify-center items-center transition-all duration-200 hover:cursor-pointer
                ${
                  isAddingToCart
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                    : "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg active:scale-[0.98]"
                }
              `}
            >
              {isAddingToCart ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  Adding to cart...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-6 h-6 mr-2" />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemPage;
