import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BarChart3, Eye, Edit } from "lucide-react";

interface Order {
  id: string;
  customer: string;
  designer: string;
  seamstress: string;
  status: string;
  value: string;
}

interface RecentOrdersListProps {
  orders: Order[];
}

export function RecentOrdersList({ orders }: RecentOrdersListProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Recent Orders
        </h2>
        <Button variant="outline" size="sm">
          <BarChart3 className="w-4 h-4 mr-2" />
          Analytics
        </Button>
      </div>
      <div className="space-y-4">
        {orders.map((order, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-gray-900">{order.id}</p>
              <p className="font-bold text-primary">{order.value}</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 mb-2">
              <div>
                Customer:{" "}
                <span className="font-medium">{order.customer}</span>
              </div>
              <div>
                Designer:{" "}
                <span className="font-medium">{order.designer}</span>
              </div>
              <div>
                Seamstress:{" "}
                <span className="font-medium">{order.seamstress}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  order.status === "Completed"
                    ? "bg-green-100 text-green-800"
                    : order.status === "In Progress"
                      ? "bg-blue-100 text-blue-800"
                      : order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                }`}
              >
                {order.status}
              </span>
              <div className="flex items-center gap-1">
                <Button size="sm" variant="outline">
                  <Eye className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}