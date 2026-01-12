import { Layout } from "@/components/layout/Layout";
import { useNavigate } from "react-router-dom";
import { Order } from "@/lib/api";
import { useOrders } from "@/hooks/useOrders";
import { getOrderStats } from "@/lib/orderUtils.tsx";
import { OrderStats } from "@/pages/CustomerDashboard/components/OrderStats";
import { OrderList } from "@/pages/CustomerDashboard/components/OrderList";
import { CtaSection } from "@/pages/CustomerDashboard/components/CtaSection";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { orders, loading } = useOrders();

  const handleViewDetails = (order: Order) => {
    // Navigate to order details page
    navigate(`/order-details?orderId=${order.id}`);
  };

  const handlePayNow = (order: Order) => {
    // Navigate to payment page
    navigate(`/payment?orderId=${order.id}`);
  };

  const handleBrowseDesigns = () => {
    navigate("/browse/customer");
  };

  const stats = getOrderStats(orders);
  const totalSpent = orders.filter(order => order.paymentStatus === 'PAID').reduce((sum, order) => sum + order.totalPrice, 0);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout userRole="customer" userName="Sarah">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-secondary mb-2">
            My Orders
          </h1>
          <p className="text-muted-foreground">
            Track your dress orders and manage your purchases
          </p>
        </div>

        <OrderStats stats={stats} totalSpent={totalSpent} />

        <OrderList
          orders={orders}
          onViewDetails={handleViewDetails}
          onPayNow={handlePayNow}
        />

        <CtaSection onBrowseDesigns={handleBrowseDesigns} />
      </div>
    </Layout>
  );
}
