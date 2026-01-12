import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Palette, Scissors, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ChooseRole() {
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/login");
      return;
    }
    const user = JSON.parse(userStr);
    if (user.selected && user.role) {
      const roleRoutes = {
        customer: '/customer-dashboard',
        designer: '/designer-dashboard',
        seamstress: '/seamstress-dashboard',
        admin: '/admin-dashboard'
      };
      const route = roleRoutes[user.role] || '/';
      navigate(route);
    }
  }, [navigate]);

  // Get current user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserEmail = user.email?.toLowerCase() || "";

  // Define admin emails (you as the owner)
  const adminEmails = ["theunseendev@gmail.com"]; // Owner email for admin access

  // Check if current user is admin
  const isAdmin = adminEmails.includes(currentUserEmail);

  const roles = [
    {
      id: "customer",
      title: "Customer",
      icon: ShoppingBag,
      description:
        "Browse and order custom clothing, purses, and hats from talented designers and seamstresses",
      route: "/customer-dashboard",
      color: "from-primary to-accent",
      features: ["Browse designs", "Order custom items", "Track orders"],
    },
    {
      id: "designer",
      title: "Designer",
      icon: Palette,
      description:
        "Upload your clothing, purse, and hat designs and earn $4 for each design that gets made",
      route: "/become-designer",
      color: "from-accent to-primary",
      features: ["Upload designs", "Track earnings", "View order status"],
    },
    {
      id: "seamstress",
      title: "Seamstress",
      icon: Scissors,
      description:
        "Review designs, choose which ones to make, and set your own prices",
      route: "/become-seamstress",
      color: "from-primary via-accent to-primary",
      features: ["Review designs", "Set pricing", "Manage orders"],
    },
    ...(isAdmin
      ? [
          {
            id: "admin",
            title: "Admin",
            icon: Shield,
            description:
              "Manage users, monitor platform activity, and enforce community standards",
            route: "/admin-dashboard",
            color: "from-secondary to-primary",
            features: ["Manage users", "View analytics", "Enforce rules"],
          },
        ]
      : []),
  ];

  const handleSelectRole = async (role: string, route: string) => {
    try {
      // Update role in backend
      const { apiService } = await import("@/lib/api");
      await apiService.updateRole(role.toUpperCase());

      // Save selected role locally
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, role, selected: true }),
      );
      navigate(route);
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update role. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-secondary mb-4">
            Welcome to The Golden Stitch
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose how you'd like to participate in our community. You can
            manage multiple roles from your account settings.
          </p>
          <div className="mt-4 text-sm text-muted-foreground">
            Logged in as:{" "}
            <span className="font-medium text-primary">{user.email}</span>
          </div>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.id}
                className="bg-white border border-border rounded-lg overflow-hidden hover:border-primary transition-all hover:shadow-lg"
              >
                {/* Header with gradient */}
                <div className={`bg-gradient-to-r ${role.color} h-24`} />

                <div className="p-6">
                  {/* Icon and Title */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-secondary">
                        {role.title}
                      </h3>
                      {role.id === "admin" && (
                        <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mt-1">
                          Owner Only
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground mb-4 text-sm">
                    {role.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {role.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleSelectRole(role.id, role.route)}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Continue as {role.title}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-8 text-center">
          <h3 className="text-lg font-bold text-secondary mb-3">
            Users Cannot Have Multiple Roles
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
            Yes! You can be a customer, designer, and/or seamstress all at the
            same time. Manage all your roles from your account dashboard. Each
            role has its own inbox for notifications and orders.
          </p>

          {!isAdmin && (
            <p className="text-sm text-muted-foreground bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
              💡 <strong>Note:</strong> Admin access is restricted to platform
              owners only. Contact the administrator if you need special
              permissions.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
}
