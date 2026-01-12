import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Heart, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService, Design, SavedDesign } from "@/lib/api";

export default function BrowseCustomer() {
  const navigate = useNavigate();
  const [savedDesignIds, setSavedDesignIds] = useState<Set<string>>(new Set());
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isLoggedIn = user && user.email;
  const userRole = user.role || null;

  // Fetch designs and saved designs on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all designs
        const designsResponse = await apiService.getDesigns();
        setDesigns(designsResponse.designs);

        // Fetch user's saved designs if logged in
        if (isLoggedIn) {
          try {
            const savedResponse = await apiService.getSavedDesigns();
            const savedIds = new Set(
              savedResponse.savedDesigns.map((sd: SavedDesign) => sd.designId),
            );
            setSavedDesignIds(savedIds);
          } catch (error) {
            console.error("Error fetching saved designs:", error);
            // Continue without saved designs if API fails
          }
        }
      } catch (error) {
        console.error("Error fetching designs:", error);
        setDesigns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn]);

  const toggleSaveDesign = async (designId: string) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const isCurrentlySaved = savedDesignIds.has(designId);
    const newSavedIds = new Set(savedDesignIds);

    try {
      if (isCurrentlySaved) {
        // Find the saved design ID to remove it
        const savedResponse = await apiService.getSavedDesigns();
        const savedDesign = savedResponse.savedDesigns.find(
          (sd: SavedDesign) => sd.designId === designId,
        );
        if (savedDesign) {
          await apiService.removeSavedDesign(savedDesign.id);
          newSavedIds.delete(designId);
        }
      } else {
        // Save the design
        await apiService.saveDesign(designId);
        newSavedIds.add(designId);
      }

      setSavedDesignIds(newSavedIds);
    } catch (error) {
      console.error("Error toggling save status:", error);
      // Could show a toast notification here
    }
  };

  const handleDesignInteraction = (designId: string) => {
    if (!isLoggedIn) {
      // Redirect to login if not logged in
      navigate("/login");
    } else {
      // Redirect to seamstresses page to choose a seamstress for this design
      navigate(`/seamstresses?designId=${designId}`);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent interaction with heart button
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    // Redirect to seamstresses or login
    handleDesignInteraction(designs[0]?.id || "1"); // Default to first design for demo
  };

  return (
    <Layout userRole={userRole} userName={user.name || "Guest"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-secondary mb-4">
            Browse Designs
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explore our curated collection of stunning clothing, purse, and hat designs from
            talented designers. Each design can be made by multiple seamstresses
            at different price points.
          </p>
          {!isLoggedIn && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800">
                <strong>Note:</strong> You need to be logged in to view
                seamstress options and place orders.
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
            <option>Most Popular</option>
            <option>Highest Rated</option>
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
                <img src={design.image || "https://picsum.photos/400/256?random=1"} alt={`${design.name} by ${design.designerName}`} className="w-full h-full object-cover" />
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click
                    toggleSaveDesign(design.id);
                  }}
                  className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
                  title={
                    savedDesignIds.has(design.id)
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                >
                  <Heart
                    className={`w-5 h-5 ${
                      savedDesignIds.has(design.id)
                        ? "fill-destructive text-destructive"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-secondary mb-1">
                  {design.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  by {design.designerName}
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
                    {design.rating}
                  </span>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Designer Royalty: ${design.price.toFixed(2)}
                  </span>
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      handleDesignInteraction(design.id);
                    }}
                  >
                    {isLoggedIn ? "Find Seamstresses" : "Login to Order"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-16 bg-primary/10 border border-primary/20 rounded-lg p-8">
          <h3 className="text-xl font-bold text-secondary mb-3">
            How Design Pricing Works
          </h3>
          <p className="text-muted-foreground mb-4">
            Each item is priced at $10 minimum. The designer receives $4, and
            seamstresses set their own price for the remaining amount. When you
            select a design, you'll see all available seamstresses and their
            custom pricing.
          </p>
          {isLoggedIn ? (
            <p className="text-sm text-muted-foreground">
              <strong>Ready to order?</strong> Select a design above to choose a seamstress.
            </p>
          ) : (
            <div className="flex gap-4">
              <Button
                onClick={() => navigate("/seamstresses")}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Browse All Designers
              </Button>
              <p className="text-sm text-blue-600">
                <strong>Ready to order?</strong>
                <button
                  onClick={() => navigate("/login")}
                  className="ml-2 underline hover:text-blue-800"
                >
                  Sign in to view seamstress options and pricing
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
