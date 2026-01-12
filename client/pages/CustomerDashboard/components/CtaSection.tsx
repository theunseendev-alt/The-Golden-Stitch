import { Button } from "@/components/ui/button";

interface CtaSectionProps {
  onBrowseDesigns: () => void;
}

export function CtaSection({ onBrowseDesigns }: CtaSectionProps) {
  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-8 text-center">
      <h3 className="text-lg font-bold text-secondary mb-3">
        Ready for another dress?
      </h3>
      <p className="text-muted-foreground mb-4">
        Browse our collection of designs and order from the seamstress of
        your choice
      </p>
      <Button
        className="bg-primary text-primary-foreground hover:bg-primary/90"
        onClick={onBrowseDesigns}
      >
        Browse Designs
      </Button>
    </div>
  );
}