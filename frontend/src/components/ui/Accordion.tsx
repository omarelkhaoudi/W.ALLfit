// Composant Accordion réutilisable

"use client";
import { ReactNode, useState } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  defaultOpen?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
  variant?: "default" | "bordered";
}

export default function Accordion({
  items,
  allowMultiple = false,
  className = "",
  variant = "default",
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(
    items.filter(item => item.defaultOpen).map(item => item.id)
  );

  const toggleItem = (itemId: string) => {
    setOpenItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return allowMultiple ? [...prev, itemId] : [itemId];
      }
    });
  };

  const variantClasses = {
    default: "bg-transparent",
    bordered: "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden",
  };

  return (
    <div className={`w-full space-y-2 ${className}`}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);
        const isDisabled = item.disabled;

        return (
          <div
            key={item.id}
            className={variantClasses[variant]}
          >
            <button
              onClick={() => !isDisabled && toggleItem(item.id)}
              disabled={isDisabled}
              className={`
                w-full px-6 py-4 flex items-center justify-between gap-4
                transition-all cursor-pointer
                ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 dark:hover:bg-gray-700/50"}
                ${variant === "bordered" ? "" : "border-b border-gray-200 dark:border-gray-700 last:border-b-0"}
              `}
              aria-expanded={isOpen}
              aria-disabled={isDisabled}
            >
              <div className="flex items-center gap-3 flex-1 text-left">
                {item.icon && (
                  <span className="flex-shrink-0 text-gray-600 dark:text-gray-400">
                    {item.icon}
                  </span>
                )}
                <span className="font-extrabold text-gray-900 dark:text-white uppercase tracking-wide">
                  {item.title}
                </span>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform flex-shrink-0 ${
                  isOpen ? "transform rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div
                className={`
                  px-6 pb-4 pt-2
                  ${variant === "bordered" ? "border-t border-gray-200 dark:border-gray-700" : ""}
                `}
              >
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {item.content}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

