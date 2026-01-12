import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Palette,
  Scissors,
  ShoppingBag,
  DollarSign,
  TrendingUp,
} from "lucide-react";

const iconMap = {
  Users,
  Palette,
  Scissors,
  ShoppingBag,
  DollarSign,
  TrendingUp,
};

interface Stat {
  title: string;
  value: string;
  change: string;
  iconName: keyof typeof iconMap;
  color: string;
}

interface StatsGridProps {
  stats: Stat[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = iconMap[stat.iconName];
        return (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
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