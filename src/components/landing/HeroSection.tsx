import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-illustration.png";

const HeroSection = () => (
  <section id="home" className="gradient-hero">
    <div className="container grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
      <div className="space-y-6">
        <h1 className="font-display text-4xl font-extrabold leading-tight text-foreground md:text-5xl lg:text-6xl">
          Turn Waste into <span className="text-primary">Value</span>
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">
          Get rewarded for recycling with Credi-Can. Bring clean, sorted recyclable materials and earn credits you can exchange for real rewards.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button size="lg">Get Started</Button>
          <Button variant="outline" size="lg">Learn More</Button>
        </div>
      </div>
      <div className="flex justify-center">
        <img src={heroImage} alt="Woman recycling waste and earning credits" className="w-full max-w-md animate-fade-in-up" />
      </div>
    </div>
  </section>
);

export default HeroSection;
