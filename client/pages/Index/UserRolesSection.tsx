import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Palette, Scissors } from "lucide-react";

export function UserRolesSection() {
  return (
    <section className="py-20 sm:py-32 bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold mb-4">
            Join Our Community
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Whether you're a designer, seamstress, or customer, there's a place
            for you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-secondary/80 border border-secondary/50 rounded-lg p-8 text-center hover:bg-secondary/90 transition-colors">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-3">
              For Customers
            </h3>
            <p className="opacity-90 mb-6">
              Discover custom dresses designed and crafted just for you
            </p>
            <Link to="/become-customer">
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
                variant="default"
              >
                Start Shopping
              </Button>
            </Link>
          </div>

          <div className="bg-secondary/80 border border-secondary/50 rounded-lg p-8 text-center hover:bg-secondary/90 transition-colors">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Palette className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-3">
              For Designers
            </h3>
            <p className="opacity-90 mb-6">
              Showcase your creativity and earn $4 per design sold
            </p>
            <Link to="/become-designer">
              <Button
                className="bg-accent text-accent-foreground hover:bg-accent/90 w-full"
                variant="default"
              >
                Share Your Designs
              </Button>
            </Link>
          </div>

          <div className="bg-secondary/80 border border-secondary/50 rounded-lg p-8 text-center hover:bg-secondary/90 transition-colors">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Scissors className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-3">
              For Seamstresses
            </h3>
            <p className="opacity-90 mb-6">
              Choose designs you love and set your own prices
            </p>
            <Link to="/become-seamstress">
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
                variant="default"
              >
                Join Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
