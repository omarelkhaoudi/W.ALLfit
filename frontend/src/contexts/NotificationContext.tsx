"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import NotificationItem, { Notification, NotificationType } from "@/components/ui/Notification";

interface NotificationContextType {
  showNotification: (type: NotificationType, title: string, message?: string, duration?: number) => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const showNotification = useCallback(
    (type: NotificationType, title: string, message?: string, duration?: number) => {
      const id = Math.random().toString(36).substring(2, 9);
      setNotifications((prev) => [...prev, { id, type, title, message, duration }]);
    },
    []
  );

  const showSuccess = useCallback(
    (title: string, message?: string) => {
      showNotification("success", title, message);
    },
    [showNotification]
  );

  const showError = useCallback(
    (title: string, message?: string) => {
      showNotification("error", title, message, 5000);
    },
    [showNotification]
  );

  const showInfo = useCallback(
    (title: string, message?: string) => {
      showNotification("info", title, message);
    },
    [showNotification]
  );

  const showWarning = useCallback(
    (title: string, message?: string) => {
      showNotification("warning", title, message);
    },
    [showNotification]
  );

  return (
    <NotificationContext.Provider
      value={{ showNotification, showSuccess, showError, showInfo, showWarning }}
    >
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col items-end pointer-events-none">
        <div className="pointer-events-auto">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClose={removeNotification}
            />
          ))}
        </div>
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
}

