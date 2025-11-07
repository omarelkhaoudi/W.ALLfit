// Composant Spinner réutilisable

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
}

export default function Spinner({
  size = "md",
  className = "",
  text,
}: SpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-[3px]",
    xl: "w-12 h-12 border-4",
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`
          ${sizeClasses[size]}
          border-gray-300 dark:border-gray-600
          border-t-gray-900 dark:border-t-gray-100
          rounded-full animate-spin
        `}
        role="status"
        aria-label="Chargement"
      >
        <span className="sr-only">Chargement...</span>
      </div>
      {text && (
        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
          {text}
        </p>
      )}
    </div>
  );
}

