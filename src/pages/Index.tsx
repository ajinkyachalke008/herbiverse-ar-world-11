import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import HerbSlider3D from "@/components/HerbSlider3D";
import InteractiveFeatures from "@/components/InteractiveFeatures";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <Navigation />
      <main>
        <HeroSection />
        <HerbSlider3D />
        <InteractiveFeatures />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
