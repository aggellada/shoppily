import { useEffect } from "react";
import { useShopStore } from "../store/useShopStore";
import { useParams } from "react-router";
import { Store } from "lucide-react";

import ShopItem from "../components/ShopItem";
import ShopSkeleton from "../components/loading/ShopSkeleton";

function Shop() {
  const { shopName } = useParams();
  const { shop, getShopItems, fetchingShop } = useShopStore();

  useEffect(() => {
    if (shopName) {
      getShopItems(shopName);
    }
  }, [shopName, getShopItems]);

  if (fetchingShop) {
    return <ShopSkeleton />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="py-12 md:py-16 px-8 bg-white my-6 drop-shadow-xl rounded-2xl flex flex-col items-center justify-center text-center border-2 border-gray-100">
        <Store className="w-12 h-12 text-gray-400 mb-4" />
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          {shop?.name || "Loading Shop..."}
        </h1>
        <p className="text-gray-500 mt-2 font-medium">Welcome to {shop?.name}'s official storefront</p>
      </div>

      {shop?.items && shop.items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {shop.items.map((item: any) => (
            <ShopItem key={item.id} item={item} shop={shop} />
          ))}
        </div>
      ) : (
        <div className="w-full py-20 flex flex-col items-center text-gray-500 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-lg font-medium">This shop has no items yet.</p>
        </div>
      )}
    </div>
  );
}

export default Shop;
