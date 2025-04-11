import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm",
        className,
      )}
    >
      <div className="shimmer aspect-[3/4] w-full" />
      <div className="p-4 space-y-3">
        <div className="shimmer h-6 w-3/4 rounded" />
        <div className="shimmer h-4 w-1/2 rounded" />
        <div className="shimmer h-10 w-full rounded mt-4" />
      </div>
    </div>
  );
}

export function SkeletonProductGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
