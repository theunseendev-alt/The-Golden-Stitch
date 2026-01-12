import { Link, useNavigate } from "react-router-dom";
import { Bell, Settings, User, CreditCard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileNavigationProps {
  userRole: string | null;
  userName: string;
  unreadCount: number;
  getNavLinks: () => Array<{ href: string; label: string }>;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  handleNotificationClick: () => void;
  handleSettings: () => void;
  handleProfile: () => void;
  handleAccount: () => void;
  handleLogout: () => void;
}

export function MobileNavigation({
  userRole,
  userName,
  unreadCount,
  getNavLinks,
  isMenuOpen,
  setIsMenuOpen,
  handleNotificationClick,
  handleSettings,
  handleProfile,
  handleAccount,
  handleLogout,
}: MobileNavigationProps) {
  const navigate = useNavigate();

  if (!isMenuOpen) return null;

  return (
    <nav className="lg:hidden pb-4 border-t border-border">
      <div className="flex flex-col gap-3 pt-4">
        {getNavLinks().map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className="text-foreground hover:text-primary transition-colors font-medium px-2 py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}

        {userRole ? (
          <>
            {/* Mobile Notifications Button */}
            <button
              onClick={() => {
                handleNotificationClick();
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-2 px-2 py-2 text-foreground hover:text-primary transition-colors font-medium"
            >
              <Bell className="w-4 h-4" />
              {userRole === "designer" ? "Sales" : "Notifications"}
              {unreadCount > 0 && (
                <span className="bg-destructive text-white text-xs rounded-full px-2 py-1">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Designer specific mobile buttons */}
            {userRole === "designer" && (
              <>
                <button
                  onClick={() => {
                    handleProfile();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-2 py-2 text-foreground hover:text-primary transition-colors font-medium"
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button
                  onClick={() => {
                    handleAccount();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-2 py-2 text-foreground hover:text-primary transition-colors font-medium"
                >
                  <CreditCard className="w-4 h-4" />
                  Account
                </button>
              </>
            )}

            {/* Mobile Settings Button */}
            <button
              onClick={() => {
                handleSettings();
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-2 px-2 py-2 text-foreground hover:text-primary transition-colors font-medium"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>

            {/* Mobile Logout Button */}
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-2 px-2 py-2 text-muted-foreground hover:text-destructive transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </>
        ) : (
          <div className="flex flex-col gap-2 pt-2">
            <Link to="/login">
              <Button variant="outline" size="sm" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="sm"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Get Started
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
