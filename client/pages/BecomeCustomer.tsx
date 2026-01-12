import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Star,
  Shield,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function BecomeCustomer() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-transparent to-accent/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl sm:text-6xl font-serif font-bold text-secondary mb-6">
              Become a Customer
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Join thousands of fashion lovers who trust The Golden Stitch for
              unique, custom-made dresses that reflect their personal style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Start Shopping Today
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/browse">
                <Button size="lg" variant="outline">
                  Browse Designs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-secondary mb-4">
              Why Choose The Golden Stitch?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the difference of custom fashion made just for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-4">
                Unique Designs
              </h3>
              <p className="text-muted-foreground">
                Access exclusive designs you won't find anywhere else, created
                by talented designers from around the world.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-4">
                Perfect Fit
              </h3>
              <p className="text-muted-foreground">
                Every dress is made to your exact measurements, ensuring a
                perfect fit that feels like it was made just for you.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-4">
                Quality Assured
              </h3>
              <p className="text-muted-foreground">
                All dresses undergo quality checks and come with our
                satisfaction guarantee and revision policy.
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
              Simple Shopping Process
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Getting your custom dress is as easy as 1-2-3
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-4">
                Browse & Choose
              </h3>
              <p className="text-muted-foreground">
                Explore our curated collection of unique designs. Each design
                comes with detailed photos and descriptions.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-4">
                Select Seamstress
              </h3>
              <p className="text-muted-foreground">
                Choose from available seamstresses and see their custom pricing,
                reviews, and portfolios.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-4">
                Track & Receive
              </h3>
              <p className="text-muted-foreground">
                Get custom measurements, track progress, and receive your
                perfectly fitted dress at your door.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-secondary mb-4">
              What You'll Receive
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              More than just a dress - a complete fashion experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-8 border border-border">
              <h3 className="text-xl font-bold text-secondary mb-4">
                Your Custom Dress
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Made to your exact measurements</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>High-quality materials and construction</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Unique design you won't find elsewhere</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Care instructions and styling tips</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-8 border border-border">
              <h3 className="text-xl font-bold text-secondary mb-4">
                Service & Support
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Real-time order tracking</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Direct communication with seamstress</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Quality guarantee and revisions</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Professional packaging and delivery</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Transparency */}
      <section className="py-20 bg-secondary text-secondary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4">
              Fair & Transparent Pricing
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              No hidden fees - what you see is what you pay
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">Design</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Included</h3>
              <p className="text-sm opacity-90">
                The design cost is built into the seamstress pricing
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">Craft</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Variable</h3>
              <p className="text-sm opacity-90">
                Set by each seamstress based on skill and experience
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">Value</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Maximum</h3>
              <p className="text-sm opacity-90">
                Unique, custom-made dresses at fair market prices
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl font-serif font-bold mb-6">
            Ready to Find Your Perfect Dress?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have discovered the joy of
            custom fashion with The Golden Stitch
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button
                size="lg"
                className="bg-white text-secondary hover:bg-gray-50"
              >
                Sign Up & Start Shopping
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/browse">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-secondary"
              >
                Browse Designs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
