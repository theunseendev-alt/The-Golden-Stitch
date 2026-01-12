import { Palette, Scissors, ShieldCheck, TrendingUp } from "lucide-react";

export function FeaturesSection() {
  return (
    <section className="py-20 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-secondary mb-4">
            Why Choose Us
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The Golden Stitch offers a unique experience for everyone
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-lg border border-border hover:border-primary transition-colors hover:shadow-md">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Palette className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-secondary mb-2">
              Unique Designs
            </h3>
            <p className="text-muted-foreground">
              Access exclusive designs created by talented designers,
              unavailable anywhere else.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-border hover:border-primary transition-colors hover:shadow-md">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Scissors className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-secondary mb-2">
              Expert Craftsmanship
            </h3>
            <p className="text-muted-foreground">
              Vetted seamstresses bring your vision to life with exceptional
              attention to detail.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-border hover:border-primary transition-colors hover:shadow-md">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-secondary mb-2">
              Quality Assured
            </h3>
            <p className="text-muted-foreground">
              Every dress is reviewed to ensure it meets our high quality
              standards.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-border hover:border-primary transition-colors hover:shadow-md">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-secondary mb-2">
              Fair Pricing
            </h3>
            <p className="text-muted-foreground">
              Designers earn $4 per dress, seamstresses set competitive rates,
              and customers get value.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
