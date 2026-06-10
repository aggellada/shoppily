import { Loader2, Star, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSellerStore } from "../store/sellerStore/useSellerStore";

function SellerItem({ item }: { item: any }) {
  const [modal, setModal] = useState<boolean>(false);
  const [isDeletingItem, setIsDeletingItem] = useState<boolean>(false);
  const [isEditingItem, setIsEditingItem] = useState<boolean>(false);

  const editModalRef = useRef<HTMLDialogElement>(null);

  const { deleteStoreItem, editStoreItem } = useSellerStore();

  useEffect(() => {
    if (modal) {
      editModalRef.current?.showModal();
    }
  }, [modal]);

  const handleDeleteBtn = async (shopId: string, id: number) => {
    setIsDeletingItem(true);

    await deleteStoreItem(shopId, id);

    setIsDeletingItem(false);
  };

  const handleEditBtn = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    setIsEditingItem(true);
    await editStoreItem(item.shopId, item.id, data);
    setIsEditingItem(false);
    setModal(false);
  };

  return (
    <div className="bg-[#FFFFFF] p-4 flex flex-col h-full gap-1 rounded-2xl border-2 border-gray-200 drop-shadow-lg hover:-translate-y-1 transition-transform duration-75 ">
      {modal && (
        <dialog
          ref={editModalRef}
          onClose={() => setModal(false)}
          className="m-auto rounded-3xl p-0 backdrop:bg-black/40 backdrop:backdrop-blur-sm shadow-2xl border-none w-full max-w-md open:animate-in open:fade-in open:zoom-in-95 duration-200"
        >
          <div className="bg-white flex flex-col w-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Edit Product</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-900 transition-colors"
                onClick={() => setModal(false)}
              >
                <X className="w-5 h-5 hover:cursor-pointer" />
              </button>
            </div>

            <form className="p-6 flex flex-col gap-4" onSubmit={handleEditBtn}>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="edit-name" className="text-sm font-semibold text-gray-700">
                  Name
                </label>
                <input
                  id="edit-name"
                  name="name"
                  type="text"
                  defaultValue={item.name}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="edit-price" className="text-sm font-semibold text-gray-700">
                  Price (₱)
                </label>
                <input
                  id="edit-price"
                  name="price"
                  type="number"
                  defaultValue={item.price}
                  step="0.01"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="image" className="text-sm font-semibold text-gray-700">
                  Image Link
                </label>
                <input
                  id="image"
                  name="image"
                  type="string"
                  defaultValue={item.image}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="edit-description" className="text-sm font-semibold text-gray-700">
                  Description
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  rows={4}
                  defaultValue={item.description}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors hover:cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm hover:cursor-pointer "
                >
                  {isEditingItem ? (
                    <div className="flex gap-2 justify-center">
                      <Loader2 className="animate-spin infinite" />
                      Editing
                    </div>
                  ) : (
                    "Edit Item"
                  )}
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
      <img src={item.image} alt="product image" className="w-full h-48 object-cover rounded-lg mb-2" />

      <div className="flex justify-between gap-2">
        <p className="font-bold text-lg truncate">{item.name}</p>
        <span className="flex gap-1 shrink-0">
          5 <Star className="text-yellow-300 w-5 h-5" />
        </span>
      </div>

      <p className="font-medium text-red-500">₱{item.price}</p>

      <p className="text-sm line-clamp-2">{item.description}</p>

      <div className="flex gap-2">
        <button
          className={`hover:cursor-pointer w-full mt-auto drop-shadow-md rounded-md py-2 px-2 bg-blue-600 hover:bg-blue-400 text-white transition-colors `}
          onClick={() => setModal(true)}
        >
          Edit
        </button>
        <button
          className={`hover:cursor-pointer w-full mt-auto drop-shadow-md rounded-md py-2 px-2 hover:bg-red-400 text-white transition-colors bg-red-600 `}
          onClick={() => handleDeleteBtn(item.shopId, item.id)}
          disabled={isDeletingItem}
        >
          {isDeletingItem ? (
            <div className="flex gap-2">
              <Loader2 className="animate-spin infinite" />
              Deleting
            </div>
          ) : (
            "Delete"
          )}
        </button>
      </div>
    </div>
  );
}

export default SellerItem;
