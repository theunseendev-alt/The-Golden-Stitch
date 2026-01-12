import { useState, useEffect } from "react";
import { apiService, Order } from "@/lib/api";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = (await apiService.getOrders()) as { orders: Order[] };
      setOrders(response.orders);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  return { orders, loading, loadOrders };
}