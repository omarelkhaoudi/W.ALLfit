// Composant Alert réutilisable

import { ReactNode } from "react";
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from "lucide-react";

interface AlertProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "danger" | "info";
  title?: string;
  onClose?: () => void;
  className?: string;
}

export default function Alert({
  children,
  variant = "default",
  title,
  onClose,
  className = "",
}: AlertProps) {
  const variantStyles = {
    default: {
      container: "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700",
      icon: "text-gray-600 dark:text-gray-400",
      title: "text-gray-900 dark:text-white",
      text: "text-gray-700 dark:text-gray-300",
    },
    success: {
      container: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
      icon: "text-green-600 dark:text-green-400",
      title: "text-green-900 dark:text-green-300",
      text: "text-green-700 dark:text-green-300",
    },
    warning: {
      container: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
      icon: "text-yellow-600 dark:text-yellow-400",
      title: "text-yellow-900 dark:text-yellow-300",
      text: "text-yellow-700 dark:text-yellow-300",
    },
    error: {
      container: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
      icon: "text-red-600 dark:text-red-400",
      title: "text-red-900 dark:text-red-300",
      text: "text-red-700 dark:text-red-300",
    },
    info: {
      container: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
      icon: "text-blue-600 dark:text-blue-400",
      title: "text-blue-900 dark:text-blue-300",
      text: "text-blue-700 dark:text-blue-300",
    },
  };

  const icons = {
    default: AlertCircle,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
    info: Info,
  };

  // Normaliser "danger" vers "error" pour la compatibilité
  const normalizedVariant = variant === "danger" ? "error" : (variant || "default");
  
  const Icon = icons[normalizedVariant] || icons.default;
  const styles = variantStyles[normalizedVariant] || variantStyles.default;

  return (
    <div
      className={`
        ${styles.container}
        border-2 rounded-2xl p-4 flex items-start gap-3
        ${className}
      `}
      role="alert"
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${styles.icon}`} />
      <div className="flex-1">
        {title && (
          <h4 className={`font-extrabold mb-1 uppercase tracking-wide ${styles.title}`}>
            {title}
          </h4>
        )}
        <div className={`text-sm font-semibold ${styles.text}`}>
          {children}
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`flex-shrink-0 ${styles.icon} hover:opacity-70 transition`}
          aria-label="Fermer l'alerte"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

