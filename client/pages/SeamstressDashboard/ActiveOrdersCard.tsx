import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Eye } from "lucide-react";
import { Order } from "@/lib/api";

interface ActiveOrder {
  id: string;
  design: string;
  customer: string;
  designer: string;
  status: string;
  progress: number;
  dueDate: string;
  price: string;
}

function getStatusColor(status: string) {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800";
    case "In Progress":
      return "bg-blue-100 text-blue-800";
    case "Started":
      return "bg-yellow-100 text-yellow-800";
    case "On Hold":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

interface ActiveOrdersCardProps {
  activeOrders: Order[];
  onViewSchedule: () => void;
  onUpdateProgress: (order: Order) => void;
  onViewOrder: (orderId: string) => void;
}

export function ActiveOrdersCard({
  activeOrders: orders,
  onViewSchedule,
  onUpdateProgress,
  onViewOrder,
}: ActiveOrdersCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Active Orders</h2>
        <Button size="sm" variant="outline" onClick={onViewSchedule}>
          <Calendar className="w-4 h-4 mr-2" />
          Schedule
        </Button>
      </div>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium text-gray-900">#{order.id.slice(-8)}</p>
                <p className="text-sm text-gray-600">{order.design?.name}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">${order.totalPrice}</p>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span>{order.progress || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${order.progress || 0}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
              <div>
                <span className="font-medium">Customer:</span> {order.customerName}
              </div>
              <div>
                <span className="font-medium">Designer:</span> {order.design?.name.split(' ')[0]} {/* Placeholder */}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Due: {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1"
                onClick={() => onUpdateProgress(order)}
                disabled={order.status === 'APPROVED'}
              >
                {order.status === 'PAID' ? 'Start Work' : order.status === 'IN_PROGRESS' ? 'Confirm Complete' : 'Update Progress'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onViewOrder(order.id)}
              >
                <Eye className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
