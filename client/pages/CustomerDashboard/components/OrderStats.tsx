import { Card } from "@/components/ui/card";

interface OrderStatsProps {
  stats: {
    pending: number;
    approved: number;
    active: number;
    completed: number;
  };
  totalSpent: number;
}

export function OrderStats({ stats, totalSpent }: OrderStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card className="p-6">
        <div className="text-2xl font-bold text-primary">
          {stats.pending + stats.approved + stats.active}
        </div>
        <p className="text-sm text-muted-foreground">Active Orders</p>
      </Card>
      <Card className="p-6">
        <div className="text-2xl font-bold text-primary">
          {stats.completed}
        </div>
        <p className="text-sm text-muted-foreground">Completed</p>
      </Card>
      <Card className="p-6">
        <div className="text-2xl font-bold text-primary">
          ${totalSpent.toFixed(2)}
        </div>
        <p className="text-sm text-muted-foreground">Total Spent</p>
      </Card>
      <Card className="p-6">
        <div className="text-2xl font-bold text-primary">
          {stats.approved}
        </div>
        <p className="text-sm text-muted-foreground">Ready for Payment</p>
      </Card>
    </div>
  );
}