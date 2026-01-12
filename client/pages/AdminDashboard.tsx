import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Shield, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { StatsGrid } from "@/pages/AdminDashboard/components/StatsGrid";
import { RecentUsersList } from "@/pages/AdminDashboard/components/RecentUsersList";
import { RecentOrdersList } from "@/pages/AdminDashboard/components/RecentOrdersList";
import { apiService } from "@/lib/api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  // Get current user
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const handleAuthExpired = () => {
      navigate("/login");
    };

    window.addEventListener("auth_expired", handleAuthExpired);

    const fetchData = async () => {
      try {
        // Fetch stats
        const statsData = await apiService.getAdminStats();
        setStats([
          {
            title: "Total Users",
            value: statsData.totalUsers.toString(),
            change: "+0%",
            iconName: "Users",
            color: "from-blue-500 to-blue-600",
          },
          {
            title: "Active Designers",
            value: statsData.activeDesigners.toString(),
            change: "+0%",
            iconName: "Palette",
            color: "from-purple-500 to-purple-600",
          },
          {
            title: "Registered Seamstresses",
            value: statsData.registeredSeamstresses.toString(),
            change: "+0%",
            iconName: "Scissors",
            color: "from-green-500 to-green-600",
          },
          {
            title: "Orders This Month",
            value: statsData.ordersThisMonth.toString(),
            change: "+0%",
            iconName: "ShoppingBag",
            color: "from-orange-500 to-orange-600",
          },
          {
            title: "Revenue",
            value: `${statsData.revenue}`,
            change: "+0%",
            iconName: "DollarSign",
            color: "from-emerald-500 to-emerald-600",
          },
          {
            title: "Platform Growth",
            value: statsData.platformGrowth + "%",
            change: "+0%",
            iconName: "TrendingUp",
            color: "from-indigo-500 to-indigo-600",
          },
        ]);

        // Fetch users
        const usersData = await apiService.getUsers();
        const formattedUsers = usersData.users.slice(0, 5).map(u => ({
          name: u.name,
          email: u.email,
          role: u.role,
          status: "Active", // Placeholder
          joined: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Recently",
        }));
        setRecentUsers(formattedUsers);

        // Fetch orders
        const ordersData = await apiService.getOrders();
        const formattedOrders = ordersData.orders.slice(0, 5).map(o => ({
          id: o.id.slice(-8),
          customer: o.customerName,
          designer: o.design?.name.split(' ')[0] || 'Unknown',
          seamstress: o.seamstressName || 'Not Assigned',
          status: o.status,
          value: `${o.totalPrice}`,
        }));
        setRecentOrders(formattedOrders);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    fetchData();

    return () => {
      window.removeEventListener("auth_expired", handleAuthExpired);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleManageUsers = () => {
    alert("User management feature coming soon");
  };

  const handleShutdownServer = async () => {
    if (confirm("Are you sure you want to shut down the server? This will stop the backend service.")) {
      try {
        const response = await fetch('http://localhost:3002/api/shutdown', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          alert("Server shutdown initiated. The backend will stop in a few seconds.");
        } else {
          alert("Failed to shutdown server.");
        }
      } catch (error) {
        console.error("Error shutting down server:", error);
        alert("Error shutting down server.");
      }
    }
  };

  return (
    <Layout userRole="admin" userName={user.name || "Admin"}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Platform Administration
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {user.name || "Admin"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleManageUsers}>
                <Settings className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <StatsGrid stats={stats} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RecentUsersList users={recentUsers} />
            <RecentOrdersList orders={recentOrders} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
