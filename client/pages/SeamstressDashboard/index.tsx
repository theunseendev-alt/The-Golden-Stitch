import { Layout } from "@/components/layout/Layout";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { DashboardHeader } from "./DashboardHeader";
import { PendingOrdersCard } from "./PendingOrdersCard";
import { ActiveOrdersCard } from "./ActiveOrdersCard";
import BankAccountAlert from "@/components/BankAccountAlert";

export default function SeamstressDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [pendingOrders, setPendingOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await apiService.getOrders();
      const orders = data.orders;

      // Pending orders: INQUIRY or PLACED status
      const pending = orders.filter(order =>
        order.status === 'INQUIRY' || order.status === 'PLACED'
      );

      // Active orders: APPROVED, PAID, IN_PROGRESS
      const active = orders.filter(order =>
        ['APPROVED', 'PAID', 'IN_PROGRESS'].includes(order.status)
      );

      setPendingOrders(pending);
      setActiveOrders(active);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleBrowseDesigns = () => navigate("/browse/seamstress");
  const handleSettings = () => alert("Opening seamstress settings...");
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      await apiService.updateOrder(orderId, { status: "APPROVED" });
      toast({
        title: "Order Accepted",
        description: "The customer has been notified and can now proceed with payment.",
      });
      // Refresh orders
      fetchOrders();
    } catch (error) {
      console.error("Error accepting order:", error);
      toast({
        title: "Error",
        description: "Failed to accept the order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeclineOrder = async (orderId: string) => {
    try {
      await apiService.updateOrder(orderId, { status: "REJECTED" });
      toast({
        title: "Order Declined",
        description: "The customer has been notified.",
      });
      // Refresh orders
      fetchOrders();
    } catch (error) {
      console.error("Error declining order:", error);
      toast({
        title: "Error",
        description: "Failed to decline the order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewSchedule = () => {
    alert("Schedule view coming soon!");
  };

  const handleUpdateProgress = async (order: any) => {
    try {
      if (order.status === 'PAID') {
        // Start work
        await apiService.updateOrder(order.id, { status: 'IN_PROGRESS', progress: 10 });
        toast({
          title: "Work Started",
          description: "You have started working on this order.",
        });
      } else if (order.status === 'IN_PROGRESS') {
        // Mark as complete
        await apiService.updateOrder(order.id, { status: 'COMPLETED', progress: 100 });
        toast({
          title: "Order Completed",
          description: "The customer has been notified that their order is on the way.",
        });
      } else {
        // Fallback to progress update
        const newProgress = prompt("Enter new progress percentage (0-100):");
        if (newProgress !== null) {
          const progress = parseInt(newProgress);
          if (!isNaN(progress) && progress >= 0 && progress <= 100) {
            await apiService.updateOrder(order.id, { progress });
            toast({
              title: "Progress Updated",
              description: `Order progress set to ${progress}%.`,
            });
          }
        }
      }
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Error",
        description: "Failed to update order.",
        variant: "destructive",
      });
    }
  };

  const handleViewOrder = (orderId: string) => {
    navigate(`/order-details?orderId=${orderId}`);
  };



  return (
    <Layout>
      <BankAccountAlert userId={user.id || user.userId} />
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader
          userName={user.name || "Seamstress"}
          onBrowseDesigns={handleBrowseDesigns}
          onLogout={handleLogout}
        />

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
              <PendingOrdersCard
                pendingOrders={pendingOrders}
                onBrowseDesigns={handleBrowseDesigns}
                onAcceptOrder={handleAcceptOrder}
                onDeclineOrder={handleDeclineOrder}
              />
            </div>

            <div className="lg:col-span-2">
              <ActiveOrdersCard
                activeOrders={activeOrders}
                onViewSchedule={handleViewSchedule}
                onUpdateProgress={handleUpdateProgress}
                onViewOrder={handleViewOrder}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
