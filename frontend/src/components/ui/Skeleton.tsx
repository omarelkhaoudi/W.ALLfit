// Composant Skeleton pour les états de chargement

export default function Skeleton({ 
  className = "",
  variant = "default"
}: {
  className?: string;
  variant?: "default" | "text" | "circular" | "rectangular";
}) {
  const baseClasses = "animate-pulse bg-gray-200 dark:bg-gray-700";
  
  const variantClasses = {
    default: "rounded-2xl",
    text: "rounded h-4",
    circular: "rounded-full",
    rectangular: "rounded-none",
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 shadow-lg border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-5">
        <Skeleton className="w-12 h-12" variant="circular" />
        <Skeleton className="w-16 h-6" />
      </div>
      <Skeleton className="h-8 w-24 mb-2" variant="text" />
      <Skeleton className="h-4 w-32" variant="text" />
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 p-5 rounded-xl border border-gray-200 dark:border-gray-600"
        >
          <Skeleton className="h-6 w-32 mb-3" variant="text" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-20" variant="text" />
            <Skeleton className="h-4 w-20" variant="text" />
          </div>
        </div>
      ))}
    </div>
  );
}

