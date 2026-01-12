import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ProfileCardsProps {
  onViewAnalytics: () => void;
  onViewEarnings: () => void;
}

export function ProfileCards({
  onViewAnalytics,
  onViewEarnings,
}: ProfileCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Profile Performance
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Completion Rate</span>
            <span className="font-bold text-green-600">98%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">On-Time Delivery</span>
            <span className="font-bold text-blue-600">95%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Customer Satisfaction</span>
            <span className="font-bold text-yellow-600">4.9/5</span>
          </div>
          <Button
            className="w-full"
            variant="outline"
            onClick={onViewAnalytics}
          >
            View Detailed Analytics
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">This Month</h2>
        <div className="space-y-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">$1,280</p>
            <p className="text-sm text-gray-600">Total Earnings</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">12</p>
            <p className="text-sm text-gray-600">Orders Completed</p>
          </div>
          <Button className="w-full" onClick={onViewEarnings}>
            View Earnings Report
          </Button>
        </div>
      </Card>
    </div>
  );
}
