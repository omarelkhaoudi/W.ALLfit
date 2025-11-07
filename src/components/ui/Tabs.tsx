// Composant Tabs réutilisable

"use client";
import { ReactNode, useState, useId } from "react";

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
  variant?: "default" | "pills" | "underline";
}

export default function Tabs({
  tabs,
  defaultTab,
  onChange,
  className = "",
  variant = "default",
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || "");
  const tabsId = useId();

  const handleTabChange = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab && !tab.disabled) {
      setActiveTab(tabId);
      onChange?.(tabId);
    }
  };

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  const variantClasses = {
    default: {
      container: "border-b-2 border-gray-200 dark:border-gray-700",
      tab: (isActive: boolean) =>
        `px-6 py-3 border-b-2 transition ${
          isActive
            ? "border-gray-900 dark:border-gray-100 text-gray-900 dark:text-white font-extrabold"
            : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-semibold"
        }`,
    },
    pills: {
      container: "bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl",
      tab: (isActive: boolean) =>
        `px-6 py-2 rounded-xl transition ${
          isActive
            ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-extrabold shadow-md"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-semibold"
        }`,
    },
    underline: {
      container: "border-b border-gray-200 dark:border-gray-700",
      tab: (isActive: boolean) =>
        `px-6 py-3 transition relative ${
          isActive
            ? "text-gray-900 dark:text-white font-extrabold"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-semibold"
        } ${
          isActive
            ? "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gray-900 dark:after:bg-gray-100"
            : ""
        }`,
    },
  };

  const classes = variantClasses[variant];

  return (
    <div className={`w-full ${className}`}>
      <div
        role="tablist"
        className={`flex items-center gap-2 overflow-x-auto ${classes.container}`}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`${tabsId}-panel-${tab.id}`}
              id={`${tabsId}-tab-${tab.id}`}
              onClick={() => handleTabChange(tab.id)}
              disabled={tab.disabled}
              className={`
                ${classes.tab(isActive)}
                ${tab.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                flex items-center gap-2 whitespace-nowrap
              `}
            >
              {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${tabsId}-panel-${activeTab}`}
        aria-labelledby={`${tabsId}-tab-${activeTab}`}
        className="mt-6"
      >
        {activeTabContent}
      </div>
    </div>
  );
}

