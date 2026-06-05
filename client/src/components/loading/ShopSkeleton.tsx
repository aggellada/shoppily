export default function ShopSkeleton() {
  // Rendering 8 skeleton cards to keep the grid looking full on large screens
  const skeletonCards = Array.from({ length: 8 });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      {/* 1. Shop Header Banner Skeleton */}
      <div className="py-12 md:py-16 px-8 bg-white my-6 drop-shadow-xl rounded-2xl flex flex-col items-center justify-center border-2 border-gray-100">
        <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse mb-4" />

        <div className="h-9 md:h-10 w-64 md:w-80 bg-gray-200 rounded-lg animate-pulse" />

        <div className="h-5 w-56 bg-gray-200 rounded-md animate-pulse mt-3" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {skeletonCards.map((_, index) => (
          <div
            key={index}
            className="bg-[#FFFFFF] p-4 flex flex-col h-full gap-1 rounded-2xl border-2 border-gray-200 drop-shadow-lg"
          >
            <div className="w-full h-48 bg-gray-200 rounded-lg animate-pulse mb-2" />

            <div className="flex justify-between gap-2 mt-1">
              <div className="h-6 w-2/3 bg-gray-200 rounded-md animate-pulse" />
              <div className="h-6 w-12 bg-gray-200 rounded-md animate-pulse shrink-0" />
            </div>

            <div className="h-5 w-1/4 bg-gray-200 rounded-md animate-pulse mt-1" />

            <div className="h-4 w-full bg-gray-200 rounded-md animate-pulse mt-1" />
            <div className="h-4 w-5/6 bg-gray-200 rounded-md animate-pulse" />

            <div className="mt-auto pt-2">
              <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
