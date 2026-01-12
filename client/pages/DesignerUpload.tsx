import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, ArrowLeft, Plus, X, Image as ImageIcon, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function DesignerUpload() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    itemType: "",
    category: "",
  });
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string>("");
  const [backPreview, setBackPreview] = useState<string>("");

  const handleFrontImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setFrontImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setFrontPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleBackImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setBackImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setBackPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeFrontImage = () => {
    setFrontImage(null);
    setFrontPreview("");
  };

  const removeBackImage = () => {
    setBackImage(null);
    setBackPreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!frontImage || !backImage) {
      alert("Please upload both front and back images of your design");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.email) {
      alert("Please log in to upload designs");
      navigate("/login");
      return;
    }

    try {
      const designData = {
        name: formData.title,
        description: formData.description,
        category: formData.category,
        itemType: formData.itemType,
        designerId: user.userId || user.email,
        designerName: user.name,
        image: frontPreview, // Use base64 front image as main image
        backImage: backPreview,
        price: 10, // Base price
        rating: 0,
        reviews: 0,
        tags: [],
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      const accessToken = localStorage.getItem("accessToken");

      const response = await fetch("/api/designs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        body: JSON.stringify(designData),
      });

      if (response.ok) {
        alert("Listing created successfully! Your design is now available on your My Designs page and the Seamstresses Browse page.");
        navigate("/designer-dashboard");
      } else {
        alert("Failed to upload design. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading design. Please try again.");
    }
  };

  const categories = [
    // Clothing
    "Evening Gowns",
    "Cocktail Dresses",
    "Casual Dresses",
    "Wedding Dresses",
    "Business Dresses",
    "Party Dresses",
    "Tops",
    "Shirts",
    "Blouses",
    "Sweaters",
    "Pants",
    "Skirts",
    "Jackets",
    "Coats",
    // Purses
    "Handbags",
    "Totes",
    "Clutches",
    "Backpacks",
    "Wallets",
    // Hats
    "Baseball Caps",
    "Fedora",
    "Beanie",
    "Sun Hats",
    "Bowler Hats",
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/designer-dashboard")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Create New Listing
              </h1>
              <p className="text-sm text-gray-600">
                Share your design with our community
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Design Images */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Design Images
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Upload both front and back images of your design (required)
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Front Image Upload */}
                <div>
                  <Label className="block mb-2 font-medium">Front View *</Label>
                  {frontPreview ? (
                    <div className="relative">
                      <img
                        src={frontPreview}
                        alt="Front view preview"
                        className="w-full h-64 object-cover rounded-lg border-2 border-green-500"
                      />
                      <button
                        type="button"
                        onClick={removeFrontImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                      <ImageIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-3 text-sm">
                        Front view of your design
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFrontImageUpload}
                        className="hidden"
                        id="front-image-upload"
                      />
                      <Label htmlFor="front-image-upload">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="cursor-pointer"
                          asChild
                        >
                          <span>
                            <Plus className="w-4 h-4 mr-2" />
                            Select Front Image
                          </span>
                        </Button>
                      </Label>
                    </div>
                  )}
                </div>

                {/* Back Image Upload */}
                <div>
                  <Label className="block mb-2 font-medium">Back View *</Label>
                  {backPreview ? (
                    <div className="relative">
                      <img
                        src={backPreview}
                        alt="Back view preview"
                        className="w-full h-64 object-cover rounded-lg border-2 border-green-500"
                      />
                      <button
                        type="button"
                        onClick={removeBackImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                      <ImageIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-3 text-sm">
                        Back view of your design
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBackImageUpload}
                        className="hidden"
                        id="back-image-upload"
                      />
                      <Label htmlFor="back-image-upload">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="cursor-pointer"
                          asChild
                        >
                          <span>
                            <Plus className="w-4 h-4 mr-2" />
                            Select Back Image
                          </span>
                        </Button>
                      </Label>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Design Details */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Design Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Title */}
                <div>
                  <Label htmlFor="title">Design Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., Elegant Evening Gown"
                    required
                  />
                </div>

                {/* Item Type */}
                <div>
                  <Label htmlFor="itemType">Item Type</Label>
                  <select
                    id="itemType"
                    value={formData.itemType}
                    onChange={(e) =>
                      setFormData({ ...formData, itemType: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select item type</option>
                    <option value="CLOTHING">Clothing</option>
                    <option value="PURSE">Purse</option>
                    <option value="HAT">Hat</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe your design, its style, fabric requirements, and any special notes for seamstresses..."
                  rows={4}
                  required
                />
              </div>
            </Card>

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/designer-dashboard")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-8 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!frontImage || !backImage}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Upload Design
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
