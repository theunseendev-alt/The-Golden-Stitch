import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "@/lib/api";
import { useNotifications } from "@/hooks/useNotifications";

interface UseLayoutLogicProps {
  propUserRole?: string | null;
  propUserName?: string;
}

export function useLayoutLogic({
  propUserRole = null,
  propUserName = "User",
}: UseLayoutLogicProps = {}) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Auto-detect user from localStorage
  const [userData, setUserData] = useState<{ role?: string; name?: string }>(
    {},
  );

  // Notification hook
  const { unreadCount, isNotificationPanelOpen, setIsNotificationPanelOpen } =
    useNotifications();

  useEffect(() => {
    // Load user data from localStorage on component mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData({
          role: parsedUser.role || null,
          name: parsedUser.name || "User",
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
        // Don't auto-clear invalid data, let user decide
      }
    }
  }, []);

  // Use props if provided, otherwise use localStorage data
  const userRole = propUserRole || userData.role || null;
  const userName = propUserName || userData.name || "User";

  const handleLogout = async () => {
    try {
      // Close notification panel if open
      setIsNotificationPanelOpen(false);

      // Clear all user data from localStorage (all 3 keys used by API service)
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Reset local state
      setUserData({ role: null, name: "User" });

      // Use API service logout for proper cleanup (WebSocket, etc.)
      try {
        await apiService.logout();
      } catch (apiError) {
        // Don't show errors to user, logout locally even if API fails
        console.warn(
          "API logout failed, proceeding with local logout:",
          apiError,
        );
      }

      // Use React Router navigation instead of window.location
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback logout even if there's an error
      try {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/");
      } catch (fallbackError) {
        console.error("Fallback logout failed:", fallbackError);
        // Last resort - full page reload
        window.location.href = "/";
      }
    }
  };

  const handleSettings = () => {
    // Navigate to account management page for admin, or show settings for others
    if (userRole === "admin") {
      navigate("/admin-users");
    } else {
      navigate("/account-management");
    }
  };

  const handleProfile = () => {
    navigate("/account-management");
  };

  const handleAccount = () => {
    navigate("/account-management");
  };

  const handleShoppingBagContextMenu = (e: React.MouseEvent) => {
    if (userRole === "customer") {
      e.preventDefault();
      navigate("/orders");
    }
    // For other roles, allow default context menu
  };

  const handleNotificationClick = () => {
    if (userRole === "designer") {
      // For designers, only show sales notifications
      navigate("/designer-sales");
    } else {
      setIsNotificationPanelOpen(true);
    }
  };

  const getNavLinks = () => {
    const baseLinks = [{ href: "/", label: "Home" }];

    if (!userRole) {
      return [
        ...baseLinks,
        { href: "/browse/customer", label: "Browse Designs" },
      ];
    }

    switch (userRole?.toLowerCase()) {
      case "customer":
        return [
          { href: "/customer-dashboard", label: "My Orders" },
          { href: "/saved-designs", label: "Saved Designs" },
          { href: "/browse/customer", label: "Browse Designs" },
        ];
      case "designer":
        return [
          { href: "/designer-dashboard", label: "My Designs" },
          { href: "/designer-earnings", label: "Earnings" },
        ];
      case "seamstress":
        return [
          { href: "/seamstress-dashboard", label: "Profile" },
          { href: "/browse/seamstress", label: "Browse Designs" },
        ];
      case "admin":
        return [
          ...baseLinks,
          { href: "/browse", label: "Browse Simulator" },
          { href: "/admin-dashboard", label: "Admin Panel" },
          { href: "/admin-users", label: "Manage Users" },
        ];
      default:
        return [
          { href: "/browse/customer", label: "Browse Designs" },
        ];
    }
  };

  return {
    // State
    userRole,
    userName,
    isMenuOpen,
    unreadCount,
    isNotificationPanelOpen,

    // Actions
    setIsMenuOpen,
    setIsNotificationPanelOpen,

    // Handlers
    handleLogout,
    handleSettings,
    handleProfile,
    handleAccount,
    handleShoppingBagContextMenu,
    handleNotificationClick,

    // Utilities
    getNavLinks,
  };
}
