// Composant Dropdown réutilisable

"use client";
import { ReactNode, useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";

interface DropdownItem {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "danger";
}

interface DropdownProps {
  items: DropdownItem[];
  trigger?: ReactNode;
  align?: "left" | "right";
  className?: string;
}

export default function Dropdown({
  items,
  trigger,
  align = "right",
  className = "",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled) {
      item.onClick();
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        aria-label="Menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {trigger || <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
      </button>

      {isOpen && (
        <div
          className={`
            absolute z-50 mt-2 min-w-[200px] bg-white dark:bg-gray-800 
            border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl
            ${align === "right" ? "right-0" : "left-0"}
          `}
          role="menu"
        >
          <div className="py-2">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                className={`
                  w-full px-4 py-3 flex items-center gap-3 text-left
                  transition text-sm font-semibold
                  ${
                    item.variant === "danger"
                      ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  }
                  ${item.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                  first:rounded-t-xl last:rounded-b-xl
                `}
                role="menuitem"
              >
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

