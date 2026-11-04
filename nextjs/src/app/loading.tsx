export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-6 animate-pulse">
        {/* Banner Skeleton */}
        <div className="h-44 bg-slate-200/80 rounded-3xl" />

        {/* Filters Skeleton */}
        <div className="h-14 bg-slate-200/70 rounded-2xl" />

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-56 bg-slate-200/70 rounded-2xl p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-4 w-24 bg-slate-300 rounded" />
                <div className="h-6 w-3/4 bg-slate-300 rounded" />
                <div className="h-4 w-full bg-slate-300 rounded" />
              </div>
              <div className="h-8 w-1/3 bg-slate-300 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

