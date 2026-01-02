export function DramaCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px]">
      <div className="aspect-[2/3] rounded-lg animate-shimmer" />
    </div>
  );
}

export function DramaRowSkeleton({ count = 7 }: { count?: number }) {
  return (
    <section className="py-4 md:py-6">
      <div className="flex items-center gap-2 mb-4 px-4 md:px-8">
        <div className="w-5 h-5 rounded animate-shimmer" />
        <div className="w-32 h-6 rounded animate-shimmer" />
      </div>
      <div className="flex gap-3 overflow-hidden px-4 md:px-8">
        {Array.from({ length: count }).map((_, i) => (
          <DramaCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

export function PlayerSkeleton() {
  return (
    <div className="w-full h-full bg-background">
      <div className="aspect-[9/16] max-h-[80vh] animate-shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-6 w-3/4 rounded animate-shimmer" />
        <div className="h-4 w-full rounded animate-shimmer" />
        <div className="h-4 w-2/3 rounded animate-shimmer" />
      </div>
    </div>
  );
}
