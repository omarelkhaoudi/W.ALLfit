// Composant Input réutilisable avec accessibilité

"use client";
import { InputHTMLAttributes, ReactNode, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export default function Input({
  label,
  error,
  icon,
  className = "",
  id,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-extrabold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            w-full px-5 py-4 border-2 rounded-2xl bg-white dark:bg-gray-700 
            text-gray-900 dark:text-white font-semibold
            focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 
            focus:border-gray-900 dark:focus:border-gray-100 transition
            ${error ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"}
            ${icon ? "pl-12" : ""}
            ${className}
          `}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-2 text-sm text-red-600 dark:text-red-400 font-semibold"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

