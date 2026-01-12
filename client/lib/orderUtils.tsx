import {
  ShoppingBag,
  Clock,
  Check,
  CreditCard,
  Package as PackageIcon,
} from "lucide-react";

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "PLACED":
      return <ShoppingBag className="w-4 h-4" />;
    case "CONFIRMED":
      return <Clock className="w-4 h-4" />;
    case "APPROVED":
      return <CreditCard className="w-4 h-4" />;
    case "PAID":
      return <PackageIcon className="w-4 h-4" />;
    case "IN_PROGRESS":
      return <Clock className="w-4 h-4" />;
    case "COMPLETED":
      return <Check className="w-4 h-4" />;
    default:
      return <ShoppingBag className="w-4 h-4" />;
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "PLACED":
      return "bg-yellow-50 text-yellow-700";
    case "CONFIRMED":
      return "bg-blue-50 text-blue-700";
    case "APPROVED":
      return "bg-green-50 text-green-700";
    case "PAID":
      return "bg-purple-50 text-purple-700";
    case "IN_PROGRESS":
      return "bg-primary/10 text-primary";
    case "COMPLETED":
      return "bg-green-50 text-green-700";
    default:
      return "bg-muted";
  }
};

export const getStatusLabel = (status: string) => {
  switch (status) {
    case "PLACED":
      return "Order Placed";
    case "CONFIRMED":
      return "Seamstress Confirmed";
    case "APPROVED":
      return "Approved - Ready for Payment";
    case "PAID":
      return "Payment Received";
    case "IN_PROGRESS":
      return "In Production";
    case "COMPLETED":
      return "Completed";
    default:
      return status;
  }
};

export const getFilteredOrders = (orders: any[], statusFilter?: string) => {
  if (!statusFilter) return orders;
  return orders.filter((order) => order.status === statusFilter);
};

export const getOrderStats = (orders: any[]) => {
  const stats = {
    pending: orders.filter((o) => ["PLACED", "CONFIRMED"].includes(o.status))
      .length,
    approved: orders.filter((o) => o.status === "APPROVED").length,
    active: orders.filter((o) => ["PAID", "IN_PROGRESS"].includes(o.status))
      .length,
    completed: orders.filter((o) => o.status === "COMPLETED").length,
  };
  return stats;
};