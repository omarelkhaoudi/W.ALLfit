// Composant Skeleton Loader amélioré et réutilisable

interface SkeletonLoaderProps {
  variant?: "text" | "circular" | "rectangular" | "card" | "list" | "table";
  width?: string | number;
  height?: string | number;
  className?: string;
  count?: number;
  animation?: "pulse" | "wave" | "none";
}

export default function SkeletonLoader({
  variant = "rectangular",
  width,
  height,
  className = "",
  count = 1,
  animation = "pulse",
}: SkeletonLoaderProps) {
  const baseClasses = `bg-gray-200 dark:bg-gray-700 rounded ${
    animation === "pulse" ? "animate-pulse" : animation === "wave" ? "animate-shimmer" : ""
  }`;

  const variantClasses = {
    text: "h-4",
    circular: "rounded-full",
    rectangular: "",
    card: "rounded-2xl p-6 space-y-4",
    list: "rounded-lg p-4 space-y-3",
    table: "rounded-lg h-12",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  const skeletonElement = (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
      aria-label="Chargement..."
      role="status"
    >
      <span className="sr-only">Chargement...</span>
    </div>
  );

  if (count === 1) {
    return skeletonElement;
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{skeletonElement}</div>
      ))}
    </div>
  );
}

// Composants pré-configurés pour des cas d'usage courants
export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
      <SkeletonLoader variant="rectangular" height={24} width="60%" className="mb-4" />
      <SkeletonLoader variant="text" width="100%" className="mb-2" />
      <SkeletonLoader variant="text" width="80%" />
    </div>
  );
}

export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex items-center gap-4"
        >
          <SkeletonLoader variant="circular" width={48} height={48} />
          <div className="flex-1 space-y-2">
            <SkeletonLoader variant="text" width="40%" />
            <SkeletonLoader variant="text" width="60%" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, index) => (
          <SkeletonLoader key={index} variant="text" width="100%" height={20} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <SkeletonLoader key={colIndex} variant="text" width="100%" height={16} />
          ))}
        </div>
      ))}
    </div>
  );
}

