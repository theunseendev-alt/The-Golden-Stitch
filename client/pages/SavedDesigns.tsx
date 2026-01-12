import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Heart,
  Star,
  ShoppingBag,
  Trash2,
  Eye,
  Clock,
  User,
  Palette,
  Filter,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiService, SavedDesign, Design } from "@/lib/api";

export default function SavedDesigns() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isLoggedIn = user && user.email;
  const userRole = user.role || null;
  const userName = user.name || "Guest";

  // Fetch saved designs on component mount
  useEffect(() => {
    const fetchSavedDesigns = async () => {
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiService.getSavedDesigns();
        setSavedDesigns(response.savedDesigns);
      } catch (error) {
        console.error("Error fetching saved designs:", error);
        setSavedDesigns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedDesigns();
  }, [isLoggedIn]);

  const handleRemoveFromSaved = async (savedDesignId: string) => {
    if (!confirm("Remove this design from your saved items?")) return;

    try {
      await apiService.removeSavedDesign(savedDesignId);
      setSavedDesigns((prev) => prev.filter((sd) => sd.id !== savedDesignId));
    } catch (error) {
      console.error("Error removing saved design:", error);
      alert("Failed to remove design from saved items");
    }
  };

  const handleViewDesign = (designId: string) => {
    navigate(`/browse`);
  };

  const handleOrderDesign = (designId: string) => {
    navigate(`/seamstresses`);
  };

  const filteredDesigns = savedDesigns.filter((savedDesign) => {
    const design = savedDesign.design;
    const matchesSearch =
      design.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      design.designerName.toLowerCase().includes(searchTerm.toLowerCase());
    // For now, we'll show all since we don't have status in the real data structure
    return matchesSearch;
  });

  // Calculate stats from real data
  const totalSaved = savedDesigns.length;
  const avgRating =
    savedDesigns.length > 0
      ? (
          savedDesigns.reduce((sum, sd) => sum + sd.design.rating, 0) /
          savedDesigns.length
        ).toFixed(1)
      : "0.0";
  const priceRange =
    savedDesigns.length > 0
      ? `$${(Math.min(...savedDesigns.map((sd) => sd.design.price)) * 10).toFixed(0)}-$${(Math.max(...savedDesigns.map((sd) => sd.design.price)) * 10).toFixed(0)}`
      : "$0";

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-green-100 text-green-800";
      case "popular":
        return "bg-blue-100 text-blue-800";
      case "trending":
        return "bg-purple-100 text-purple-800";
      case "limited":
        return "bg-yellow-100 text-yellow-800";
      case "bestseller":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout userRole={userRole} userName={userName}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-secondary mb-2">
            Saved Designs
          </h1>
          <p className="text-muted-foreground">
            Your favorite dress designs waiting to be made
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="text-2xl font-bold text-primary">{totalSaved}</div>
            <p className="text-sm text-muted-foreground">Total Saved</p>
          </Card>
          <Card className="p-6">
            <div className="text-2xl font-bold text-primary">{avgRating}</div>
            <p className="text-sm text-muted-foreground">Avg. Rating</p>
          </Card>
          <Card className="p-6">
            <div className="text-2xl font-bold text-primary">{priceRange}</div>
            <p className="text-sm text-muted-foreground">Price Range</p>
          </Card>
          <Card className="p-6">
            <div className="text-2xl font-bold text-primary">
              {savedDesigns.length}
            </div>
            <p className="text-sm text-muted-foreground">Active Designs</p>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search saved designs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="popular">Popular</option>
              <option value="trending">Trending</option>
              <option value="limited">Limited</option>
              <option value="bestseller">Bestseller</option>
            </select>
          </div>
        </div>

        {/* Saved Designs Grid */}
        {filteredDesigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDesigns.map((savedDesign) => (
              <Card
                key={savedDesign.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[3/4] bg-gray-200 overflow-hidden">
                  <img
                    src={savedDesign.design.image}
                    alt={savedDesign.design.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-secondary mb-1">
                        {savedDesign.design.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <User className="w-3 h-3" />
                        <span>by {savedDesign.design.designerName}</span>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full bg-green-100 text-green-800`}
                    >
                      Available
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">
                        {savedDesign.design.rating}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-primary">
                      ${(savedDesign.design.price * 10).toFixed(0)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    <Clock className="w-3 h-3" />
                    <span>
                      Saved on{" "}
                      {new Date(savedDesign.savedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleOrderDesign(savedDesign.design.id)}
                    >
                      <ShoppingBag className="w-3 h-3 mr-1" />
                      Order Now
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDesign(savedDesign.design.id)}
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveFromSaved(savedDesign.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary mb-2">
              No saved designs found
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || filterBy !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Start browsing designs and save your favorites to see them here"}
            </p>
            <Button onClick={() => navigate("/browse")}>
              <Palette className="w-4 h-4 mr-2" />
              Browse Designs
            </Button>
          </div>
        )}

        {/* Recommendations */}
        <div className="mt-12">
          <h2 className="text-2xl font-serif font-bold text-secondary mb-6">
            You Might Also Like
          </h2>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
            <Palette className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-secondary mb-2">
              Discover New Designs
            </h3>
            <p className="text-muted-foreground mb-4">
              Explore our curated collection of unique dress designs from
              talented creators
            </p>
            <Button onClick={() => navigate("/browse")}>
              Browse All Designs
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
