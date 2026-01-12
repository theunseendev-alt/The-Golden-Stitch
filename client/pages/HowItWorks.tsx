import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Palette,
  Scissors,
  Star,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function HowItWorks() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-transparent to-accent/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-serif font-bold text-secondary mb-6">
              How It Works
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              A simple, transparent process that connects talented designers,
              skilled seamstresses, and fashion-forward customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/browse">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Browse Designs
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-secondary mb-4">
              The Complete Journey
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From design inspiration to your doorstep in just three simple
              steps
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Step 1: Browse & Choose */}
            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-white" />
              </div>
              <div className="mb-4">
                <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-2">
                  Step 1
                </span>
                <h3 className="text-2xl font-bold text-secondary mb-4">
                  Browse & Choose
                </h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Explore our curated collection of unique designs from talented
                designers worldwide. Each design comes with detailed photos,
                descriptions, and style notes.
              </p>
              <ul className="text-sm text-left space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  High-quality design images
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Detailed measurements guide
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Designer profiles and ratings
                </li>
              </ul>
            </div>

            {/* Step 2: Select Seamstress */}
            <div className="text-center">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <Scissors className="w-10 h-10 text-white" />
              </div>
              <div className="mb-4">
                <span className="inline-block bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium mb-2">
                  Step 2
                </span>
                <h3 className="text-2xl font-bold text-secondary mb-4">
                  Select Seamstress
                </h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Choose from available seamstresses who specialize in your chosen
                design. Each seamstress sets their own prices and timeline.
              </p>
              <ul className="text-sm text-left space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Transparent pricing from seamstresses
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Reviews and portfolio galleries
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Direct messaging with artisans
                </li>
              </ul>
            </div>

            {/* Step 3: Receive & Enjoy */}
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-10 h-10 text-white" />
              </div>
              <div className="mb-4">
                <span className="inline-block bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium mb-2">
                  Step 3
                </span>
                <h3 className="text-2xl font-bold text-secondary mb-4">
                  Receive & Enjoy
                </h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Your custom dress is carefully crafted and delivered to your
                door. Track progress and communicate with your seamstress
                throughout the process.
              </p>
              <ul className="text-sm text-left space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  Real-time order tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  Progress photos from seamstress
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  Quality guarantee & revisions
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-secondary mb-4">
              Who Can Participate?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform welcomes everyone in the fashion ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Customers */}
            <div className="bg-white rounded-lg p-8 text-center border border-border hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-4">
                Customers
              </h3>
              <p className="text-muted-foreground mb-6">
                Fashion lovers seeking unique, custom-made dresses that reflect
                their personal style and fit perfectly.
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground text-left">
                <li>• Browse exclusive designs</li>
                <li>• Choose your preferred seamstress</li>
                <li>• Get custom sizing</li>
                <li>• Track your order progress</li>
              </ul>
            </div>

            {/* Designers */}
            <div className="bg-white rounded-lg p-8 text-center border border-border hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-4">
                Designers
              </h3>
              <p className="text-muted-foreground mb-6">
                Creative minds who want to share their designs with the world
                and earn money for their artistry.
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground text-left">
                <li>• Upload your dress designs</li>
                <li>• Earn $4 per dress made</li>
                <li>• Build your designer profile</li>
                <li>• Track sales and earnings</li>
              </ul>
            </div>

            {/* Seamstresses */}
            <div className="bg-white rounded-lg p-8 text-center border border-border hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scissors className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-4">
                Seamstresses
              </h3>
              <p className="text-muted-foreground mb-6">
                Skilled artisans who love creating beautiful dresses and want to
                work on designs they're passionate about.
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground text-left">
                <li>• Choose designs you love</li>
                <li>• Set your own prices</li>
                <li>• Control your workload</li>
                <li>• Build your reputation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-secondary mb-4">
              Fair & Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everyone gets paid fairly while keeping prices reasonable for
              customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-lg">$4</span>
              </div>
              <h3 className="text-lg font-bold text-secondary mb-2">
                Per Design
              </h3>
              <p className="text-sm text-muted-foreground">
                Designers earn $4 every time their design is made into a dress
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-accent font-bold text-lg">You</span>
              </div>
              <h3 className="text-lg font-bold text-secondary mb-2">
                Set Your Rate
              </h3>
              <p className="text-sm text-muted-foreground">
                Seamstresses choose their own pricing based on skill and
                experience
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-secondary font-bold text-lg">100%</span>
              </div>
              <h3 className="text-lg font-bold text-secondary mb-2">Value</h3>
              <p className="text-sm text-muted-foreground">
                Customers get unique, custom-made dresses at fair market prices
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl font-serif font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of designers, seamstresses, and customers who are
            already part of The Golden Stitch community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/browse">
              <Button
                size="lg"
                className="bg-white text-secondary hover:bg-gray-50"
              >
                Browse Designs
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-secondary"
              >
                Join Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
