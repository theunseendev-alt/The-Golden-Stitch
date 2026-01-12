import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useLocation, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface PlaceholderPageProps {
  title?: string;
  description?: string;
}

export default function PlaceholderPage({
  title = "Page Coming Soon",
  description = "This page is currently under development. Let us know what features you'd like to see!",
}: PlaceholderPageProps) {
  const location = useLocation();
  const pageName =
    location.pathname
      .split("/")
      .filter(Boolean)
      .pop()
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase()) || "This Page";

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-4xl">🚀</div>
          </div>

          <h1 className="text-3xl font-serif font-bold text-secondary mb-4">
            {title}
          </h1>

          <p className="text-muted-foreground mb-8">{description}</p>

          <div className="space-y-3">
            <Link to="/">
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2"
                size="lg"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Home
              </Button>
            </Link>

            <Link to="/browse">
              <Button variant="outline" className="w-full" size="lg">
                Browse Designs
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground mt-8">
            Page path: {location.pathname}
          </p>
        </div>
      </div>
    </Layout>
  );
}
