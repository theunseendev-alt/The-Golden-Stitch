import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CreditCard, Shield } from 'lucide-react';
import PaymentForm from '@/components/PaymentForm';
import { apiService } from '@/lib/api';

export default function Payment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  // Get current user
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [shippingAddress, setShippingAddress] = useState({
    name: user.name || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setPaymentError('Order ID is required');
        setLoading(false);
        return;
      }

      try {
        // Fetch order details
        const ordersResponse = await apiService.getOrders();
        const order = ordersResponse.orders.find((o: any) => o.id === orderId);

        if (!order) {
          setPaymentError('Order not found');
          setLoading(false);
          return;
        }

        // Verify user owns this order
        if (order.customerId !== user.userId) {
          setPaymentError('You are not authorized to pay for this order');
          setLoading(false);
          return;
        }

        // Check if order can be paid
        if (order.status !== 'APPROVED' || order.paymentStatus !== 'PENDING') {
          setPaymentError('This order is not eligible for payment');
          setLoading(false);
          return;
        }

        setOrderDetails(order);
      } catch (error) {
        console.error('Error fetching order:', error);
        setPaymentError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, user.userId]);

  const handlePaymentSuccess = (paymentIntentId: string) => {
    setPaymentSuccess(true);
    setPaymentError('');

    // TODO: Send notification to designer that their design was sold
    // The backend should handle this in the confirm-payment endpoint

    // Redirect to success page after a delay
    setTimeout(() => {
      navigate('/customer-dashboard');
    }, 3000);
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
    setPaymentSuccess(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading payment details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (paymentError && !orderDetails) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="p-8 max-w-md w-full text-center">
            <div className="text-red-600 mb-4">
              <CreditCard className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Error</h2>
            <p className="text-gray-600 mb-6">{paymentError}</p>
            <Button onClick={() => navigate('/customer-dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  if (paymentSuccess) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="p-8 max-w-md w-full text-center">
            <div className="text-green-600 mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your payment has been processed successfully. Your order is now being prepared.
            </p>
            <Button onClick={() => navigate('/customer-dashboard')}>
              View My Orders
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userRole={user.role} userName={user.name}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
            Enter Shipping Information
          </h1>
          <p className="text-muted-foreground">
            Securely pay for your custom dress order
          </p>
        </div>

        {/* Order Summary */}
        {orderDetails && (
          <Card className="p-6 mb-8">
            <h2 className="text-lg font-bold text-secondary mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono text-sm">{orderDetails.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Design:</span>
                <span>{orderDetails.design?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Seamstress:</span>
                <span>{orderDetails.seamstressName}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount:</span>
                  <span>${orderDetails.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Shipping Information */}
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-bold text-secondary mb-6">Shipping Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={shippingAddress.name}
                onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                value={shippingAddress.street}
                onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                placeholder="Enter street address"
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                placeholder="Enter city"
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={shippingAddress.state}
                onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                placeholder="Enter state"
              />
            </div>
            <div>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={shippingAddress.zipCode}
                onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                placeholder="Enter ZIP code"
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={shippingAddress.country}
                onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                placeholder="Enter country"
              />
            </div>
          </div>
        </Card>

        {/* Payment Form */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-secondary mb-6">Payment Information</h2>

          {paymentError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{paymentError}</p>
            </div>
          )}

          {orderDetails && (
            <PaymentForm
              orderId={orderId!}
              amount={Math.round(orderDetails.totalPrice * 100)} // Convert to cents
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          )}
        </Card>

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Secure Payment</h3>
              <p className="text-sm text-blue-700">
                Your payment information is encrypted and processed securely by Stripe.
                We never store your card details on our servers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}