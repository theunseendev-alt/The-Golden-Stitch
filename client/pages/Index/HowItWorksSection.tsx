export function HowItWorksSection() {
  return (
    <section className="py-20 sm:py-32 bg-white border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-secondary mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A seamless process connecting creativity, craftsmanship, and quality
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative">
            <div className="mb-4">
              <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center font-serif font-bold text-xl">
                1
              </div>
            </div>
            <h3 className="text-xl font-bold text-secondary mb-2">
              Browse & Choose
            </h3>
            <p className="text-muted-foreground">
              Explore our collection of stunning designs from talented designers
              worldwide.
            </p>
          </div>

          <div className="relative">
            <div className="mb-4">
              <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center font-serif font-bold text-xl">
                2
              </div>
            </div>
            <h3 className="text-xl font-bold text-secondary mb-2">
              Select Seamstress
            </h3>
            <p className="text-muted-foreground">
              Choose from available seamstresses and their custom pricing for
              your chosen design.
            </p>
          </div>

          <div className="relative">
            <div className="mb-4">
              <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center font-serif font-bold text-xl">
                3
              </div>
            </div>
            <h3 className="text-xl font-bold text-secondary mb-2">
              Receive & Enjoy
            </h3>
            <p className="text-muted-foreground">
              Your custom dress is crafted with precision and delivered to your
              door.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
