import { Smartphone, ShoppingBag, Bus, Plus, Zap, Coffee, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";

const rewards = [
  {
    title: "Utility Payments",
    category: "Electricity & Water",
    cost: "1500 pts",
    icon: Zap,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100"
  },
  {
    title: "Communication Credit",
    category: "Airtime & Data",
    cost: "200 pts",
    icon: Smartphone,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100"
  },
  {
    title: "Essential Vouchers",
    category: "Groceries & Bakeries",
    cost: "300 pts",
    icon: ShoppingBag,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100"
  },
  {
    title: "Transport Vouchers",
    category: "Local Transit",
    cost: "1000 pts",
    icon: Bus,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100"
  },
  {
    title: "Health Support",
    category: "Pharmacy Care",
    cost: "2500 pts",
    icon: HeartPulse,
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-100"
  }
];

const RewardsSection = () => (
  <section id="rewards" className="py-24 bg-white relative overflow-hidden scroll-mt-20">
    
    {/* Subtle decorative background to kill the "flat white" look */}
    <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50/50 -z-0 skew-x-12 transform origin-right" />

    <div className="container relative z-10">
      
      {/* Header - Now in Light Mode to match the page */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h2 className="text-primary font-bold tracking-widest uppercase text-xs mb-4">Nationwide Rewards</h2>
        <h3 className="font-display text-4xl md:text-5xl font-black text-slate-900 mb-6">
          Your Impact, <span className="text-primary">Everywhere.</span>
        </h3>
        <p className="text-slate-500 text-lg">
          Whether you are in <span className="text-slate-900 font-semibold">Douala, Yaoundé, or Bafoussam</span>, your credits connect you to essential services.
        </p>
      </div>

      {/* Rewards Grid - Light & Vibrant */}
      <div className="flex flex-wrap justify-center gap-6">
        {rewards.map((r, i) => (
          <div 
            key={i} 
            className={`group relative flex flex-col justify-between w-full md:w-[280px] p-8 rounded-[2.5rem] bg-white border ${r.border} shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/50`}
          >
            <div>
              <div className={`${r.bg} ${r.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                <r.icon className="w-8 h-8" />
              </div>
              
              <h4 className="font-black text-slate-900 text-xl mb-1">{r.title}</h4>
              <p className="text-slate-500 text-sm font-medium">{r.category}</p>
            </div>
            
            <div className="mt-10 flex items-center justify-between border-t border-slate-50 pt-6">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Min. Points</span>
              <div className="bg-slate-900 text-white px-4 py-1 rounded-full">
                <span className="font-display font-bold text-sm">{r.cost}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Partner Card - Light & Dashed */}
        <div className="w-full md:w-[280px] flex flex-col items-center justify-center p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 group">
          <div className="bg-white w-14 h-14 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6 text-primary" />
          </div>
          <h4 className="font-bold text-slate-900 mb-3 text-center">Business Partner?</h4>
          <p className="text-xs text-slate-400 text-center leading-relaxed mb-6">
            Join our network and accept credits at your establishment.
          </p>
          <Button variant="link" className="text-primary font-bold h-auto p-0" asChild>
            <a href="/partner">Join the Network</a>
          </Button>
        </div>
      </div>

    </div>
  </section>
);

export default RewardsSection;