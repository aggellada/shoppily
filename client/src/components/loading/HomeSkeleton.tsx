export default function HomeSkeleton() {
  const skeletonCards = Array.from({ length: 8 });

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col px-4 sm:px-6 lg:px-8 pb-16">
      <div className="flex flex-col items-center justify-center py-12 md:py-16">
        <div className="w-full max-w-2xl h-14.5 bg-gray-200 rounded-full animate-pulse shadow-sm" />
      </div>

      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="h-7 w-48 bg-gray-200 rounded-md animate-pulse" />
          <div className="h-5 w-16 bg-gray-200 rounded-md animate-pulse" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {skeletonCards.map((_, index) => (
            <div
              key={index}
              className="bg-white p-4 flex flex-col h-full gap-2 rounded-2xl border-2 border-gray-100 drop-shadow-sm"
            >
              <div className="w-full h-48 bg-gray-200 rounded-lg animate-pulse mb-2" />

              <div className="flex justify-between gap-2 mt-1">
                <div className="h-6 w-2/3 bg-gray-200 rounded-md animate-pulse" />
                <div className="h-6 w-12 bg-gray-200 rounded-md animate-pulse shrink-0" />
              </div>

              <div className="h-5 w-1/4 bg-gray-200 rounded-md animate-pulse mt-1" />

              <div className="h-4 w-full bg-gray-200 rounded-md animate-pulse mt-1" />
              <div className="h-4 w-5/6 bg-gray-200 rounded-md animate-pulse" />

              <div className="h-4 w-1/3 bg-gray-200 rounded-md animate-pulse mt-2" />

              <div className="mt-auto h-10 w-full bg-gray-200 rounded-md animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
