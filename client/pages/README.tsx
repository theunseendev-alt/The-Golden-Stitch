import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function README() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-8">
          <div className="text-center">
            <BookOpen className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-secondary mb-4">
              Documentation
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Complete documentation for The Golden Stitch platform
            </p>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Quick Start</h2>
              <p className="text-muted-foreground">
                Use the demo accounts to explore different user roles and
                features.
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild>
                  <a href="/">View Homepage</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/login">Try Demo</a>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
