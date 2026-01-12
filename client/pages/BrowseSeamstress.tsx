import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Star, User, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService, Design } from "@/lib/api";

export default function BrowseSeamstress() {
  const navigate = useNavigate();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isLoggedIn = user && user.email;
  const userRole = user.role || null;

  // Fetch designs on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all designs
        const designsResponse = await apiService.getDesigns();
        let filteredDesigns = designsResponse.designs;

        if (isLoggedIn && userRole === "SEAMSTRESS") {
          // Fetch pricings for this seamstress to exclude already priced designs
          try {
            const pricingsResponse = await apiService.getDesignPricings();
            const pricedDesignIds = new Set(pricingsResponse.pricings.map(p => p.designId));
            filteredDesigns = designsResponse.designs.filter(d => !pricedDesignIds.has(d.id));
          } catch (error) {
            console.error("Error fetching pricings:", error);
            // Continue with all designs if pricing fetch fails
          }
        }

        setDesigns(filteredDesigns);
      } catch (error) {
        console.error("Error fetching designs:", error);
        setDesigns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn, userRole]);

  const handleSetPriceAndDifficulty = (designId: string) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    navigate(`/set-price-difficulty/${designId}`);
  };

  const handleSaveDesigner = (designerId: string, designerName: string) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    // TODO: Implement saving favorite designers functionality
    alert(`Saved designer: ${designerName}`);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent interaction with buttons
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    // Navigate to design details or pricing setup
    handleSetPriceAndDifficulty(designs[0]?.id || "1"); // Default to first design for demo
  };

  return (
    <Layout userRole={userRole} userName={user.name || "Guest"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-secondary mb-4">
            Browse Designs to Make
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explore available dress designs and set your prices. Choose designs
            that match your skills and expertise to maximize your earnings.
          </p>
          {!isLoggedIn && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800">
                <strong>Note:</strong> You need to be logged in to set prices
                and manage designs.
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

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search designs..."
            className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option>Sort by: Featured</option>
            <option>Newest First</option>
            <option>Highest Earning Potential</option>
            <option>By Designer</option>
          </select>
        </div>

        {/* Designs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {designs.map((design) => (
            <div
              key={design.id}
              className="bg-white rounded-lg overflow-hidden border border-border hover:border-primary transition-all hover:shadow-lg cursor-pointer"
              onClick={handleCardClick}
            >
              {/* Image */}
              <div className="h-64 relative group">
                <img src={design.image || "https://picsum.photos/400/256?random=1"} alt={design.name} className="w-full h-full object-cover" />
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click
                    handleSaveDesigner(design.designerId, design.designerName);
                  }}
                  className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
                  title="Save favorite designer"
                >
                  <User className="w-5 h-5 text-muted-foreground hover:text-primary" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-secondary mb-1">
                  {design.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Designed by {design.designerName}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(design.rating)
                            ? "fill-primary text-primary"
                            : "text-border"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {design.rating} ({design.reviews} reviews)
                  </span>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between">

                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      handleSetPriceAndDifficulty(design.id);
                    }}
                  >
                    Set Price & Rate Difficulty
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-16 bg-green-50 border border-green-200 rounded-lg p-8">
          <h3 className="text-xl font-bold text-secondary mb-3">
            How Seamstress Pricing Works
          </h3>
          <p className="text-muted-foreground mb-4">
            Each design has a base price of $10 minimum. You set your final
            price based on complexity, your skill level, and local market rates.
            The customer pays the total amount, and you receive your set price
            directly.
          </p>
          <div className="flex gap-4">
            <Button
              onClick={() => navigate("/seamstress-dashboard")}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              View My Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/profile")}
              className="border-primary text-primary hover:bg-primary/10"
            >
              <Settings className="w-4 h-4 mr-2" />
              Update Profile
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
