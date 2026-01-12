import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, DollarSign, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiService, Design } from "@/lib/api";

export default function SetPriceDifficulty() {
  const navigate = useNavigate();
  const { designId } = useParams<{ designId: string }>();
  const [design, setDesign] = useState<Design | null>(null);
  const [price, setPrice] = useState("");
  const [difficulty, setDifficulty] = useState(3);
  const [timeline, setTimeline] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Check if user is logged in as seamstress
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isLoggedIn = user && user.email;
  const userRole = user.role || null;

  useEffect(() => {
    if (!isLoggedIn || userRole !== "SEAMSTRESS") {
      navigate("/login");
      return;
    }

    const fetchDesign = async () => {
      try {
        const designsResponse = await apiService.getDesigns();
        const foundDesign = designsResponse.designs.find((d: Design) => d.id === designId);
        if (foundDesign) {
          setDesign(foundDesign);
        } else {
          alert("Design not found");
          navigate("/browse/seamstress");
        }
      } catch (error) {
        console.error("Error fetching design:", error);
        alert("Error loading design");
        navigate("/browse/seamstress");
      } finally {
        setLoading(false);
      }
    };

    if (designId) {
      fetchDesign();
    }
  }, [designId, isLoggedIn, userRole, navigate]);

  const handleSubmit = async () => {
    if (!price || parseFloat(price) < 10) {
      alert("Please set a price of at least $10");
      return;
    }

    setSubmitting(true);
    try {
      const pricingData = {
        designId,
        seamstressId: user.userId,
        price: parseFloat(price),
        difficulty,
        timeline,
        notes,
      };

      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:3002/api/design-pricings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(pricingData),
      });

      if (!response.ok) {
        throw new Error('Failed to save pricing');
      }

      alert("Pricing and difficulty set successfully!");
      navigate("/seamstress-dashboard");
    } catch (error) {
      console.error("Error saving pricing:", error);
      alert("Failed to save pricing. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading design...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!design) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Design not found</p>
            <Button onClick={() => navigate("/browse/seamstress")} className="mt-4">
              Back to Designs
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userRole={userRole} userName={user.name || "Seamstress"}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-secondary mb-4">
            Set Price & Rate Difficulty
          </h1>
          <p className="text-lg text-muted-foreground">
            Configure your pricing and difficulty rating for this design
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Design Preview */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-secondary mb-4">Design Details</h2>
            <div className="space-y-4">
              <div className={`${design.image} h-48 w-full bg-gray-200 rounded-lg`}></div>
              <div>
                <h3 className="text-lg font-semibold">{design.name}</h3>
                <p className="text-sm text-muted-foreground">by {design.designerName}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Designer Royalty:</span>
                <span className="font-bold text-green-600">${design.price}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Minimum total price: $10 (you keep ${10 - design.price} after royalty)
              </div>
            </div>
          </Card>

          {/* Pricing Form */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-secondary mb-6">Your Pricing</h2>
            <div className="space-y-6">
              {/* Price Input */}
              <div>
                <Label htmlFor="price" className="text-sm font-medium">
                  Total Price ($)
                </Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="price"
                    type="number"
                    min="10"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="10.00"
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum $10. You keep ${(parseFloat(price) || 0) - design.price} after designer royalty.
                </p>
              </div>

              {/* Difficulty Rating */}
              <div>
                <Label className="text-sm font-medium">Difficulty Rating</Label>
                <div className="mt-2">
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setDifficulty(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= difficulty
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    1 = Very Easy, 5 = Very Difficult
                  </p>
                </div>
              </div>

              {/* Timeline Input */}
              <div>
                <Label htmlFor="timeline" className="text-sm font-medium">
                  Custom Timeline (Optional)
                </Label>
                <Input
                  id="timeline"
                  type="text"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  placeholder="e.g., 3-5 days, 1 week, 10 days"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Specify your custom timeline for completing this design
                </p>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes" className="text-sm font-medium">
                  Additional Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special requirements or notes about this design..."
                  rows={3}
                  className="mt-1"
                />
              </div>

              {/* Estimated Timeline */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Estimated Timeline</span>
                </div>
                <p className="text-xs text-blue-700">
                  Based on difficulty rating {difficulty}: {difficulty <= 2 ? "3-5 days" : difficulty <= 4 ? "7-10 days" : "10-14 days"}
                </p>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={submitting || !price}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {submitting ? "Saving..." : "Set Price & Difficulty"}
              </Button>
            </div>
          </Card>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => navigate("/browse/seamstress")}
          >
            Back to Designs
          </Button>
        </div>
      </div>
    </Layout>
  );
}