import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Clock,
  CheckCircle,
  Eye,
  Filter,
  Search,
  ArrowUpRight,
  PieChart,
  BarChart3,
  Target,
} from "lucide-react";
import { useState, useEffect } from "react";
import BankAccountAlert from "@/components/BankAccountAlert";
import { apiService } from "@/lib/api";

export default function DesignerEarnings() {
  const [timeRange, setTimeRange] = useState("30days");
  const [earningsData, setEarningsData] = useState({
    totalEarnings: 0,
    thisMonth: 0,
    designsCompleted: 0,
    averagePerDesign: 0,
  });
  const [designsCount, setDesignsCount] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Get current user
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch designs
        const designsResponse = await apiService.getDesigns();
        const userDesigns = designsResponse.designs.filter((d: any) => d.designerId === user.id);
        setDesignsCount(userDesigns.length);

        // Fetch orders
        const ordersResponse = await apiService.getOrders();
        const userOrders = ordersResponse.orders.filter((o: any) => 
          userDesigns.some((d: any) => d.id === o.designId)
        );

        // Calculate earnings
        const totalEarnings = userOrders.reduce((sum: number, o: any) => sum + o.designerRoyalty, 0);
        const thisMonth = userOrders
          .filter((o: any) => new Date(o.createdAt).getMonth() === new Date().getMonth())
          .reduce((sum: number, o: any) => sum + o.designerRoyalty, 0);
        const designsCompleted = userOrders.length;
        const averagePerDesign = designsCompleted > 0 ? totalEarnings / designsCompleted : 0;

        setEarningsData({
          totalEarnings,
          thisMonth,
          designsCompleted,
          averagePerDesign,
        });

        // Monthly earnings (simplified)
        const monthly = userOrders.reduce((acc: any, o: any) => {
          const month = new Date(o.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
          if (!acc[month]) acc[month] = { earnings: 0, designs: 0 };
          acc[month].earnings += o.designerRoyalty;
          acc[month].designs += 1;
          return acc;
        }, {});
        const monthlyArray = Object.entries(monthly).map(([month, data]: [string, any]) => ({
          month,
          earnings: data.earnings,
          designs: data.designs,
          trend: 'up', // simplified
        }));
        setMonthlyEarnings(monthlyArray);

        // Recent transactions
        const transactions = userOrders.slice(0, 10).map((o: any) => ({
          id: `TXN-${o.id}`,
          date: new Date(o.createdAt).toISOString().split('T')[0],
          type: 'earning',
          description: `${o.designName} - Order #${o.id}`,
          amount: o.designerRoyalty,
          status: 'completed',
        }));
        setRecentTransactions(transactions);

      } catch (error) {
        console.error('Error fetching earnings data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user.id) {
      fetchData();
    }
  }, [user.id]);

  const getStatusIcon = (status: string) => {
    return status === "completed" ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <Clock className="w-4 h-4 text-yellow-500" />
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading earnings data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <BankAccountAlert userId={user.userId || user.id} />
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Designer Earnings
                </h1>
                <p className="text-sm text-gray-600">
                  Track your income and manage payouts
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Earnings
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${earningsData.totalEarnings}
                  </p>
                </div>
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    This Month
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${earningsData.thisMonth}
                  </p>
                </div>
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Avg per Design
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${earningsData.averagePerDesign}
                  </p>
                </div>
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Monthly Earnings
              </h2>
              <div className="space-y-4">
                {monthlyEarnings.map((month, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {month.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {month.month}
                        </p>
                        <p className="text-sm text-gray-600">
                          {month.designs} designs completed
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-gray-900">
                      ${month.earnings}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Transactions
              </h2>
              <div className="space-y-3">
                {recentTransactions.map((transaction, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {transaction.description}
                        </p>
                        <p className="text-sm text-gray-600">
                          {transaction.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-green-600">
                        +${transaction.amount}
                      </p>
                      {getStatusIcon(transaction.status)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
