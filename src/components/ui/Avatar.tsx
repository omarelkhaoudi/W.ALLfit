// Composant Avatar réutilisable

"use client";
import { useState } from "react";
import { User } from "lucide-react";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  fallback?: React.ReactNode;
}

export default function Avatar({
  src,
  alt,
  name,
  size = "md",
  className = "",
  fallback,
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    sm: { class: "w-8 h-8 text-xs", pixels: 32 },
    md: { class: "w-12 h-12 text-sm", pixels: 48 },
    lg: { class: "w-16 h-16 text-base", pixels: 64 },
    xl: { class: "w-24 h-24 text-lg", pixels: 96 },
  };

  const getInitials = (name: string): string => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getFallbackContent = () => {
    if (fallback) return fallback;
    if (name) return getInitials(name);
    return <User className="w-1/2 h-1/2" />;
  };

  const shouldShowImage = src && typeof src === "string" && src.trim() !== "" && !imageError;

  return (
    <div
      className={`
        ${sizeClasses[size].class}
        rounded-full bg-gray-200 dark:bg-gray-700
        flex items-center justify-center
        overflow-hidden border-2 border-gray-300 dark:border-gray-600
        ${className}
      `}
      role="img"
      aria-label={alt || name || "Avatar"}
    >
      {shouldShowImage ? (
        <img
          src={src}
          alt={alt || name || "Avatar"}
          width={sizeClasses[size].pixels}
          height={sizeClasses[size].pixels}
          className="w-full h-full object-cover"
          onError={() => {
            setImageError(true);
          }}
          loading="lazy"
        />
      ) : (
        <div className="text-gray-600 dark:text-gray-300 font-extrabold flex items-center justify-center w-full h-full">
          {typeof getFallbackContent() === "string" ? (
            <span>{getFallbackContent()}</span>
          ) : (
            getFallbackContent()
          )}
        </div>
      )}
    </div>
  );
}

interface AvatarGroupProps {
  children: React.ReactNode;
  className?: string;
  max?: number;
}

export function AvatarGroup({ children, max = 3, className = "" }: AvatarGroupProps) {
  return (
    <div className={`flex -space-x-2 ${className}`}>
      {children}
    </div>
  );
}

