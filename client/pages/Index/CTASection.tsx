import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-r from-primary to-accent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <h2 className="text-4xl sm:text-5xl font-serif font-bold mb-6">
          Ready to Begin?
        </h2>
        <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
          Join The Golden Stitch community today and be part of the custom dress
          revolution
        </p>
        <Link to="/login">
          <Button
            size="lg"
            className="bg-white text-secondary hover:bg-gray-50"
          >
            Sign Up with Gmail
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
