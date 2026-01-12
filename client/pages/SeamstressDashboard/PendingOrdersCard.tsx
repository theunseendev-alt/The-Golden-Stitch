import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Package,
  Eye,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  Ruler,
  Calendar,
  Clock,
} from "lucide-react";
import { formatOrderDate } from "@/lib/orders";

import { Order } from "@/lib/api";

interface PendingOrdersCardProps {
  pendingOrders: Order[];
  onBrowseDesigns: () => void;
  onAcceptOrder: (orderId: string) => void;
  onDeclineOrder: (orderId: string) => void;
}

export function PendingOrdersCard({
  pendingOrders,
  onBrowseDesigns,
  onAcceptOrder,
  onDeclineOrder,
}: PendingOrdersCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Pending Orders
          {pendingOrders.length > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {pendingOrders.length}
            </span>
          )}
        </h2>
        <Button size="sm" variant="outline" onClick={onBrowseDesigns}>
          <Eye className="w-4 h-4 mr-2" />
          Browse Designs
        </Button>
      </div>

      {pendingOrders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">No pending orders</p>
          <p className="text-xs text-gray-400">
            New orders will appear here for your review
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingOrders.map((order) => (
            <div
              key={order.id}
              className="bg-orange-50 border border-orange-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-gray-900">{order.id}</p>
                  <p className="text-sm text-gray-600">{order.design?.name}</p>
                  <p className="text-xs text-gray-500">
                    by {order.design?.designerName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">${order.totalPrice}</p>
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </div>
              </div>

              <div className="mb-3 p-2 bg-white rounded border">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  {order.customerName}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {order.customerPhone}
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {order.customerEmail}
                  </div>
                </div>
              </div>

              <div className="mb-3 p-2 bg-blue-50 rounded border">
                <div className="flex items-center gap-1 mb-1">
                  <Ruler className="w-3 h-3 text-blue-600" />
                  <p className="text-xs font-medium text-blue-800">
                    Size Details
                  </p>
                </div>
                <div className="text-xs text-blue-700">
                  <p>
                    <span className="font-medium">Dress Size:</span>{" "}
                    {order.dressSize}
                  </p>
                  {order.chestMeasurement && (
                    <p>
                      <span className="font-medium">Chest:</span>{" "}
                      {order.chestMeasurement}"
                    </p>
                  )}
                  {order.waistMeasurement && (
                    <p>
                      <span className="font-medium">Waist:</span>{" "}
                      {order.waistMeasurement}"
                    </p>
                  )}
                  {order.hipMeasurement && (
                    <p>
                      <span className="font-medium">Hip:</span>{" "}
                      {order.hipMeasurement}"
                    </p>
                  )}
                  {order.length && (
                    <p>
                      <span className="font-medium">Length:</span>{" "}
                      {order.length}"
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-3 text-xs text-gray-600">
                <div className="flex items-center gap-1 mb-1">
                  <Calendar className="w-3 h-3" />
                  Ordered: {formatOrderDate(order.createdAt)}
                </div>
                <div className="flex items-center gap-1 mb-1">
                  <Clock className="w-3 h-3" />
                  Estimated: {order.estimatedDelivery}
                </div>
                {order.rushOrder && (
                  <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    Rush Order
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => onAcceptOrder(order.id)}
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                  onClick={() => onDeclineOrder(order.id)}
                >
                  <XCircle className="w-3 h-3 mr-1" />
                  Decline
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
