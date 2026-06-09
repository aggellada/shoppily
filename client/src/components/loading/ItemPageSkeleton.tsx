function ItemPageSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-pulse">
      <div className="h-5 w-20 bg-gray-200 rounded mb-8"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        <div className="w-full">
          <div className="aspect-square w-full bg-gray-200 rounded-3xl border border-gray-100"></div>
        </div>

        <div className="flex flex-col pt-2 md:pt-6">
          <div className="h-10 bg-gray-200 rounded-lg w-3/4 mb-3"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-1/2 mb-6"></div>

          <div className="h-8 bg-gray-200 rounded-md w-20 mb-6"></div>

          <div className="mb-8">
            <div className="h-12 bg-gray-200 rounded-lg w-1/3 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mb-8 flex flex-col gap-3">
            <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>

          <div className="mt-auto">
            <div className="w-full h-14 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemPageSkeleton;
