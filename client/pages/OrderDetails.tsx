import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Star, MapPin, Clock, Scissors } from 'lucide-react';
import { apiService } from '@/lib/api';

export default function OrderDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get current user
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError('Order ID is required');
        setLoading(false);
        return;
      }

      try {
        const ordersResponse = await apiService.getOrders();
        const foundOrder = ordersResponse.orders.find((o: any) => o.id === orderId);

        if (!foundOrder) {
          setError('Order not found');
          setLoading(false);
          return;
        }

        // Verify user owns this order
        if (foundOrder.customerId !== user.userId) {
          setError('You are not authorized to view this order');
          setLoading(false);
          return;
        }

        setOrder(foundOrder);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    if (user.email) {
      fetchOrderDetails();
    }
  }, [orderId, user]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading order details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !order) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="p-8 max-w-md w-full text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => navigate('/customer-dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userRole={user.role} userName={user.name}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/customer-dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
          <h1 className="text-3xl font-serif font-bold text-secondary mb-2">
            Order Details
          </h1>
          <p className="text-muted-foreground">
            Order #{order.id.slice(-8)}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Dress Images */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-secondary mb-6">Dress Design</h2>
            <div className="space-y-6">
              {/* Front View */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Front View</h3>
                <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={order.design?.image || "https://picsum.photos/400/600?random=1"}
                    alt={`${order.design?.name} front view`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Back View - Placeholder for now */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Back View</h3>
                <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Scissors className="w-12 h-12 mx-auto mb-2" />
                    <p>Back view will be available when seamstress starts work</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Order & Seamstress Info */}
          <div className="space-y-6">
            {/* Order Info */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-secondary mb-4">Order Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Design:</span>
                  <span className="font-medium">{order.design?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Designer:</span>
                  <span className="font-medium">{order.design?.designerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    order.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'PAID' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Price:</span>
                  <span className="font-bold text-primary">${order.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ordered:</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                {order.estimatedDelivery && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Delivery:</span>
                    <span>{new Date(order.estimatedDelivery).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Seamstress Info */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-secondary mb-4">Your Seamstress</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <Scissors className="w-8 h-8 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{order.seamstressName}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>Location not specified</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Rating:</span>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < 4 ? "fill-primary text-primary" : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-1">4.0</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Completed Orders:</span>
                    <p className="font-medium">25</p>
                  </div>
                </div>

                <div>
                  <span className="text-gray-600 text-sm">Specialties:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                      Wedding Dresses
                    </span>
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                      Evening Gowns
                    </span>
                  </div>
                </div>

                {order.notes && (
                  <div>
                    <span className="text-gray-600 text-sm">Special Instructions:</span>
                    <p className="mt-1 text-sm bg-gray-50 p-3 rounded-lg">{order.notes}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Progress */}
            {order.status === 'IN_PROGRESS' && (
              <Card className="p-6">
                <h2 className="text-xl font-bold text-secondary mb-4">Progress</h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{order.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-primary h-3 rounded-full transition-all duration-300"
                      style={{ width: `${order.progress || 0}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    Your seamstress is working on your dress. You'll be notified when it's complete.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}