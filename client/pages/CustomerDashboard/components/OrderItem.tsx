import { Button } from "@/components/ui/button";
import { ShoppingBag, CreditCard, Users } from "lucide-react";
import { Order } from "@/lib/api";
import { getStatusIcon, getStatusColor, getStatusLabel } from "@/lib/orderUtils.tsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface OrderItemProps {
  order: Order;
  onViewDetails: (order: Order) => void;
  onPayNow: (order: Order) => void;
}

export function OrderItem({ order, onViewDetails, onPayNow }: OrderItemProps) {
  const navigate = useNavigate();

  return (
    <div className="border border-border rounded-lg p-6 hover:border-primary transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-secondary">
              {order.designName}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            Made by: {order.seamstressName}
          </p>
          <p className="text-xs text-muted-foreground">
            Order ID: {order.id} • Ordered on{" "}
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex flex-col sm:items-end gap-3">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(
              order.status,
            )}`}
          >
            {getStatusIcon(order.status)}
            {getStatusLabel(order.status)}
          </div>
          <div className="text-right">
            <p className="font-bold text-secondary">
              ${order.totalPrice.toFixed(2)}
            </p>
            <div className="flex gap-2 mt-2">
              {order.status === "APPROVED" &&
                order.paymentStatus === "PENDING" && (
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => onPayNow(order)}
                  >
                    <CreditCard className="w-4 h-4 mr-1" />
                    Pay Now
                  </Button>
                )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => onViewDetails(order)}
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}