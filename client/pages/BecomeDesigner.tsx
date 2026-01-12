import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Palette,
  DollarSign,
  TrendingUp,
  Star,
  ArrowRight,
  CheckCircle,
  User,
  FileText,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

export default function BecomeDesigner() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    specialties: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    bio: "",
    general: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Get current user
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const validateForm = () => {
    const newErrors = {
      name: "",
      bio: "",
      general: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (formData.bio.trim() && formData.bio.length < 50) {
      newErrors.bio = "Bio must be at least 50 characters";
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.bio;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ name: "", bio: "", general: "" });

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // First, create connected account
      const accountResponse = await fetch('/api/create-connected-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          role: 'DESIGNER',
        }),
      });

      if (!accountResponse.ok) {
        throw new Error('Failed to create connected account');
      }

      const accountData = await accountResponse.json();
      const accountId = accountData.accountId;

      // Store account ID in user data
      const updatedUser = {
        ...user,
        stripeAccountId: accountId,
        designerProfile: formData,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Create account link for onboarding
      const linkResponse = await fetch('/api/create-account-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId,
        }),
      });

      if (!linkResponse.ok) {
        throw new Error('Failed to create account link');
      }

      const linkData = await linkResponse.json();

      // Redirect to Stripe onboarding
      window.location.href = linkData.url;
    } catch (error) {
      console.error('Error during designer signup:', error);
      setErrors({
        ...errors,
        general: "Failed to complete signup. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });

    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: "",
      });
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-transparent to-accent/5 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Palette className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-secondary mb-4">
              Complete Your Designer Profile
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Set up your designer profile and connect your bank account to start earning from your designs.
            </p>
          </div>

          {/* Bank Account Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800 mb-1">
                  Bank Account Setup Required
                </h3>
                <p className="text-sm text-yellow-700">
                  To receive payments for your designs, you'll need to complete bank account verification with Stripe.
                  This is required to ensure secure and timely payments. You'll be redirected to Stripe's secure onboarding process after submitting this form.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Display Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange("name")}
                  placeholder="Your designer name (e.g., Emma Styles)"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Bio Field */}
              <div>
                <Label htmlFor="bio" className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Bio/About You
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={handleInputChange("bio")}
                  placeholder="Tell customers about your design experience, inspiration, and what makes your designs unique..."
                  rows={4}
                  className={errors.bio ? "border-red-500" : ""}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum 50 characters. This will appear on your designer profile.
                </p>
                {errors.bio && (
                  <p className="text-red-600 text-sm mt-1">{errors.bio}</p>
                )}
              </div>

              {/* Specialties Field */}
              <div>
                <Label htmlFor="specialties" className="text-sm font-medium text-foreground mb-2">
                  Design Specialties (Optional)
                </Label>
                <Input
                  id="specialties"
                  type="text"
                  value={formData.specialties}
                  onChange={handleInputChange("specialties")}
                  placeholder="e.g., Evening Wear, Wedding Dresses, Casual Styles"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Help customers find your designs by specifying your specialties.
                </p>
              </div>

              {errors.general && (
                <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                  {errors.general}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2"
                  size="lg"
                >
                  {isLoading ? "Setting up..." : "Continue to Bank Setup"}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </form>

            {/* Back Link */}
            <div className="text-center mt-6">
              <button
                onClick={() => navigate("/choose-role")}
                className="text-primary hover:underline text-sm"
              >
                ← Back to role selection
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-secondary mb-4">
              Why Design for The Golden Stitch?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Turn your artistic vision into a sustainable income stream
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-4">
                Earn $4 Per Dress
              </h3>
              <p className="text-muted-foreground">
                Every time your design is made into a dress, you earn $4. No
                limits, no caps - the more dresses made, the more you earn.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-4">
                Passive Income
              </h3>
              <p className="text-muted-foreground">
                Upload your designs once and earn continuously as customers
                choose your work and seamstresses bring it to life.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-4">
                Build Your Brand
              </h3>
              <p className="text-muted-foreground">
                Create a designer profile, showcase your portfolio, and build a
                reputation in the fashion community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-secondary mb-4">
              Simple Design Submission Process
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From idea to income in just a few easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-4">
                Create & Upload
              </h3>
              <p className="text-muted-foreground">
                Design your dress concept and upload high-quality images with
                detailed descriptions and measurements.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-4">
                Review & Publish
              </h3>
              <p className="text-muted-foreground">
                Our team reviews your design for quality and uniqueness, then
                publishes it to our marketplace.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-4">
                Earn & Grow
              </h3>
              <p className="text-muted-foreground">
                As customers choose your design and seamstresses create dresses,
                you earn $4 for each dress made.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Earnings Examples */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-secondary mb-4">
              Real Designer Earnings
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what successful designers are earning with The Golden Stitch
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* New Designer */}
            <div className="bg-white rounded-lg p-8 border border-border text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-lg">New</span>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">$20-50</h3>
              <p className="text-sm text-muted-foreground mb-4">per month</p>
              <p className="text-muted-foreground text-sm">
                Starting out, 5-12 dresses made from your designs
              </p>
            </div>

            {/* Growing Designer */}
            <div className="bg-white rounded-lg p-8 border border-border text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-accent font-bold text-lg">Growing</span>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">
                $100-250
              </h3>
              <p className="text-sm text-muted-foreground mb-4">per month</p>
              <p className="text-muted-foreground text-sm">
                Popular designs, 25-60 dresses made, building reputation
              </p>
            </div>

            {/* Established Designer */}
            <div className="bg-white rounded-lg p-8 border border-border text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-secondary font-bold text-lg">Top</span>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">$400+</h3>
              <p className="text-sm text-muted-foreground mb-4">per month</p>
              <p className="text-muted-foreground text-sm">
                Highly sought-after designs, 100+ dresses made monthly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Design Guidelines */}
      <section className="py-20 bg-secondary text-secondary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4">
              What Makes a Great Design?
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Follow these guidelines to create designs that customers love
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/10 rounded-lg p-8">
              <h3 className="text-xl font-bold mb-4">Design Requirements</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Original, unique dress concepts</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>High-quality design images (minimum 1000x1000px)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Detailed descriptions and style notes</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Complete measurement charts</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/10 rounded-lg p-8">
              <h3 className="text-xl font-bold mb-4">Success Tips</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Focus on timeless, versatile styles</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Include multiple color variations</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Consider different body types and sizes</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Stay updated with fashion trends</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Designer Support */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-secondary mb-4">
              We're Here to Support You
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join a community of designers who support each other's success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-8 border border-border">
              <h3 className="text-xl font-bold text-secondary mb-4">
                Designer Resources
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Design tools and templates</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Photography and presentation guides</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Fashion trend analysis and insights</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Marketing and promotion strategies</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-8 border border-border">
              <h3 className="text-xl font-bold text-secondary mb-4">
                Community & Support
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Designer community forums</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Monthly designer spotlights</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Direct feedback from customers</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Priority customer support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl font-serif font-bold mb-6">
            Ready to Share Your Vision?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join hundreds of designers who are already earning from their
            creativity with The Golden Stitch platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button
                size="lg"
                className="bg-white text-secondary hover:bg-gray-50"
              >
                Become a Designer
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/browse">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-secondary"
              >
                Explore Current Designs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
