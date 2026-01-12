import { useState, useEffect, createContext, useContext } from "react";
import { apiService, AppNotification } from "@/lib/api";
import { setNotificationCallback } from "@/lib/orders";

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (
    notification: Omit<AppNotification, "id" | "timestamp" | "read">,
  ) => void;
  deleteNotification: (id: string) => void;
  isNotificationPanelOpen: boolean;
  setIsNotificationPanelOpen: (open: boolean) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider",
    );
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load notifications on mount and when user logs in
  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getNotifications();
      setNotifications(response.notifications);
    } catch (error) {
      console.error("Error loading notifications:", error);
      // If API fails, clear notifications
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load unread count
  const loadUnreadCount = async () => {
    try {
      const response = await apiService.getUnreadNotificationCount();
      setUnreadCount(response.count);
    } catch (error) {
      console.error("Error loading unread count:", error);
      setUnreadCount(0);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await apiService.markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification,
        ),
      );
      // Update unread count
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiService.markAllNotificationsAsRead();
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true })),
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const addNotification = async (
    notificationData: Omit<AppNotification, "id" | "timestamp" | "read">,
  ) => {
    try {
      // Since createNotification doesn't exist, we'll add it locally
      const newNotification: AppNotification = {
        id: Date.now().toString(),
        userId: notificationData.userId,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        read: false,
        action: notificationData.action || null,
        timestamp: new Date().toISOString(),
      };

      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => Math.min(prev + 1, 99));

      // Show browser notification if permission granted
      if (
        "Notification" in window &&
        (window as any).Notification.permission === "granted"
      ) {
        new (window as any).Notification(notificationData.title, {
          body: notificationData.message,
          icon: "/favicon.ico",
        });
      }
    } catch (error) {
      console.error("Error creating notification:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await apiService.deleteNotification(id);
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id),
      );
      // Update unread count if deleted notification was unread
      const deletedNotification = notifications.find((n) => n.id === id);
      if (deletedNotification && !deletedNotification.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // Request notification permission on mount
  useEffect(() => {
    if (
      "Notification" in window &&
      (window as any).Notification.permission === "default"
    ) {
      (window as any).Notification.requestPermission();
    }
  }, []);

  // Set up callback for order notifications
  useEffect(() => {
    setNotificationCallback((notification) => {
      addNotification(notification);
    });
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
        deleteNotification,
        isNotificationPanelOpen,
        setIsNotificationPanelOpen,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
