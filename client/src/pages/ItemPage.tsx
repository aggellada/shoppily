import { useEffect, useState } from "react";
import { useItemStore } from "../store/useItemStore";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { useParams, useNavigate } from "react-router";
import { ShoppingCart, Star, ChevronLeft, Loader2 } from "lucide-react";

function ItemPage() {
  // shopId to shopName
  const { itemId } = useParams();
  const navigate = useNavigate();

  const { getItem, itemDetails } = useItemStore();
  const { addToCart } = useCartStore();
  const { authUser } = useAuthStore();

  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    if (itemId) {
      getItem(itemId);
    }
  }, [itemId, getItem]);

  const handleAddToCartBtn = async () => {
    if (!authUser) {
      return navigate("/login");
    }
    if ( !itemDetails) return;

    setIsAddingToCart(true);
    await addToCart(itemDetails.shop.id, itemDetails.id);
    setIsAddingToCart(false);
  };

  console.log(itemDetails)

  if (!itemDetails) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col justify-center items-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading product details...</p>
      </div>
    );
  }

  const formattedPrice = Number(itemDetails.price).toLocaleString();

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Optional: Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8 w-fit hover:cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back
      </button>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {/* Left Column: Product Image */}
        <div className="w-full">
          <div className="aspect-square w-full bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
            <img
              src="https://www.shutterstock.com/image-photo/cosmetic-cream-tubes-hands-set-260nw-2406148543.jpg"
              alt={itemDetails.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Column: Product Details */}
        <div className="flex flex-col pt-2 md:pt-6">
          {/* Title & Rating */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            {itemDetails.name}
          </h1>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md">
              <span className="font-bold text-yellow-700 text-sm">5.0</span>
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>

          {/* Price */}
          <div className="mb-8">
            <p className="text-4xl font-black text-gray-900 tracking-tight">₱{formattedPrice}</p>
            <p className="text-sm text-gray-500 mt-1">Tax included. Shipping calculated at checkout.</p>
          </div>

          {/* Description Box */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-gray-900 mb-2">About this item</h3>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">{itemDetails.description}</p>
          </div>

          {/* Add to Cart Action */}
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
