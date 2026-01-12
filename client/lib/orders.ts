// Order management utilities

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  dressSize: string;
  chestMeasurement?: string;
  waistMeasurement?: string;
  hipMeasurement?: string;
  length?: string;
  preferredColor?: string;
  fabricPreference?: string;
  specialInstructions?: string;
  rushOrder: boolean;
  design: {
    id: number;
    name: string;
    designer: string;
  };
  seamstress: {
    id: number;
    name: string;
    location: string;
    basePrice: number;
    estimatedDays: string;
  };
  totalPrice: number;
  createdAt: string;
  status: "inquiry" | "pending" | "accepted" | "rejected" | "in-progress" | "completed";
  estimatedDelivery?: string;
}

// Store orders in localStorage
const ORDERS_STORAGE_KEY = "orders";

export const getOrders = (): Order[] => {
  try {
    const orders = localStorage.getItem(ORDERS_STORAGE_KEY);
    return orders ? JSON.parse(orders) : [];
  } catch (error) {
    console.error("Error loading orders:", error);
    return [];
  }
};

export const saveOrders = (orders: Order[]): void => {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error("Error saving orders:", error);
  }
};

export const createOrder = (
  orderData: Omit<Order, "id" | "createdAt" | "status">,
): Order => {
  const order: Order = {
    ...orderData,
    id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    status: "pending",
    estimatedDelivery: calculateEstimatedDelivery(
      orderData.seamstress.estimatedDays,
      orderData.rushOrder,
    ),
  };

  const orders = getOrders();
  orders.push(order);
  saveOrders(orders);

  // Send notification to seamstress about new order
  sendOrderNotification(order, "created");

  return order;
};

export const getOrdersBySeamstress = (seamstressId: number): Order[] => {
  const orders = getOrders();
  return orders.filter((order) => order.seamstress.id === seamstressId);
};

export const getOrdersByCustomer = (customerEmail: string): Order[] => {
  const orders = getOrders();
  return orders.filter((order) => order.customerEmail === customerEmail);
};

export const updateOrderStatus = (
  orderId: string,
  status: Order["status"],
): Order | null => {
  const orders = getOrders();
  const orderIndex = orders.findIndex((order) => order.id === orderId);

  if (orderIndex === -1) {
    return null;
  }

  const oldStatus = orders[orderIndex].status;
  orders[orderIndex].status = status;
  saveOrders(orders);

  // Send notifications based on status change
  sendOrderNotification(orders[orderIndex], "statusChanged", oldStatus);

  return orders[orderIndex];
};

export const getPendingOrders = (): Order[] => {
  const orders = getOrders();
  return orders.filter((order) => order.status === "pending");
};

export const getSeamstressNotifications = (seamstressId: number): Order[] => {
  const orders = getOrders();
  return orders.filter(
    (order) => order.seamstress.id === seamstressId && (order.status === "inquiry" || order.status === "pending"),
  );
};

// Global notification callback - will be set by the React app
let globalAddNotification: ((notification: any) => void) | null = null;

export const setNotificationCallback = (
  callback: (notification: any) => void,
) => {
  globalAddNotification = callback;
};

// Notification helper functions
const sendOrderNotification = (
  order: Order,
  type: "created" | "statusChanged",
  oldStatus?: Order["status"],
) => {
  try {
    if (type === "created") {
      // Notify seamstress about new order with size details
      const sizeDetails = `Size: ${order.dressSize}${order.chestMeasurement ? ` | Chest: ${order.chestMeasurement}"` : ""}${order.waistMeasurement ? ` | Waist: ${order.waistMeasurement}"` : ""}${order.hipMeasurement ? ` | Hip: ${order.hipMeasurement}"` : ""}`;

      const seamstressNotification = {
        type: "order" as const,
        title: "New Order Available",
        message: `${order.customerName} requested "${order.design.name}" - ${sizeDetails}. Are you available?`,
        userRole: "seamstress" as const,
        action: {
          label: "Review Order",
          href: `/seamstress-dashboard?order=${order.id}`,
        },
      };

      // Notify customer about order confirmation
      const customerNotification = {
        type: "order" as const,
        title: "Order Confirmed",
        message: `Your order for "${order.design.name}" has been received by ${order.seamstress.name}`,
        userRole: "customer" as const,
        action: {
          label: "Track Order",
          href: "/customer-dashboard",
        },
      };

      addNotification(seamstressNotification);
      addNotification(customerNotification);
    } else if (type === "statusChanged" && oldStatus) {
      const currentStatus = order.status;
      // Notify customer about status changes
      const customerNotification = {
        type: "order" as const,
        title: getStatusChangeTitle(currentStatus, oldStatus),
        message: getStatusChangeMessage(order, currentStatus, oldStatus),
        userRole: "customer" as const,
        action: {
          label: "View Details",
          href: "/customer-dashboard",
        },
      };

      // Notify seamstress about acceptance/rejection
      if (currentStatus === "accepted" || currentStatus === "rejected") {
        const seamstressNotification = {
          type: "order" as const,
          title:
            currentStatus === "accepted" ? "Order Accepted" : "Order Declined",
          message:
            currentStatus === "accepted"
              ? `You have accepted the order for "${order.design.name}"`
              : `You have declined the order for "${order.design.name}"`,
          userRole: "seamstress" as const,
          action: {
            label: "View Dashboard",
            href: "/seamstress-dashboard",
          },
        };
        addNotification(seamstressNotification);
      }

      addNotification(customerNotification);
    }
  } catch (error) {
    console.error("Error sending order notifications:", error);
  }
};

const addNotification = (notificationData: any) => {
  try {
    // Use the global callback if available (from React context)
    if (globalAddNotification) {
      globalAddNotification(notificationData);
      return;
    }

    // Fallback: direct localStorage manipulation (for backward compatibility)
    const existingNotifications = JSON.parse(
      localStorage.getItem("notifications") || "[]",
    );
    const newNotification = {
      ...notificationData,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    const updatedNotifications = [newNotification, ...existingNotifications];
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));

    // Show browser notification if permission granted
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(notificationData.title, {
        body: notificationData.message,
        icon: "/favicon.ico",
      });
    }
  } catch (error) {
    console.error("Error adding notification:", error);
  }
};

const getStatusChangeTitle = (
  newStatus: Order["status"],
  oldStatus: Order["status"],
): string => {
  switch (newStatus) {
    case "accepted":
      return "Order Accepted";
    case "rejected":
      return "Order Declined";
    case "in-progress":
      return "Order In Progress";
    case "completed":
      return "Order Completed";
    default:
      return "Order Updated";
  }
};

const getStatusChangeMessage = (
  order: Order,
  newStatus: Order["status"],
  oldStatus: Order["status"],
): string => {
  switch (newStatus) {
    case "accepted":
      return `Your order for "${order.design.name}" has been accepted by ${order.seamstress.name} and is now in progress`;
    case "rejected":
      return `Your order for "${order.design.name}" has been declined by ${order.seamstress.name}. Please try another seamstress.`;
    case "in-progress":
      return `Your order for "${order.design.name}" is now being worked on by ${order.seamstress.name}`;
    case "completed":
      return `Your order for "${order.design.name}" has been completed and will be delivered soon!`;
    default:
      return `Your order status has been updated to ${newStatus}`;
  }
};

const calculateEstimatedDelivery = (
  estimatedDays: string,
  rushOrder: boolean,
): string => {
  // Parse estimated days (e.g., "5-7 days", "3-5 days")
  const dayMatch = estimatedDays.match(/(\d+)-(\d+)\s*days?/);
  if (!dayMatch) {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + (rushOrder ? 3 : 7));
    return deliveryDate.toISOString().split("T")[0];
  }

  const minDays = parseInt(dayMatch[1]);
  const maxDays = parseInt(dayMatch[2]);
  const avgDays = Math.round((minDays + maxDays) / 2);
  const adjustedDays = rushOrder ? Math.ceil(avgDays * 0.5) : avgDays;

  const today = new Date();
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + adjustedDays);

  return deliveryDate.toISOString().split("T")[0];
};

export const formatOrderDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDeliveryDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getStatusColor = (status: Order["status"]): string => {
  switch (status) {
    case "pending":
      return "text-yellow-600 bg-yellow-100";
    case "accepted":
      return "text-blue-600 bg-blue-100";
    case "rejected":
      return "text-red-600 bg-red-100";
    case "in-progress":
      return "text-purple-600 bg-purple-100";
    case "completed":
      return "text-green-600 bg-green-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export const getStatusText = (status: Order["status"]): string => {
  switch (status) {
    case "pending":
      return "Pending Review";
    case "accepted":
      return "Accepted";
    case "rejected":
      return "Rejected";
    case "in-progress":
      return "In Progress";
    case "completed":
      return "Completed";
    default:
      return "Unknown";
  }
};
