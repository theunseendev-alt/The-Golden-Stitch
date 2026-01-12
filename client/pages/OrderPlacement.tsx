import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiService, Seamstress, Design } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function OrderPlacement() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const designId = searchParams.get("designId");
  const seamstressId = searchParams.get("seamstressId");

  const [design, setDesign] = useState<Design | null>(null);
  const [seamstress, setSeamstress] = useState<Seamstress | null>(null);
  const [pricing, setPricing] = useState<any>(null);
  const [measurements, setMeasurements] = useState({
    itemSize: "",
    chest: "",
    waist: "",
    hip: "",
    length: "",
    // For purses
    height: "",
    width: "",
    depth: "",
    // For hats
    circumference: "",
    hatHeight: "",
    brimWidth: "",
  });
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [loading, setLoading] = useState(true);

  // Get current user
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch design
        const designsResponse = await apiService.getDesigns();
        const foundDesign = designsResponse.designs.find((d: Design) => d.id === designId);
        setDesign(foundDesign || null);

        // Fetch seamstress
        const seamstressesResponse = await apiService.getSeamstresses();
        const foundSeamstress = seamstressesResponse.seamstresses.find((s: Seamstress) => s.id === seamstressId);
        setSeamstress(foundSeamstress || null);

        // Load pricing if available
        const storedPricings = JSON.parse(localStorage.getItem("designPricings") || "{}");
        const designPricings = storedPricings[designId] || [];
        const seamstressPricing = designPricings.find((p: any) => p.seamstressId === seamstressId);
        setPricing(seamstressPricing || null);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (designId && seamstressId) {
      fetchData();
    }
  }, [designId, seamstressId]);

  const handleSubmit = async () => {
    // Validate measurements based on item type
    if (design.itemType === 'CLOTHING') {
      if (!measurements.itemSize || !measurements.chest || !measurements.waist ||
          !measurements.hip || !measurements.length) {
        alert("Please fill in all measurement fields");
        return;
      }
    } else if (design.itemType === 'PURSE') {
      if (!measurements.height || !measurements.width || !measurements.depth) {
        alert("Please fill in all measurement fields");
        return;
      }
    } else if (design.itemType === 'HAT') {
      if (!measurements.circumference || !measurements.hatHeight) {
        alert("Please fill in all measurement fields");
        return;
      }
    }

    setLoading(true);

    try {
      // Create order via API
      const token = localStorage.getItem('accessToken');
      const orderResponse = await fetch('http://localhost:3002/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          designId,
          seamstressId,
          customerId: user.userId,
          itemType: design.itemType,
          measurements,
          specialInstructions,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const { order } = await orderResponse.json();

      // Send notification to seamstress with measurements
      let measurementDetails = '';
      if (design.itemType === 'CLOTHING') {
        measurementDetails = `Size: ${measurements.itemSize}, Chest: ${measurements.chest}", Waist: ${measurements.waist}", Hip: ${measurements.hip}", Length: ${measurements.length}"`;
      } else if (design.itemType === 'PURSE') {
        measurementDetails = `Height: ${measurements.height}", Width: ${measurements.width}", Depth: ${measurements.depth}"`;
      } else if (design.itemType === 'HAT') {
        measurementDetails = `Circumference: ${measurements.circumference}", Height: ${measurements.hatHeight}", Brim Width: ${measurements.brimWidth}"`;
      }
      await fetch('http://localhost:3002/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          userId: seamstressId,
          type: 'inquiry',
          title: 'New Design Inquiry',
          message: `New inquiry for "${design?.name}". Measurements: ${measurementDetails}. Special instructions: ${specialInstructions || 'None'}. Can you make this item?`,
        }),
      });

      // Show success message
      toast({
        title: "Inquiry Sent Successfully",
        description: "Your inquiry has been sent to the seamstress. You'll be notified when she responds.",
      });

      // Navigate to customer dashboard
      navigate('/customer-dashboard');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to process order. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!design || !seamstress) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Order data not found</p>
            <Button onClick={() => navigate("/browse/customer")} className="mt-4">
              Back to Browse
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const finalPrice = pricing?.price || seamstress.basePrice;

  return (
    <Layout userRole={user.role} userName={user.name}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-secondary mb-4">
            Place Your Order
          </h1>
          <p className="text-lg text-muted-foreground">
            Provide your measurements and instructions for your custom item
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Information */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-secondary mb-4">Shipping Information</h2>
            <div className="space-y-4">
              {/* Design */}
              <div className="flex items-center gap-4">
                <img
                  src={design.image}
                  alt={design.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-medium">{design.name}</h3>
                  <p className="text-sm text-muted-foreground">by {design.designerName}</p>
                </div>
              </div>

              {/* Seamstress */}
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="" alt={seamstress.name} />
                  <AvatarFallback>{seamstress.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{seamstress.name}</h3>
                  <p className="text-sm text-muted-foreground">{seamstress.location}</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="border-t pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Design Fee:</span>
                  <span>$4.00</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Platform Fee:</span>
                  <span>$6.00</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>$10.00</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Secure payment via Stripe
                </p>
              </div>
            </div>
          </Card>

          {/* Measurements Form */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-secondary mb-6">Your Measurements</h2>
            <div className="space-y-4">
              {design.itemType === 'CLOTHING' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="itemSize">Item Size</Label>
                      <Input
                        id="itemSize"
                        value={measurements.itemSize}
                        onChange={(e) => setMeasurements({ ...measurements, itemSize: e.target.value })}
                        placeholder="e.g., S, M, L"
                      />
                    </div>
                    <div>
                      <Label htmlFor="length">Item Length (inches)</Label>
                      <Input
                        id="length"
                        type="number"
                        value={measurements.length}
                        onChange={(e) => setMeasurements({ ...measurements, length: e.target.value })}
                        placeholder="58"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="chest">Chest/Bust (inches)</Label>
                      <Input
                        id="chest"
                        type="number"
                        value={measurements.chest}
                        onChange={(e) => setMeasurements({ ...measurements, chest: e.target.value })}
                        placeholder="34"
                      />
                    </div>
                    <div>
                      <Label htmlFor="waist">Waist (inches)</Label>
                      <Input
                        id="waist"
                        type="number"
                        value={measurements.waist}
                        onChange={(e) => setMeasurements({ ...measurements, waist: e.target.value })}
                        placeholder="26"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hip">Hip (inches)</Label>
                      <Input
                        id="hip"
                        type="number"
                        value={measurements.hip}
                        onChange={(e) => setMeasurements({ ...measurements, hip: e.target.value })}
                        placeholder="36"
                      />
                    </div>
                  </div>
                </>
              )}

              {design.itemType === 'PURSE' && (
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="height">Height (inches)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={measurements.height}
                      onChange={(e) => setMeasurements({ ...measurements, height: e.target.value })}
                      placeholder="10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="width">Width (inches)</Label>
                    <Input
                      id="width"
                      type="number"
                      value={measurements.width}
                      onChange={(e) => setMeasurements({ ...measurements, width: e.target.value })}
                      placeholder="8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="depth">Depth (inches)</Label>
                    <Input
                      id="depth"
                      type="number"
                      value={measurements.depth}
                      onChange={(e) => setMeasurements({ ...measurements, depth: e.target.value })}
                      placeholder="4"
                    />
                  </div>
                </div>
              )}

              {design.itemType === 'HAT' && (
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="circumference">Head Circumference (inches)</Label>
                    <Input
                      id="circumference"
                      type="number"
                      value={measurements.circumference}
                      onChange={(e) => setMeasurements({ ...measurements, circumference: e.target.value })}
                      placeholder="22"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hatHeight">Hat Height (inches)</Label>
                    <Input
                      id="hatHeight"
                      type="number"
                      value={measurements.hatHeight}
                      onChange={(e) => setMeasurements({ ...measurements, hatHeight: e.target.value })}
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="brimWidth">Brim Width (inches)</Label>
                    <Input
                      id="brimWidth"
                      type="number"
                      value={measurements.brimWidth}
                      onChange={(e) => setMeasurements({ ...measurements, brimWidth: e.target.value })}
                      placeholder="2"
                    />
                  </div>
                </div>
              )}

              <div>
                <Textarea
                  id="instructions"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Any special requests, fabric preferences, or additional notes..."
                  rows={4}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <h3 className="font-medium text-blue-800 mb-2">What happens next?</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Your inquiry will be sent to the seamstress with your measurements</li>
                  <li>• The seamstress will review and respond if she can make the item</li>
                  <li>• If accepted, you'll be able to proceed with payment</li>
                  <li>• If rejected, you'll be notified and can try another seamstress</li>
                </ul>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
              >
                {loading ? 'Sending Inquiry...' : 'Ask Availability'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </div>
      </div>
    </Layout>
  );
}