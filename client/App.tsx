import "./global.css";

import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { NotificationProvider } from "./hooks/useNotifications";
import { NotesProvider } from "./hooks/useNotes";
import NotesPanel from "./components/NotesPanel";

import CookieConsentBanner from "./components/ui/CookieConsentBanner";

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Page imports
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChooseRole from "./pages/ChooseRole";
import Browse from "./pages/Browse";
import CustomerDashboard from "./pages/CustomerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AccountManagement from "./pages/AccountManagement";
import DesignerDashboard from "./pages/DesignerDashboard";
import DesignerEarnings from "./pages/DesignerEarnings";
import DesignerUpload from "./pages/DesignerUpload";
import SeamstressDashboard from "./pages/SeamstressDashboard";
import Seamstresses from "./pages/Seamstresses";
import SavedDesigns from "./pages/SavedDesigns";
import README from "./pages/README";
import HowItWorks from "./pages/HowItWorks";
import BecomeCustomer from "./pages/BecomeCustomer";
import BecomeDesigner from "./pages/BecomeDesigner";
import BecomeSeamstress from "./pages/BecomeSeamstress";
import Contact from "./pages/Contact";
import About from "./pages/About";
import BrowseCustomer from "./pages/BrowseCustomer";
import BrowseSeamstress from "./pages/BrowseSeamstress";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Profile from "./pages/Profile";
import SetPriceDifficulty from "./pages/SetPriceDifficulty";
import OrderPlacement from "./pages/OrderPlacement";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancelled from "./pages/PaymentCancelled";
import SeamstressCatalog from "./pages/SeamstressCatalog";
import OrderDetails from "./pages/OrderDetails";

const App = () => (
  <NotesProvider>
    <NotificationProvider>
      <ScrollToTop />
      <Routes>
        {/* Main pages */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/choose-role" element={<ChooseRole />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/browse/customer" element={<BrowseCustomer />} />
        <Route path="/browse/seamstress" element={<BrowseSeamstress />} />
        <Route path="/seamstresses" element={<Seamstresses />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/set-price-difficulty/:designId" element={<SetPriceDifficulty />} />
        <Route path="/order-placement" element={<OrderPlacement />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancelled" element={<PaymentCancelled />} />

        {/* Documentation */}
        <Route path="/README" element={<README />} />

        {/* Dashboard pages */}
        <Route path="/orders" element={<CustomerDashboard />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/designer-dashboard" element={<DesignerDashboard />} />
        <Route path="/designer-upload" element={<DesignerUpload />} />
        <Route path="/designer-earnings" element={<DesignerEarnings />} />
        <Route path="/seamstress-dashboard" element={<SeamstressDashboard />} />
        <Route path="/seamstress-catalog" element={<SeamstressCatalog />} />
        <Route path="/order-details" element={<OrderDetails />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-users" element={<AccountManagement />} />
        <Route path="/account-management" element={<AccountManagement />} />

        {/* Customer features */}
        <Route path="/saved-designs" element={<SavedDesigns />} />

        {/* Information pages */}
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/become-customer" element={<BecomeCustomer />} />
        <Route path="/become-designer" element={<BecomeDesigner />} />
        <Route path="/become-seamstress" element={<BecomeSeamstress />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <CookieConsentBanner />
      <NotesPanel />
    </NotificationProvider>
  </NotesProvider>
);

export default App;
