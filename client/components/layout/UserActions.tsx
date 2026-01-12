import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Bell, LogOut, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserActionsProps {
  userRole: string | null;
  userName: string;
  unreadCount: number;
  isNotificationPanelOpen: boolean;
  setIsNotificationPanelOpen: (open: boolean) => void;
  handleLogout: () => void;
  handleSettings: () => void;
  handleProfile: () => void;
  handleAccount: () => void;
  handleShoppingBagContextMenu: (e: React.MouseEvent) => void;
  handleNotificationClick: () => void;
}

export function UserActions({
  userRole,
  userName,
  unreadCount,
  isNotificationPanelOpen,
  setIsNotificationPanelOpen,
  handleLogout,
  handleSettings,
  handleProfile,
  handleAccount,
  handleShoppingBagContextMenu,
  handleNotificationClick,
}: UserActionsProps) {
  const navigate = useNavigate();

  if (!userRole) {
    return (
      <div className="hidden lg:flex gap-2">
        <Link to="/login">
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        </Link>
        <Link to="/login">
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Get Started
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {/* Notifications */}
      <button
        onClick={handleNotificationClick}
        className="relative p-2 text-muted-foreground hover:text-foreground transition-colors lg:flex hidden"
        title={
          userRole === "designer" ? "Sales Notifications" : "Notifications"
        }
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-destructive text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Shopping Cart - Only available for customers */}
      {userRole === "customer" && (
        <button
          onClick={() => navigate("/orders")}
          onContextMenu={handleShoppingBagContextMenu}
          className="relative p-2 text-muted-foreground hover:text-foreground transition-colors lg:flex hidden cursor-pointer"
          title="View Orders & Shopping Cart (Right-click for options)"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount || 0}
          </span>
        </button>
      )}

      {/* User Info & Actions */}
      <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-border">
        <div className="flex flex-col text-right">
          <button
            onClick={() => {
              // Navigate to appropriate dashboard based on role
              if (userRole === "seamstress") {
                navigate("/seamstress-dashboard");
              } else if (userRole === "designer") {
                navigate("/designer-dashboard");
              } else if (userRole === "customer") {
                navigate("/customer-dashboard");
              } else if (userRole === "admin") {
                navigate("/admin-dashboard");
              } else {
                navigate("/profile");
              }
            }}
            className="text-sm font-medium text-foreground hover:text-primary transition-colors text-right"
            title={`Go to ${userRole} dashboard`}
          >
            {userName || "User"}
          </button>
          <span className="text-xs text-muted-foreground capitalize">
            {userRole}
          </span>
        </div>

        {/* Designer specific buttons */}
        {userRole === "designer" && (
          <>
            <button
              onClick={handleProfile}
              className="p-2 text-muted-foreground hover:text-primary transition-colors"
              title="Profile"
            >
              <User className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Seamstress specific buttons */}
        {userRole === "SEAMSTRESS" && (
          <button
            onClick={() => navigate("/seamstress-catalog")}
            className="p-2 text-muted-foreground hover:text-primary transition-colors"
            title="My Listings"
          >
            My Catalog
          </button>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="p-2 text-muted-foreground hover:text-destructive transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
