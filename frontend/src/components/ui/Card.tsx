// Composant Card réutilisable

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  onClick?: () => void;
}

export default function Card({
  children,
  className = "",
  hover = false,
  padding = "md",
  onClick,
}: CardProps) {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700
        shadow-lg ${hover ? "hover:shadow-2xl hover:scale-105" : ""} transition-all
        ${onClick ? "cursor-pointer" : ""}
        ${paddingClasses[padding]} ${className}
      `}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return (
    <div className={`mb-6 ${className}`}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className = "" }: CardTitleProps) {
  return (
    <h3 className={`text-xl font-extrabold text-gray-900 dark:text-white uppercase tracking-wide ${className}`}>
      {children}
    </h3>
  );
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className = "" }: CardDescriptionProps) {
  return (
    <p className={`text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-2 ${className}`}>
      {children}
    </p>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

export function CardContent({ children, className = "", padding = "none" }: CardContentProps) {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div className={`${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = "" }: CardFooterProps) {
  return (
    <div className={`mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
}

