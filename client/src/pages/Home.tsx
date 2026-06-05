import { useItemStore } from "../store/useItemStore";
import { useEffect } from "react";
import { Search, ShoppingBag } from "lucide-react";
import { useGlobalStore } from "../store/useGlobalStore";
import Item from "../components/Item";
import HomeSkeleton from "../components/loading/HomeSkeleton";

function Home() {
  const { searchInput, setSearchInput } = useGlobalStore();
  const { allItems, getItems, searchItems, isGettingAllItems } = useItemStore();

  useEffect(() => {
    getItems();
  }, [getItems]);

  useEffect(() => {
    if (searchInput === "") {
      getItems();
    }
  }, [searchInput, getItems]);

  const handleSearchBtn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchInput) {
      searchItems(searchInput);
    }
  };

  if (isGettingAllItems) {
    return <HomeSkeleton />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col px-4 sm:px-6 lg:px-8 pb-16">
      <div className="flex flex-col items-center justify-center py-12 md:py-16">
        <form onSubmit={handleSearchBtn} className="w-full max-w-2xl relative">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
            </div>
            <input
              type="text"
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all shadow-sm "
              placeholder="Search for clothes, tech, art..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.currentTarget.value)}
            />
            <button
              type="submit"
              className="absolute inset-y-2 right-2 px-6 bg-gray-900 text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Featured Products</h2>
          <span className="text-sm text-gray-500 font-medium">{allItems.length} items</span>
        </div>

        {allItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allItems.map((item: any) => (
              <Item key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="w-full py-20 flex flex-col items-center justify-center text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <ShoppingBag className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">No items found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your search to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
