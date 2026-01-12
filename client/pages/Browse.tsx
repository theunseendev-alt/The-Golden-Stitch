import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, Eye, Settings } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type ViewMode = "customer" | "seamstress";

export default function Browse() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>("customer");

  // Check if user is admin
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role?.toLowerCase() === "admin";
  const userRole = user.role || null;
  const userName = user.name || "Guest";

  // Redirect non-admin users
  if (!isAdmin) {
    return (
      <Layout userRole={userRole} userName={userName}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-secondary mb-4">
              Access Restricted
            </h1>
            <p className="text-muted-foreground mb-6">
              This page is only accessible to administrators.
            </p>
            <Button onClick={() => navigate("/")}>Return to Home</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const getViewModeDescription = () => {
    switch (viewMode) {
      case "customer":
        return "Customer view shows how customers browse designs, view seamstresses, and place orders.";
      case "seamstress":
        return "Seamstress view shows how seamstresses browse designs, set prices, and manage their offerings.";
      default:
        return "";
    }
  };

  const handleNavigateToView = () => {
    switch (viewMode) {
      case "customer":
        navigate("/browse/customer");
        break;
      case "seamstress":
        navigate("/browse/seamstress");
        break;
    }
  };

  return (
    <Layout userRole={userRole} userName={userName}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-secondary">
                Browse Simulator
              </h1>
              <p className="text-lg text-muted-foreground">
                Admin interface to preview user experiences
              </p>
            </div>
          </div>
        </div>

        {/* View Mode Selector */}
        <div className="bg-white border border-border rounded-lg p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Settings className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-secondary">
              Preview Mode
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <button
              onClick={() => handleViewModeChange("customer")}
              className={`p-4 rounded-lg border-2 transition-all ${
                viewMode === "customer"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-6 h-6 text-primary" />
                <span className="font-semibold text-secondary">
                  Customer View
                </span>
              </div>
              <p className="text-sm text-muted-foreground text-left">
                Preview how customers browse designs and interact with
                seamstresses
              </p>
            </button>

            <button
              onClick={() => handleViewModeChange("seamstress")}
              className={`p-4 rounded-lg border-2 transition-all ${
                viewMode === "seamstress"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <UserCheck className="w-6 h-6 text-primary" />
                <span className="font-semibold text-secondary">
                  Seamstress View
                </span>
              </div>
              <p className="text-sm text-muted-foreground text-left">
                Preview how seamstresses browse designs and set their prices
              </p>
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              <strong>Current View:</strong> {getViewModeDescription()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button
            onClick={handleNavigateToView}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Eye className="w-4 h-4 mr-2" />
            Enter {viewMode === "customer" ? "Customer" : "Seamstress"} Browse
            Mode
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/browse/seamstress")}
            className="border-primary text-primary hover:bg-primary/10"
          >
            Browse Seamstress Designs
          </Button>
        </div>

        {/* Info Panel */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-8">
          <h3 className="text-xl font-bold text-secondary mb-3">
            Admin Browse Simulator
          </h3>
          <p className="text-muted-foreground mb-4">
            This interface allows administrators to preview and test the user
            experience from different perspectives. Use the view switcher above
            to see how customers and seamstresses interact with the browse
            functionality.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-secondary mb-2">
                Customer Experience
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Browse designs with favorite/save functionality</li>
                <li>• View and compare seamstress options</li>
                <li>• Place orders and manage cart</li>
                <li>• Save favorite designs</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-secondary mb-2">
                Seamstress Experience
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Browse designs they can potentially make</li>
                <li>• Set pricing and difficulty ratings</li>
                <li>• Save favorite designers</li>
                <li>• Manage their offerings and availability</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              <strong>Note:</strong> This is a simulation mode. Changes made in
              either view will not affect real user data. Use this for testing
              and quality assurance purposes.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
