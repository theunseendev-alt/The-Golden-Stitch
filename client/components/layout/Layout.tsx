import { useLayoutLogic } from "./useLayoutLogic";
import { Header } from "./Header";
import { MobileNavigation } from "./MobileNavigation";
import { Footer } from "./Footer";
import { NotificationPanel } from "@/components/NotificationPanel";
import CookieConsentBanner from "@/components/ui/CookieConsentBanner";

interface LayoutProps {
  children: React.ReactNode;
  userRole?: "customer" | "designer" | "seamstress" | "admin" | null;
  userName?: string;
}

export function Layout({
  children,
  userRole: propUserRole = null,
  userName: propUserName = "User",
}: LayoutProps) {
  const {
    userRole,
    userName,
    isMenuOpen,
    unreadCount,
    isNotificationPanelOpen,
    setIsMenuOpen,
    setIsNotificationPanelOpen,
    handleLogout,
    handleSettings,
    handleProfile,
    handleAccount,
    handleShoppingBagContextMenu,
    handleNotificationClick,
    getNavLinks,
  } = useLayoutLogic({ propUserRole, propUserName });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <Header
        userRole={userRole}
        userName={userName}
        getNavLinks={getNavLinks}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
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

      {/* Mobile Navigation */}
      <MobileNavigation
        userRole={userRole}
        userName={userName}
        unreadCount={unreadCount}
        getNavLinks={getNavLinks}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        handleNotificationClick={handleNotificationClick}
        handleSettings={handleSettings}
        handleProfile={handleProfile}
        handleAccount={handleAccount}
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 w-full">{children}</main>

      {/* Footer */}
      <Footer />

      {/* Notifications Panel */}
      <NotificationPanel
        isOpen={isNotificationPanelOpen}
        onClose={() => setIsNotificationPanelOpen(false)}
      />

      {/* Cookie Consent Banner */}
      <CookieConsentBanner />
    </div>
  );
}
