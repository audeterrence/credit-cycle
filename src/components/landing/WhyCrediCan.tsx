import { Leaf, TrendingUp, Heart } from "lucide-react";

const reasons = [
  { 
    icon: Leaf, 
    title: "Protect the Environment", 
    desc: "Reduce waste in streets and waterways. Every item recycled counts.",
    accent: "bg-emerald-50 text-emerald-600" 
  },
  { 
    icon: TrendingUp, 
    title: "Create Value", 
    desc: "Recyclable materials have real economic value. We help you capture it.",
    accent: "bg-blue-50 text-blue-600" 
  },
  { 
    icon: Heart, 
    title: "Benefit Society", 
    desc: "Support local businesses and communities through reward partnerships.",
    accent: "bg-rose-50 text-rose-600" 
  },
];

const WhyCrediCan = () => (
  // Added id="why-us" so your Navbar "Why Credi-Can" link works perfectly
  <section id="why-us" className="py-24 bg-white scroll-mt-20 overflow-hidden">
    <div className="container relative">
      
      {/* Visual background anchor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent -z-10" />

      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="font-display text-3xl font-extrabold text-slate-900 md:text-4xl lg:text-5xl tracking-tight">
          Why <span className="text-primary">Credi-Can?</span>
        </h2>
        <div className="mt-4 h-1.5 w-20 bg-primary rounded-full mx-auto" />
      </div>

      <div className="grid gap-6 lg:gap-10 md:grid-cols-3">
        {reasons.map((r, i) => (
          <div 
            key={i} 
            className="group relative rounded-3xl border border-slate-100 bg-white p-10 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2"
          >
            {/* Number Indicator (Subtle background) */}
            <span className="absolute top-6 right-8 text-5xl font-black text-slate-50 group-hover:text-primary/5 transition-colors">
              0{i + 1}
            </span>

            <div className={`mb-8 flex h-16 w-16 items-center justify-center rounded-2xl shadow-inner transition-transform group-hover:rotate-6 ${r.accent}`}>
              <r.icon className="h-8 w-8" />
            </div>

            <h3 className="mb-4 font-display text-2xl font-bold text-slate-900">
              {r.title}
            </h3>
            
            <p className="text-slate-600 leading-relaxed font-medium">
              {r.desc}
            </p>

            {/* Bottom Accent Bar */}
            <div className="mt-8 h-1 w-0 bg-primary transition-all duration-500 group-hover:w-12 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyCrediCan;