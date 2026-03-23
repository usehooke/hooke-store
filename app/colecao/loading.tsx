export default function LoadingCollection() {
  return (
    <div className="bg-white min-h-screen pb-20 animate-pulse">
      <div className="w-full px-6 md:px-12 pt-12 md:pt-24 pb-12">
        <div className="h-4 w-24 bg-gray-200 mb-6 rounded-sm"></div>
        <div className="h-16 md:h-24 w-3/4 max-w-lg bg-gray-200 mb-6 rounded-sm"></div>
        <div className="h-4 md:h-6 w-full max-w-2xl bg-gray-100 rounded-sm mb-2"></div>
        <div className="h-4 md:h-6 w-2/3 max-w-lg bg-gray-100 rounded-sm"></div>
      </div>
      <div className="border-t border-b border-gray-100 px-6 md:px-12 py-4 flex justify-between">
        <div className="h-4 w-20 bg-gray-200 rounded-sm"></div>
        <div className="h-8 w-24 bg-gray-200 rounded-sm"></div>
      </div>
      <div className="w-full px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="w-full">
              <div className="w-full aspect-[3/4] bg-gray-100 mb-4 rounded-md"></div>
              <div className="h-4 w-3/4 bg-gray-200 mb-2 rounded-sm"></div>
              <div className="h-6 w-1/4 bg-gray-200 mb-2 rounded-sm"></div>
              <div className="h-3 w-1/2 bg-gray-100 rounded-sm"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
