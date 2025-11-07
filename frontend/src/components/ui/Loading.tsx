// Composant de chargement réutilisable

export default function Loading({ 
  message = "Chargement...",
  size = "lg"
}: {
  message?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div
          className={`animate-spin rounded-full border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4 ${sizeClasses[size]}`}
          role="status"
          aria-label="Chargement"
        >
          <span className="sr-only">{message}</span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 font-semibold">{message}</p>
      </div>
    </div>
  );
}

