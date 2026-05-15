import { Button } from "@/components/ui/button";
import { ArrowRight, Recycle, Smartphone, ShoppingBag, CheckCircle2 } from "lucide-react";

const HeroSection = () => (
  <section id="home" className="gradient-hero relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
    
    <div className="container grid items-center gap-12 lg:grid-cols-2">
      
      {/* LEFT SIDE: Enhanced Typography & Trust Indicators (Fixes "Too Empty") */}
      <div className="space-y-8 z-10">
        
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold animate-fade-in-up">
          <Recycle className="w-4 h-4" /> 
          <span>The smarter way to recycle in Cameroon</span>
        </div>
        
        <div className="space-y-4">
          <h1 className="font-display text-4xl font-extrabold leading-[1.1] text-foreground md:text-5xl lg:text-6xl">
            Turn Waste into <span className="text-primary block mt-1">Instant Value.</span>
          </h1>
          <p className="max-w-lg text-lg text-muted-foreground leading-relaxed">
            Get rewarded for recycling with Credi-Can. Bring clean, sorted plastic bottles, metal, and glass to our kiosks and instantly earn credits you can exchange for real rewards.
          </p>
        </div>
        
        {/* Buttons */}
        <div className="flex flex-wrap gap-4">
          <Button size="lg" className="h-12 px-8 shadow-lg shadow-primary/20" asChild>
            <a href="/signup">
              Get Started <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </Button>
          <Button variant="outline" size="lg" className="h-12 px-8 bg-background/50" asChild>
            <a href="#how-it-works">Learn More</a>
          </Button>
        </div>

        {/* Bullet Points to fill whitespace and add clarity */}
        <div className="pt-4 flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm font-medium text-foreground/80">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" /> Easy drop-off
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" /> Instant credit
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" /> Real rewards
          </div>
        </div>

      </div>

      {/* RIGHT SIDE: App UI Mockup (Fixes "Not Descriptive Vector Image") */}
      <div className="relative mx-auto w-full max-w-[420px] lg:ml-auto">
        
        {/* Background Glow to make it pop */}
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full -z-10 transform translate-y-10"></div>

        {/* The Mockup Card */}
        <div className="bg-card border shadow-2xl rounded-3xl p-6 space-y-6 animate-fade-in-up relative z-10">
          
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h3 className="font-bold text-lg">My Wallet</h3>
              <p className="text-xs text-muted-foreground">ID: 8472-Camer</p>
            </div>
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
              Active User
            </div>
          </div>

          {/* Balance Section */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5 border border-primary/10">
            <p className="text-sm text-muted-foreground font-medium mb-1">Total Credits Available</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-foreground">2,450</span>
              <span className="text-sm font-bold text-primary mb-1">pts</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">≈ 1,225 FCFA in value</p>
          </div>

          {/* Recent Activity List - Highly Descriptive of the App's Purpose */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-foreground">Recent Activity</h4>
            
            {/* Deposit Item */}
            <div className="flex items-center justify-between bg-muted/30 p-3 rounded-xl border border-border/50">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2.5 rounded-full">
                  <Recycle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-sm">Plastic Bottles</p>
                  <p className="text-xs text-muted-foreground">Akwa Kiosk Drop-off</p>
                </div>
              </div>
              <span className="font-bold text-green-600">+120 pts</span>
            </div>

            {/* Reward Item 1 */}
            <div className="flex items-center justify-between bg-muted/30 p-3 rounded-xl border border-border/50">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2.5 rounded-full">
                  <Smartphone className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-bold text-sm">MTN MoMo Cashout</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
              <span className="font-bold text-foreground">-1,000 pts</span>
            </div>

            {/* Reward Item 2 */}
            <div className="flex items-center justify-between bg-muted/30 p-3 rounded-xl border border-border/50">
              <div className="flex items-center gap-3">
                <div className="bg-amber-100 p-2.5 rounded-full">
                  <ShoppingBag className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-bold text-sm">Boulangerie Saker</p>
                  <p className="text-xs text-muted-foreground">Bread Voucher</p>
                </div>
              </div>
              <span className="font-bold text-foreground">-500 pts</span>
            </div>

          </div>

          {/* Bottom Action Button */}
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md">
            Scan Kiosk QR Code
          </Button>

        </div>
      </div>

    </div>
  </section>
);

export default HeroSection;