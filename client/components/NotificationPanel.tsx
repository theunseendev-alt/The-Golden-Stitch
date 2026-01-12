import {
  X,
  Bell,
  MessageCircle,
  Package,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Package className="w-5 h-5 text-blue-600" />;
      case "message":
        return <MessageCircle className="w-5 h-5 text-green-600" />;
      case "system":
        return <Bell className="w-5 h-5 text-purple-600" />;
      case "alert":
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - notificationTime.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    if (notification.action?.href) {
      navigate(notification.action.href);
      onClose();
    }
  };

  const filteredNotifications = notifications;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Notifications</h2>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close notifications panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Actions */}
          {unreadCount > 0 && (
            <div className="p-4 border-b border-gray-200">
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="w-full"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Mark all as read
              </Button>
            </div>
          )}

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Bell className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-center">No notifications yet</p>
                <p className="text-sm text-center mt-1">
                  You'll see updates about your orders and activities here
                </p>
              </div>
            ) : (
              <div className="p-2">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 mb-2 rounded-lg border transition-colors cursor-pointer hover:bg-gray-50 ${
                      notification.read
                        ? "bg-white"
                        : "bg-blue-50 border-blue-200"
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h3
                            className={`text-sm font-medium ${
                              notification.read
                                ? "text-gray-900"
                                : "text-gray-900 font-semibold"
                            }`}
                          >
                            {notification.title}
                          </h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="flex-shrink-0 p-1 hover:bg-gray-200 rounded transition-colors"
                            aria-label="Delete notification"
                          >
                            <X className="w-3 h-3 text-gray-400" />
                          </button>
                        </div>
                        <p
                          className={`text-sm mt-1 ${
                            notification.read
                              ? "text-gray-600"
                              : "text-gray-700"
                          }`}
                        >
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                          {notification.action && (
                            <div className="flex items-center gap-1 text-xs text-primary hover:text-primary/80">
                              <span>{notification.action.label}</span>
                              <ExternalLink className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {!notification.read && (
                      <div className="absolute top-2 right-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              Notification preferences can be managed in your account settings
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
