import { Link } from "react-router-dom";
import { UserActions } from "./UserActions";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  userRole: string | null;
  userName: string;
  getNavLinks: () => Array<{ href: string; label: string }>;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
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

export function Header({
  userRole,
  userName,
  getNavLinks,
  isMenuOpen,
  setIsMenuOpen,
  unreadCount,
  isNotificationPanelOpen,
  setIsNotificationPanelOpen,
  handleLogout,
  handleSettings,
  handleProfile,
  handleAccount,
  handleShoppingBagContextMenu,
  handleNotificationClick,
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-serif font-bold text-lg">G</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-lg font-serif font-bold text-secondary ml-2">
                The Golden Stitch
              </span>
              <span className="text-xs text-muted-foreground font-medium ml-2">
                Premium Dress Marketplace
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {getNavLinks().map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-foreground hover:text-primary transition-colors font-medium text-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <UserActions
              userRole={userRole}
              userName={userName}
              unreadCount={unreadCount}
              isNotificationPanelOpen={isNotificationPanelOpen}
              setIsNotificationPanelOpen={setIsNotificationPanelOpen}
              handleLogout={handleLogout}
              handleSettings={handleSettings}
              handleProfile={handleProfile}
              handleAccount={handleAccount}
              handleShoppingBagContextMenu={handleShoppingBagContextMenu}
              handleNotificationClick={handleNotificationClick}
            />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-foreground"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
