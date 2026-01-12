import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SeamstressCatalog() {
  const navigate = useNavigate();
  const [pricings, setPricings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isLoggedIn = user && user.email;
  const userRole = user.role || null;

  useEffect(() => {
    if (!isLoggedIn || userRole !== "SEAMSTRESS") {
      navigate("/login");
      return;
    }

    const fetchPricings = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('http://localhost:3002/api/design-pricings', {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        const data = await response.json();
        // Filter by current seamstress
        const userPricings = data.pricings.filter((p: any) => p.seamstressId === user.userId);
        setPricings(userPricings);
      } catch (error) {
        console.error("Error fetching pricings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPricings();
  }, [isLoggedIn, userRole, user.id, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your catalog...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userRole={userRole} userName={user.name || "Seamstress"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-secondary mb-2">
            My Priced Designs
          </h1>
          <p className="text-muted-foreground">
            View all the designs you've priced and the details you've set for each.
          </p>
        </div>

        {pricings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              You haven't set prices for any designs yet.
            </p>
            <Button onClick={() => navigate("/browse/seamstress")}>
              Browse Designs to Price
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pricings.map((pricing) => (
              <Card key={pricing.id} className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Design #{pricing.designId}</h3>
                    <p className="text-sm text-muted-foreground">
                      Your Price: ${pricing.price}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Difficulty: {pricing.difficulty}/5
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Timeline: {pricing.timeline || 'Not set'}
                    </p>
                    {pricing.notes && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Notes: {pricing.notes}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}