// Composant Select réutilisable

"use client";
import { ReactNode, useId, useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
}

export default function Select({
  label,
  options,
  value,
  onChange,
  placeholder = "Sélectionner...",
  error,
  disabled = false,
  className = "",
  icon,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const selectId = useId();
  const selectRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && listRef.current && focusedIndex >= 0) {
      const focusedElement = listRef.current.children[focusedIndex] as HTMLElement;
      if (focusedElement) {
        focusedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [focusedIndex, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (isOpen && focusedIndex >= 0) {
          const option = options[focusedIndex];
          if (!option.disabled) {
            onChange?.(option.value);
            setIsOpen(false);
          }
        } else {
          setIsOpen(!isOpen);
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex(prev => {
            const next = prev < options.length - 1 ? prev + 1 : prev;
            const nextOption = options[next];
            return nextOption?.disabled ? next + 1 : next;
          });
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex(prev => {
            const next = prev > 0 ? prev - 1 : 0;
            const nextOption = options[next];
            return nextOption?.disabled ? next - 1 : next;
          });
        }
        break;
      case "Escape":
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };

  const handleSelect = (optionValue: string) => {
    if (!disabled) {
      onChange?.(optionValue);
      setIsOpen(false);
      setFocusedIndex(-1);
    }
  };

  return (
    <div className={`w-full ${className}`} ref={selectRef}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-extrabold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <button
          id={selectId}
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={`
            w-full px-5 py-4 border-2 rounded-2xl bg-white dark:bg-gray-700 
            text-gray-900 dark:text-white font-semibold
            focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 
            focus:border-gray-900 dark:focus:border-gray-100 transition
            ${error ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"}
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-gray-400 dark:hover:border-gray-500"}
            ${icon ? "pl-12" : ""}
            flex items-center justify-between gap-3
          `}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${selectId}-error` : undefined}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {icon && (
              <div className="text-gray-400 flex-shrink-0">
                {icon}
              </div>
            )}
            <span className={`truncate ${!selectedOption ? "text-gray-500 dark:text-gray-400" : ""}`}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? "transform rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <ul
            ref={listRef}
            role="listbox"
            className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-2xl shadow-2xl max-h-60 overflow-auto"
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                role="option"
                aria-selected={value === option.value}
                onClick={() => !option.disabled && handleSelect(option.value)}
                className={`
                  px-5 py-3 cursor-pointer transition
                  ${value === option.value 
                    ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900" 
                    : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  }
                  ${option.disabled ? "opacity-50 cursor-not-allowed" : ""}
                  ${focusedIndex === index ? "ring-2 ring-gray-900 dark:ring-gray-100" : ""}
                  flex items-center justify-between gap-3
                `}
              >
                <span className="flex-1">{option.label}</span>
                {value === option.value && (
                  <Check className="w-5 h-5 flex-shrink-0" />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && (
        <p
          id={`${selectId}-error`}
          className="mt-2 text-sm text-red-600 dark:text-red-400 font-semibold"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

