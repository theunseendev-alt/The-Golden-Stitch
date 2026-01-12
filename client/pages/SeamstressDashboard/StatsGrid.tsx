import { Card } from "@/components/ui/card";
import { Package, DollarSign, Star, Clock, LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { apiService } from "@/lib/api";

interface Stat {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
}

export function StatsGrid() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiService.getSeamstressStats();
        setStats([
          {
            title: "Orders This Month",
            value: data.ordersThisMonth.toString(),
            change: "Current month",
            icon: Package,
            color: "from-green-500 to-green-600",
          },
          {
            title: "Total Earnings",
            value: `${data.totalEarnings}`,
            change: "Lifetime earnings",
            icon: DollarSign,
            color: "from-emerald-500 to-emerald-600",
          },
          {
            title: "Avg. Rating",
            value: data.avgRating,
            change: "Star rating",
            icon: Star,
            color: "from-yellow-500 to-yellow-600",
          },
          {
            title: "Response Time",
            value: data.responseTime,
            change: "Average response",
            icon: Clock,
            color: "from-blue-500 to-blue-600",
          },
        ]);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600">{stat.change}</p>
              </div>
              <div
                className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
