import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import WhyCrediCan from "@/components/landing/WhyCrediCan";
import MaterialsSection from "@/components/landing/MaterialsSection";
import RewardsSection from "@/components/landing/RewardsSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <HowItWorks />
    <WhyCrediCan />
    <MaterialsSection />
    <RewardsSection />
    <CTASection />
    <Footer />
  </div>
);

export default Index;
