// Composant Divider réutilisable

interface DividerProps {
  text?: string;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export default function Divider({
  text,
  orientation = "horizontal",
  className = "",
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        className={`w-px h-full bg-gray-200 dark:bg-gray-700 ${className}`}
        role="separator"
        aria-orientation="vertical"
      />
    );
  }

  if (text) {
    return (
      <div className={`flex items-center gap-4 my-6 ${className}`}>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          {text}
        </span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
      </div>
    );
  }

  return (
    <div
      className={`h-px bg-gray-200 dark:bg-gray-700 my-6 ${className}`}
      role="separator"
      aria-orientation="horizontal"
    />
  );
}

