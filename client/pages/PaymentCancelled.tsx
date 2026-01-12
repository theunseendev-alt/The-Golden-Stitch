import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentCancelled() {
  const navigate = useNavigate();
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
            <XCircle className="h-16 w-16 text-red-500" />
          </div>

          <h1 className="text-2xl font-bold text-secondary mb-4">
            Payment Cancelled
          </h1>

          <p className="text-muted-foreground mb-6">
            Your payment was cancelled. No charges have been made to your account.
          </p>

          <div className="space-y-3 mb-8">
            <div className="text-sm text-muted-foreground">
              You can try again or choose a different payment method.
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => navigate(-1)}
              className="w-full"
            >
              Try Again
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/customer-dashboard")}
              className="w-full"
            >
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
}