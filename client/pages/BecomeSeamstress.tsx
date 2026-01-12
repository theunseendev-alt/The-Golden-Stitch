import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Scissors,
  DollarSign,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  User,
  FileText,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

export default function BecomeSeamstress() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    specialties: "",
    basePrice: "",
    experience: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    bio: "",
    basePrice: "",
    general: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Get current user
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const validateForm = () => {
    const newErrors = {
      name: "",
      bio: "",
      basePrice: "",
      general: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.bio.trim()) {
      newErrors.bio = "Bio is required";
    } else if (formData.bio.length < 50) {
      newErrors.bio = "Bio must be at least 50 characters";
    }

    if (!formData.basePrice.trim()) {
      newErrors.basePrice = "Base price is required";
    } else {
      const price = parseFloat(formData.basePrice);
      if (isNaN(price) || price < 10 || price > 1000) {
        newErrors.basePrice = "Please enter a valid price between $10 and $1000";
      }
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.bio && !newErrors.basePrice;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ name: "", bio: "", basePrice: "", general: "" });

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
          role: 'SEAMSTRESS',
        }),
      });

      if (!accountResponse.ok) {
        throw new Error('Failed to create connected account');
      }

      const accountData = await accountResponse.json();
      const accountId = accountData.accountId;

      // Store account ID and profile in user data
      const updatedUser = {
        ...user,
        stripeAccountId: accountId,
        seamstressProfile: {
          ...formData,
          basePrice: parseFloat(formData.basePrice),
        },
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
      console.error('Error during seamstress signup:', error);
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
              <Scissors className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-secondary mb-4">
              Complete Your Seamstress Profile
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Set up your seamstress profile and connect your bank account to start receiving payments for your work.
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
                  To receive payments for completed orders, you'll need to complete bank account verification with Stripe.
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
                  placeholder="Your seamstress name (e.g., Maria Rodriguez)"
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
                  Bio/About You *
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={handleInputChange("bio")}
                  placeholder="Tell customers about your sewing experience, specialties, and what makes your work stand out..."
                  rows={4}
                  className={errors.bio ? "border-red-500" : ""}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum 50 characters. This will appear on your seamstress profile.
                </p>
                {errors.bio && (
                  <p className="text-red-600 text-sm mt-1">{errors.bio}</p>
                )}
              </div>

              {/* Specialties Field */}
              <div>
                <Label htmlFor="specialties" className="text-sm font-medium text-foreground mb-2">
                  Sewing Specialties (Optional)
                </Label>
                <Input
                  id="specialties"
                  type="text"
                  value={formData.specialties}
                  onChange={handleInputChange("specialties")}
                  placeholder="e.g., Wedding Dresses, Evening Gowns, Alterations"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Help customers find you by specifying your specialties.
                </p>
              </div>

              {/* Experience Field */}
              <div>
                <Label htmlFor="experience" className="text-sm font-medium text-foreground mb-2">
                  Years of Experience (Optional)
                </Label>
                <Input
                  id="experience"
                  type="text"
                  value={formData.experience}
                  onChange={handleInputChange("experience")}
                  placeholder="e.g., 5 years professional experience"
                />
              </div>

              {/* Base Price Field */}
              <div>
                <Label htmlFor="basePrice" className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Base Price (USD)
                </Label>
                <Input
                  id="basePrice"
                  type="number"
                  min="10"
                  max="1000"
                  step="0.01"
                  value={formData.basePrice}
                  onChange={handleInputChange("basePrice")}
                  placeholder="50.00"
                  className={errors.basePrice ? "border-red-500" : ""}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your starting price for custom dress orders. You can adjust this per project.
                </p>
                {errors.basePrice && (
                  <p className="text-red-600 text-sm mt-1">{errors.basePrice}</p>
                )}
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
              Why Join The Golden Stitch?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              More than just a platform - it's your pathway to financial freedom
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-4">
                Set Your Prices
              </h3>
              <p className="text-muted-foreground">
                You're in control! Set rates that reflect your skill,
                experience, and the value you provide to customers.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-4">
                Flexible Schedule
              </h3>
              <p className="text-muted-foreground">
                Work when you want, where you want. Take on projects that fit
                your lifestyle and availability.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-4">
                Choose Your Projects
              </h3>
              <p className="text-muted-foreground">
                Browse designs and only work on projects that excite you and
                match your style and capabilities.
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
              Getting Started is Easy
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to start earning with your sewing skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-4">
                Sign Up & Verify
              </h3>
              <p className="text-muted-foreground">
                Create your profile, upload samples of your work, and get
                verified by our team of experts.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-4">
                Browse & Select
              </h3>
              <p className="text-muted-foreground">
                Browse available designs, set your pricing, and choose projects
                that match your skills.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-4">
                Create & Earn
              </h3>
              <p className="text-muted-foreground">
                Work on your projects, track progress, and get paid directly by
                customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Earnings Potential */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-secondary mb-4">
              Your Earnings Potential
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Realistic income expectations for talented seamstresses
            </p>
          </div>

          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-muted-foreground">
              Set your own rates and build your business on your terms. Your skills and dedication determine your success - if you're passionate about creating beautiful garments and have the expertise to deliver quality work, join our community of talented seamstresses and start offering your services today.
            </p>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-20 bg-secondary text-secondary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Our platform provides all the tools and support you need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/10 rounded-lg p-8">
              <h3 className="text-xl font-bold mb-4">For Your Business</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Direct customer communication</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Secure payment processing</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Order tracking and management</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Performance analytics</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/10 rounded-lg p-8">
              <h3 className="text-xl font-bold mb-4">For Your Growth</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Skills development resources</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Community support network</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Marketing and promotion tools</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Quality assurance guidance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-secondary mb-4">
              Join Our Community
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're looking for passionate seamstresses who share our values
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-8 border border-border">
              <h3 className="text-xl font-bold text-secondary mb-4">
                What We Look For
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Proven sewing and tailoring experience</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Portfolio of high-quality work</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Reliable communication and delivery</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Commitment to quality and customer satisfaction</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-8 border border-border">
              <h3 className="text-xl font-bold text-secondary mb-4">
                What You Get
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Access to exclusive design marketplace</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Fair, transparent payment system</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Support from our dedicated team</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Opportunity to build your reputation</span>
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
            Ready to Turn Your Passion into Profit?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join hundreds of successful seamstresses who are already earning
            with The Golden Stitch platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button
                size="lg"
                className="bg-white text-secondary hover:bg-gray-50"
              >
                Apply to Become a Seamstress
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>

          </div>
        </div>
      </section>
    </Layout>
  );
}
