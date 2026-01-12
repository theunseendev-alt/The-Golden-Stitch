import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Scissors,
  Star,
  MapPin,
  Clock,
  Award,
  DollarSign,
  Eye,
  User,
  Phone,
  Mail,
  Calendar,
  Filter,
  Search,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import OrderModal from "@/components/OrderModal";
import { apiService, Seamstress } from "@/lib/api";

export default function Seamstresses() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedSeamstress, setSelectedSeamstress] =
    useState<Seamstress | null>(null);
  const [seamstresses, setSeamstresses] = useState<Seamstress[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState<any>(null);
  const [designPricings, setDesignPricings] = useState<any>({});

  // Check if user is logged in
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"));
  const isLoggedIn = currentUser && currentUser.email;
  const userRole = currentUser.role || null;

  // Update user state periodically to detect login changes
  useEffect(() => {
    const interval = setInterval(() => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setCurrentUser(user);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch seamstresses, design and pricings on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const designId = searchParams.get('designId');

        // Fetch all designs to find the selected one
        const designsResponse = await apiService.getDesigns();
        const designs = designsResponse.designs;

        if (designId) {
          const design = designs.find((d: any) => d.id === designId);
          if (design) {
            setSelectedDesign(design);
          } else {
            // Fallback to first design
            setSelectedDesign(designs[0]);
          }
        } else {
          // No designId, use first design
          setSelectedDesign(designs[0]);
        }

        const response = await apiService.getSeamstresses();
        setSeamstresses(response.seamstresses);

        // Load design pricings from API for the selected design
        const pricingsUrl = designId ? `/api/design-pricings?designId=${designId}` : '/api/design-pricings';
        const pricingsResponse = await fetch(pricingsUrl);
        const pricingsData = await pricingsResponse.json();
        const pricingsMap = pricingsData.pricings.reduce((acc: any, p: any) => {
          if (!acc[p.designId]) acc[p.designId] = [];
          acc[p.designId].push(p);
          return acc;
        }, {});
        setDesignPricings(pricingsMap);
      } catch (error) {
        console.error("Error fetching data:", error);
        setSeamstresses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  const handleSelectSeamstress = (seamstress: any) => {
    if (!isLoggedIn) {
      // Redirect to login if not logged in
      navigate("/login");
      return;
    }

    if (userRole?.toLowerCase() !== "customer") {
      alert("Only customers can place orders. Please log in as a customer.");
      return;
    }

    // Navigate to order placement page with design and seamstress info
    navigate(`/order-placement?designId=${selectedDesign.id}&seamstressId=${seamstress.id}`);
  };

  const handleOrderSubmit = async (orderData: any) => {
    try {
      // Create the order using the API
      const response = await apiService.createOrder({
        designId: selectedDesign.id,
        seamstressId: orderData.seamstress.id,
        measurements: {
          dressSize: orderData.dressSize,
          chest: orderData.chestMeasurement,
          waist: orderData.waistMeasurement,
          hip: orderData.hipMeasurement,
          length: orderData.length,
        },
        notes: orderData.specialInstructions,
      });

      // Show success message
      alert(
        `Order placed successfully! Order ID: ${response.order.id}\n\nThe seamstress will be notified and can accept or reject your order. You'll receive updates in your dashboard.`,
      );

      // Redirect to customer dashboard to view orders
      navigate("/customer-dashboard");
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  const handleAvailabilityToggle = async (seamstress: any) => {
    if (userRole?.toLowerCase() !== "seamstress") {
      alert("Only seamstresses can update their availability status.");
      return;
    }

    try {
      // For demo purposes, we'll simulate the availability update
      // In a real app, this would call an API endpoint
      const newAvailability = !seamstress.isActive;

      // Update local state immediately for better UX
      setSeamstresses((prev) =>
        prev.map((s) =>
          s.id === seamstress.id ? { ...s, isActive: newAvailability } : s,
        ),
      );

      const statusText = newAvailability ? "available" : "unavailable";
      alert(
        `You are now ${statusText} for work. ${newAvailability ? 'Orders will be shown as "Order Now" to customers.' : "You will not receive new orders until you become available again."}`,
      );
    } catch (error) {
      console.error("Error updating availability:", error);
      alert("Failed to update availability. Please try again.");
    }
  };

  const filteredSeamstresses = seamstresses.filter((seamstress) => {
    const matchesSearch =
      seamstress.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seamstress.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seamstress.specialty.some((spec) =>
        spec.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    const pricing = designPricings[selectedDesign.id]?.find((p: any) => p.seamstressId === seamstress.id);
    const effectivePrice = pricing?.price || seamstress.basePrice;

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "available" && seamstress.isActive) ||
      (selectedFilter === "highly-rated" && seamstress.rating >= 4.8) ||
      (selectedFilter === "affordable" && effectivePrice <= 100);

    return matchesSearch && matchesFilter;
  });

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
                Choose Your Seamstress & Pricing
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Select from our talented seamstresses. Each offers unique
                specialties, pricing, and timelines for your custom dress. View
                all available options and their custom pricing below.
              </p>
              {!isLoggedIn && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800">
                    <strong>Note:</strong> You need to be logged in as a
                    customer to place orders.
                    <button
                      onClick={() => navigate("/login")}
                      className="ml-2 text-blue-600 underline hover:text-blue-800"
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              )}
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, location, or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  title="Filter seamstresses by criteria"
                >
                  <option value="all">All Seamstresses</option>
                  <option value="available">Available Now</option>
                  <option value="highly-rated">Highly Rated (4.8+)</option>
                  <option value="affordable">Affordable (≤$100)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-6">
            <p className="text-gray-600">
              Found{" "}
              <span className="font-semibold text-primary">
                {filteredSeamstresses.length}
              </span>{" "}
              seamstresses
            </p>
          </div>

          {/* Seamstresses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSeamstresses.map((seamstress) => (
              <Card
                key={seamstress.id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={seamstress.image || "/placeholder-avatar.png"}
                    alt={seamstress.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">
                      {seamstress.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {seamstress.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">
                        {seamstress.rating}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({seamstress.completedOrders} orders)
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        seamstress.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {seamstress.isActive ? "Available" : "Busy"}
                    </span>
                  </div>
                </div>

                {/* Bio/Notes */}
                <p className="text-sm text-gray-600 mb-4">
                  {(() => {
                    const pricing = designPricings[selectedDesign.id]?.find((p: any) => p.seamstressId === seamstress.id);
                    return pricing?.notes || seamstress.bio;
                  })()}
                </p>

                {/* Specialties */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    Specialties:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {seamstress.specialty.map((specialty, index) => (
                      <span
                        key={index}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pricing and Details */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="font-medium">Price</p>
                      <p className="text-green-600 font-bold">
                        ${(() => {
                          const pricing = designPricings[selectedDesign.id]?.find((p: any) => p.seamstressId === seamstress.id);
                          return pricing?.price || seamstress.basePrice;
                        })()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="font-medium">Timeline</p>
                      <p className="text-blue-600 font-bold">
                        {(() => {
                          const pricing = designPricings[selectedDesign.id]?.find((p: any) => p.seamstressId === seamstress.id);
                          return pricing?.timeline || seamstress.estimatedDays;
                        })()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-600" />
                    <div>
                      <p className="font-medium">Orders</p>
                      <p className="text-purple-600 font-bold">
                        {seamstress.completedOrders}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-orange-600" />
                    <div>
                      <p className="font-medium">Status</p>
                      <p className="text-orange-600 font-bold">
                        {seamstress.isActive ? "Active" : "Busy"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    className={`flex-1 ${
                      !seamstress.isActive && userRole === "customer"
                        ? "bg-orange-500 hover:bg-orange-600 text-white"
                        : ""
                    }`}
                    onClick={() => {
                      if (seamstress.isActive) {
                        handleSelectSeamstress(seamstress);
                      } else {
                        handleAvailabilityToggle(seamstress);
                      }
                    }}
                    disabled={
                      seamstress.isActive &&
                      (!isLoggedIn || userRole !== "CUSTOMER")
                    }
                    variant={
                      !seamstress.isActive && userRole === "seamstress"
                        ? "outline"
                        : "default"
                    }
                  >
                    {seamstress.isActive
                      ? isLoggedIn && userRole === "CUSTOMER"
                        ? "Order Now"
                        : !isLoggedIn
                          ? "Login to Order"
                          : "Only for Customers"
                      : userRole === "seamstress"
                        ? "Click to Accept Orders"
                        : "Currently Unavailable"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Show seamstress details - could open a modal or navigate to detail page
                      alert(
                        `Viewing details for ${seamstress.name}\n\nBio: ${seamstress.bio}\nLocation: ${seamstress.location}\nSpecialties: ${seamstress.specialty.join(", ")}\nRating: ${seamstress.rating} stars\nCompleted Orders: ${seamstress.completedOrders}`,
                      );
                    }}
                    title="View seamstress details"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>

                {/* Contact Info */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-center text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {seamstress.email}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Order Modal */}
        {isOrderModalOpen && selectedSeamstress && (
          <OrderModal
            isOpen={isOrderModalOpen}
            onClose={() => setIsOrderModalOpen(false)}
            design={selectedDesign}
            seamstress={selectedSeamstress}
            onSubmit={handleOrderSubmit}
          />
        )}
      </div>
    </Layout>
  );
}
