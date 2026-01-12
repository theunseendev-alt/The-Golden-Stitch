import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Palette,
  Upload,
  DollarSign,
  Eye,
  TrendingUp,
  Heart,
  LogOut,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiService, Design } from "@/lib/api";
import BankAccountAlert from "@/components/BankAccountAlert";

export default function DesignerDashboard() {
  const navigate = useNavigate();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);

  // Get current user
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const response = await apiService.getDesigns();
        // Filter designs by current user's designerId
        const userDesigns = response.designs.filter((design: Design) =>
          design.designerId === user.userId || design.designerId === user.email
        );
        setDesigns(userDesigns);
      } catch (error) {
        console.error("Error fetching designs:", error);
        setDesigns([]);
      } finally {
        setLoading(false);
      }
    };

    if (user.email) {
      fetchDesigns();
    }
  }, [user]);

  const handleUploadNewDesign = () => {
    // Navigate to upload design form instead of just showing alert
    navigate("/designer-upload");
  };

  const handleViewAnalytics = (designId: string) => {
    // Show analytics in an alert for now
    const design = designs.find((d) => d.id === designId);
    if (design) {
      // Placeholder for ratings from seamstress completions
      // In a real app, this would fetch orders for this design and calculate average rating from seamstress feedback
      const seamstressRating = 4.2; // Placeholder
      const totalOrders = 5; // Placeholder
      alert(
        `Analytics for "${design.name}":\n\nOverall Rating: ${design.rating}/5 (${design.reviews} reviews)\nSeamstress Rating: ${seamstressRating}/5 (from ${totalOrders} completed orders)\n\nStatus: ${design.isActive ? "Active" : "Inactive"}\n\nNote: Seamstress ratings are updated when orders are completed.`,
      );
    }
  };



  const handleDeleteDesign = async (designId: string, designName: string) => {
    if (!confirm(`Are you sure you want to delete "${designName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      // For demo, just remove from localStorage
      const designsData = JSON.parse(localStorage.getItem("designs") || "[]");
      const updatedDesigns = designsData.filter((d: any) => d.id !== designId);
      localStorage.setItem("designs", JSON.stringify(updatedDesigns));

      // Remove from state
      setDesigns(designs.filter(d => d.id !== designId));

      alert("Design deleted successfully!");
    } catch (error) {
      console.error("Error deleting design:", error);
      alert("Failed to delete design. Please try again.");
    }
  };




  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800";
      case "In Production":
        return "bg-blue-100 text-blue-800";
      case "Sold Out":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };



  return (
    <Layout>
      <BankAccountAlert userId={user.userId || user.id} />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Designer Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {user.name || "Designer"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button size="sm" onClick={handleUploadNewDesign}>
                <Upload className="w-4 h-4 mr-2" />
                Upload New Design
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-8">
            {/* My Designs */}
            <div>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    My Designs
                  </h2>
                  <Button size="sm" onClick={handleUploadNewDesign}>
                    <Upload className="w-4 h-4 mr-2" />
                    Add New
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {designs.map((design) => (
                    <div key={design.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-3 overflow-hidden">
                        <img
                          src={design.image}
                          alt={design.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-medium text-gray-900 mb-2">
                        {design.title}
                      </h3>
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getStatusColor(design.status)}`}
                        >
                          {design.status}
                        </span>
                        <span className="text-sm font-bold text-primary">
                          $4/design
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {design.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {design.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {design.orders}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleViewAnalytics(design.id)}
                        >
                          <BarChart3 className="w-3 h-3 mr-1" />
                          View Analytics
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
