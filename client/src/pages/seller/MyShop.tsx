import { useEffect, useRef, useState } from "react";
import { useSellerStore } from "../../store/sellerStore/useSellerStore";
import { Package, ShoppingBag, Store, TrendingUp, X } from "lucide-react";
import SellerItem from "../../components/seller/SellerItem";

function MyShop() {
  const [modal, setModal] = useState<boolean>(false);

  const { getShop, shop, addStoreItem, isAddingStoreItem } = useSellerStore();

  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    getShop();
  }, [getShop]);

  useEffect(() => {
    if (modal) {
      modalRef.current?.showModal();
    }
  }, [modal]);

  const handleFormSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const data = Object.fromEntries(formData.entries());

    await addStoreItem(data);
    setModal(false);
  };

  console.log(shop);

  return (
    <div className="w-full mt-8">
      {modal && (
        <dialog
          ref={modalRef}
          onClose={() => setModal(false)}
          className="m-auto rounded-3xl p-0 backdrop:bg-black/40 backdrop:backdrop-blur-sm shadow-2xl border-none w-full max-w-md open:animate-in open:fade-in open:zoom-in-95 duration-200"
        >
          <div className="bg-white flex flex-col w-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Add New Product</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-900 transition-colors"
                onClick={() => setModal(false)}
              >
                <X className="w-5 h-5 hover:cursor-pointer" />
              </button>
            </div>

            <form className="p-6 flex flex-col gap-4" onSubmit={handleFormSubmit}>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="add-name" className="text-sm font-semibold text-gray-700">
                  Name
                </label>
                <input
                  id="add-name"
                  name="name"
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="add-price" className="text-sm font-semibold text-gray-700">
                  Price (₱)
                </label>
                <input
                  id="add-price"
                  name="price"
                  type="number"
                  step="0.01"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="add-imageLink" className="text-sm font-semibold text-gray-700">
                  Image Link
                </label>
                <input
                  id="add-imageLink"
                  name="image"
                  type="url"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="add-description" className="text-sm font-semibold text-gray-700">
                  Description
                </label>
                <textarea
                  id="add-description"
                  name="description"
                  rows={4}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  className="flex-1 px-4 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors hover:cursor-pointer"
                  onClick={() => setModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl font-semibold text-white bg-gray-900 hover:bg-gray-800 transition-colors shadow-sm hover:cursor-pointer"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}

      <div className="flex flex-col gap-6 my-6 w-full">
        {/* 1. Main Dashboard Banner */}
        <div className="py-10 px-8 bg-white drop-shadow-sm rounded-2xl flex flex-col items-center justify-center text-center border border-gray-200 relative overflow-hidden">
          {/* Added a subtle background accent circle for polish */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-50 rounded-full opacity-50 pointer-events-none" />

          <Store className="w-12 h-12 text-orange-600 mb-4 z-10" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 z-10 tracking-tight">
            {shop?.name || "Loading Dashboard..."}
          </h1>
          <p className="text-gray-500 mt-2 font-medium z-10">Manage your inventory and track orders</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-5 hover:border-orange-300 transition-colors">
            <div className="p-4 bg-orange-50 rounded-2xl">
              <Package className="w-7 h-7 text-orange-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Active Products
              </span>
              <span className="text-2xl font-black text-gray-900">{shop?._count?.items}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-5 hover:border-blue-300 transition-colors">
            <div className="p-4 bg-blue-50 rounded-2xl">
              <ShoppingBag className="w-7 h-7 text-blue-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Total Orders
              </span>
              <span className="text-2xl font-black text-gray-900">{shop?._count?.orders}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-5 hover:border-green-300 transition-colors opacity-80">
            <div className="p-4 bg-green-50 rounded-2xl">
              <TrendingUp className="w-7 h-7 text-green-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Total Revenue
              </span>
              <span className="text-2xl font-black text-gray-900">₱0</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mb-4 items-center">
        <h1 className="font-bold text-2xl">Your Inventory</h1>
        <button
          className="bg-black text-white p-4 rounded-xl hover:cursor-pointer"
          onClick={() => setModal(true)}
        >
          + Add New Item
        </button>
      </div>
      {shop?.items && shop.items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {shop.items.map((item: any) => (
            <SellerItem key={item.id} item={item} shop={shop} />
          ))}
        </div>
      ) : (
        <div className="w-full py-20 flex flex-col items-center text-gray-500 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-lg font-medium">This shop has no items yet.</p>
          <button>Add an item</button>
        </div>
      )}
    </div>
  );
}

export default MyShop;
