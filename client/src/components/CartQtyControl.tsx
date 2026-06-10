import { useState } from "react";
import { useCartStore } from "../store/useCartStore";
import { Minus, Plus } from "lucide-react";

function CartQtyControl({ shopId, itemId, itemQty }: { shopId: string; itemId: number; itemQty: number }) {
  const [isUpdatingQty, setIsUpdatingQty] = useState<boolean>(false);

  const { decrementItemCartQty, incrementItemCartQty } = useCartStore();

  const handleIncrementBtn = async (
    e: any,
    shopId: string,
    itemId: number,
  ) => {
    e.stopPropagation();
    setIsUpdatingQty(true);

    await incrementItemCartQty(shopId, itemId);

    setIsUpdatingQty(false);
  };

  const handleDecrementBtn = async (
    e: any,
    shopId: string,
    itemId: number,
  ) => {
    e.stopPropagation();
    setIsUpdatingQty(true);

    await decrementItemCartQty(shopId, itemId);

    setIsUpdatingQty(false);
  };

  return (
    <div
      className={`flex items-center gap-3 ${isUpdatingQty ? "bg-gray-200" : "bg-gray-50"} border border-gray-200 rounded-lg p-1`}
    >
      <button
        onClick={(e) => handleDecrementBtn(e, shopId, itemId)}
        className="p-1 hover:bg-white rounded-md transition-colors hover:cursor-pointer"
        disabled={isUpdatingQty}
      >
        <Minus className="w-4 h-4 text-gray-600" />
      </button>
      <span className="w-6 text-center font-semibold text-gray-900">{itemQty}</span>
      <button
        onClick={(e) => handleIncrementBtn(e, shopId, itemId)}
        className="p-1 hover:bg-white rounded-md transition-colors hover:cursor-pointer"
        disabled={isUpdatingQty}
      >
        <Plus className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  );
}

export default CartQtyControl;
