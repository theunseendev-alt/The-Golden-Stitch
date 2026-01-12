import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
    phone: "",
    image: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (!storedUser.email) {
      navigate("/login");
      return;
    }
    setUser(storedUser);
    setFormData({
      name: storedUser.name || "",
      email: storedUser.email || "",
      bio: storedUser.bio || "",
      location: storedUser.location || "",
      phone: storedUser.phone || "",
      image: storedUser.image || "",
    });
  }, [navigate]);

  const handleSave = () => {
    const updatedUser = { ...user, ...formData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      bio: user.bio || "",
      location: user.location || "",
      phone: user.phone || "",
      image: user.image || "",
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userRole={user.role} userName={user.name}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-secondary mb-4">
            My Profile
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <Card className="p-6">
            <div className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={user.image || ""} alt={user.name} />
                <AvatarFallback className="text-2xl">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold text-secondary mb-2">{user.name}</h2>
              <p className="text-muted-foreground mb-4">{user.email}</p>
              <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {user.role || "Customer"}
              </div>
            </div>
          </Card>

          {/* Profile Details */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-secondary">Profile Information</h2>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleSave} size="sm">
                    Save
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="image">Profile Image</Label>
                {isEditing ? (
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => setFormData({ ...formData, image: reader.result as string });
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-muted-foreground">{user.image ? "Image set" : "No image set"}</p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-muted-foreground">{user.name || "Not set"}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1"
                      disabled
                    />
                  ) : (
                    <p className="mt-1 text-muted-foreground">{user.email}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-muted-foreground">{user.bio || "No bio set"}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  {isEditing ? (
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="City, Country"
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-muted-foreground">{user.location || "Not set"}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-muted-foreground">{user.phone || "Not set"}</p>
                  )}
                </div>
              </div>

              {/* Role-specific info */}
              {user.role === "SEAMSTRESS" && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="text-lg font-semibold text-secondary mb-4">Seamstress Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Base Price</Label>
                      <p className="mt-1 text-muted-foreground">${user.basePrice || "50"}</p>
                    </div>
                    <div>
                      <Label>Estimated Days</Label>
                      <p className="mt-1 text-muted-foreground">{user.estimatedDays || "7-14 days"}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label>Specialties</Label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {(user.specialty || []).map((spec: string, index: number) => (
                        <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {user.role === "DESIGNER" && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="text-lg font-semibold text-secondary mb-4">Designer Stats</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Total Designs</Label>
                      <p className="mt-1 text-muted-foreground">{user.totalDesigns || "0"}</p>
                    </div>
                    <div>
                      <Label>Active Designs</Label>
                      <p className="mt-1 text-muted-foreground">{user.activeDesigns || "0"}</p>
                    </div>
                    <div>
                      <Label>Total Earnings</Label>
                      <p className="mt-1 text-muted-foreground">${user.totalEarnings || "0"}</p>
                    </div>
                  </div>
                </div>
              )}
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