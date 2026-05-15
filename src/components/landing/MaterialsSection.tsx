import { Droplets, Settings, Database, GlassWater, Info, CheckCircle2 } from "lucide-react";

const materials = [
  { 
    name: "Plastic Bottles", 
    bin: "Yellow Bin", 
    credit: "1", 
    bulk: "45", 
    icon: Droplets,
    color: "text-yellow-700",
    bg: "bg-yellow-50",
    accent: "bg-yellow-500",
    shadow: "hover:shadow-yellow-200"
  },
  { 
    name: "Aluminum Cans", 
    bin: "Orange Bin", 
    credit: "2", 
    bulk: "140", 
    icon: Database,
    color: "text-orange-700",
    bg: "bg-orange-50",
    accent: "bg-orange-500",
    shadow: "hover:shadow-orange-200"
  },
  { 
    name: "Glass Bottles", 
    bin: "Green Bin", 
    credit: "5", 
    bulk: "25", 
    icon: GlassWater,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    accent: "bg-emerald-500",
    shadow: "hover:shadow-emerald-200"
  },
  { 
    name: "Metal Scrap", 
    bin: "Red Bin", 
    credit: "3", 
    bulk: "50", 
    icon: Settings,
    color: "text-red-700",
    bg: "bg-red-50",
    accent: "bg-red-500",
    shadow: "hover:shadow-red-200"
  },
];

const MaterialsSection = () => (
  <section id="materials" className="relative bg-slate-50 py-24 overflow-hidden scroll-mt-20">
    
    <div className="container relative z-10">
      
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="mb-4 font-display text-4xl font-black text-slate-900">
          What Can You Recycle?
        </h2>
        <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-6 py-2.5 shadow-sm">
          <Info className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold text-slate-700">Pro Tip: Deposit by the Kilogram to earn bonus points!</span>
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {materials.map((m) => (
          <div 
            key={m.name} 
            className={`group relative overflow-hidden rounded-3xl border-2 border-white ${m.bg} p-8 shadow-md transition-all duration-300 hover:-translate-y-2 ${m.shadow} hover:shadow-2xl`}
          >
            {/* Visual Weight: Thick Accent Bar at Top */}
            <div className={`absolute top-0 left-0 w-full h-2 ${m.accent}`} />

            <div className="flex items-center justify-between mb-8">
              <div className={`bg-white shadow-sm ${m.color} flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:rotate-12`}>
                <m.icon className="h-8 w-8" />
              </div>
              <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter bg-white/50 border border-white ${m.color}`}>
                {m.bin}
              </span>
            </div>

            <h3 className="mb-6 font-display text-2xl font-black text-slate-900 leading-tight">
              {m.name}
            </h3>

            {/* Price Box - High Visibility */}
            <div className="space-y-4 bg-white/40 rounded-2xl p-5 border border-white/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Per Unit</span>
                <div className="flex items-center gap-1">
                  <span className={`text-3xl font-black ${m.color}`}>{m.credit}</span>
                  <span className="text-xs font-bold text-slate-400">pts</span>
                </div>
              </div>

              <div className="h-px bg-white/80 w-full" />

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Per 1kg</span>
                <div className="flex items-center gap-1">
                  <span className="text-xl font-bold text-slate-800">{m.bulk}</span>
                  <span className="text-xs font-bold text-slate-400">pts</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <CheckCircle2 className={`h-4 w-4 ${m.color}`} />
              Must be clean & sorted
            </div>
          </div>
        ))}
      </div>

    </div>
  </section>
);

export default MaterialsSection;