import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "./HeroSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { FeaturesSection } from "./FeaturesSection";
import { CTASection } from "./CTASection";

export default function Index() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = user.role || null;
  const userName = user.name || null;

  return (
    <Layout userRole={userRole} userName={userName}>
      <HeroSection userRole={userRole} />
      <HowItWorksSection />
      <FeaturesSection />
      <CTASection />
    </Layout>
  );
}
