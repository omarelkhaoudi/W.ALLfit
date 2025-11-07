// Composant Tooltip réutilisable

"use client";

import { ReactNode, useState } from "react";

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

export default function Tooltip({
  children,
  content,
  position = "top",
  delay = 200,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsVisible(false);
  };

  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top: "top-full left-1/2 transform -translate-x-1/2 border-t-gray-900 dark:border-t-gray-100 border-l-transparent border-r-transparent border-b-transparent",
    bottom: "bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-900 dark:border-b-gray-100 border-l-transparent border-r-transparent border-t-transparent",
    left: "left-full top-1/2 transform -translate-y-1/2 border-l-gray-900 dark:border-l-gray-100 border-t-transparent border-b-transparent border-r-transparent",
    right: "right-full top-1/2 transform -translate-y-1/2 border-r-gray-900 dark:border-r-gray-100 border-t-transparent border-b-transparent border-l-transparent",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-50 ${positionClasses[position]} pointer-events-none`}
          role="tooltip"
        >
          <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-semibold px-3 py-2 rounded-lg shadow-xl whitespace-nowrap">
            {content}
            <div
              className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}

