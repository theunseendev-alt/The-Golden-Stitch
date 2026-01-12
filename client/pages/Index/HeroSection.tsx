import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Scissors, ArrowRight } from "lucide-react";

interface HeroSectionProps {
  userRole?: string | null;
}

export function HeroSection({ userRole }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-block">
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  ✨ Handcrafted Fashion Marketplace
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl font-serif font-bold text-secondary leading-tight">
                Where Designs
                <span className="text-primary"> Meet Magic</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                Connect with talented designers and skilled seamstresses. Order
                custom, beautifully crafted dresses made just for you.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/browse">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Browse Designs
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
              <div>
                <div className="text-2xl font-bold text-primary">2.5K+</div>
                <p className="text-sm text-muted-foreground">Designs</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">850+</div>
                <p className="text-sm text-muted-foreground">Seamstresses</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">1.2K+</div>
                <p className="text-sm text-muted-foreground">Happy Customers</p>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative h-[500px] bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Scissors className="w-16 h-16 text-white" />
                  </div>
                  <p className="text-secondary font-serif text-2xl font-bold">
                    Handcrafted
                  </p>
                  <p className="text-muted-foreground text-sm mt-2">
                    Each dress made with care
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
