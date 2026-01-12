import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);
  }, []);

  return (
    <Layout userRole={user?.role} userName={user?.name}>
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>

          <h1 className="text-2xl font-bold text-secondary mb-4">
            Payment Successful!
          </h1>

          <p className="text-muted-foreground mb-6">
            Thank you for your payment. Your custom dress order has been confirmed and production will begin shortly.
          </p>

          <div className="space-y-3 mb-8">
            <div className="text-sm text-muted-foreground">
              <strong>Order Details:</strong>
            </div>
            <div className="text-sm">
              Payment processed securely via Stripe
            </div>
            {sessionId && (
              <div className="text-xs text-muted-foreground">
                Session ID: {sessionId}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => navigate("/customer-dashboard")}
              className="w-full"
            >
              View My Orders
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/browse/customer")}
              className="w-full"
            >
              Browse More Designs
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
}