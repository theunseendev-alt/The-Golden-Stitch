import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Order } from "@/lib/api";
import { OrderItem } from "./OrderItem";

interface OrderListProps {
  orders: Order[];
  onViewDetails: (order: Order) => void;
  onPayNow: (order: Order) => void;
}

export function OrderList({ orders, onViewDetails, onPayNow }: OrderListProps) {
  return (
    <Tabs defaultValue="all" className="mb-8">
      <TabsList>
        <TabsTrigger value="all">All Orders</TabsTrigger>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="mt-6">
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderItem
              key={order.id}
              order={order}
              onViewDetails={onViewDetails}
              onPayNow={onPayNow}
            />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="active" className="mt-6">
        <div className="text-center py-8 text-muted-foreground">
          View your active orders above
        </div>
      </TabsContent>

      <TabsContent value="completed" className="mt-6">
        <div className="text-center py-8 text-muted-foreground">
          View your completed orders above
        </div>
      </TabsContent>
    </Tabs>
  );
}