import { Trash2, UserPlus, Coins, Gift } from "lucide-react";

const steps = [
  { 
    num: "01", 
    icon: Trash2, 
    title: "Bring Waste", 
    desc: "Bring clean, sorted recyclable materials to a collection point.", 
    color: "text-bin-green",
    lightBg: "bg-green-50" // Soft background to make your custom color pop safely
  },
  { 
    num: "02", 
    icon: UserPlus, 
    title: "Register", 
    desc: "Sign up on our platform and get your digital wallet.", 
    color: "text-primary",
    lightBg: "bg-blue-50"
  },
  { 
    num: "03", 
    icon: Coins, 
    title: "Earn Credits", 
    desc: "Credits are awarded based on material type and quantity.", 
    color: "text-accent",
    lightBg: "bg-yellow-50"
  },
  { 
    num: "04", 
    icon: Gift, 
    title: "Get Rewards", 
    desc: "Exchange credits for bread, airtime, transport, and more.", 
    color: "text-bin-orange",
    lightBg: "bg-orange-50"
  },
];

const HowItWorks = () => (
  <section id="how-it-works" className="relative py-24 bg-slate-50 overflow-hidden">
    
    {/* Subtle Background Elements to kill the "blanc" feel */}
    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

    <div className="container relative z-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl mb-4">
          How It Works
        </h2>
        <p className="text-muted-foreground text-lg">
          Four simple steps to turn your everyday waste into digital value.
        </p>
      </div>

      {/* The Journey Grid */}
      <div className="relative">
        
        {/* Desktop Connecting Dashed Line (Fills the empty space between cards) */}
        <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0 border-t-2 border-dashed border-slate-300/80 z-0"></div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
          {steps.map((s, i) => (
            <div 
              key={i} 
              className="group relative flex flex-col items-center rounded-2xl bg-white p-8 text-center shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 overflow-hidden"
            >
              
              {/* Giant Background Watermark Number (Fills the empty space inside the card) */}
              <div className="absolute -right-4 -bottom-6 text-9xl font-display font-black text-slate-50 transition-transform duration-500 group-hover:scale-110 pointer-events-none select-none z-0">
                {s.num}
              </div>

              {/* Icon Container */}
              <div className={`relative z-10 mb-6 flex h-20 w-20 items-center justify-center rounded-2xl shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${s.lightBg}`}>
                <s.icon className={`h-9 w-9 ${s.color}`} />
              </div>
              
              {/* Text Content */}
              <div className="relative z-10">
                <h3 className="mb-3 font-display text-xl font-bold text-slate-900">
                  {s.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {s.desc}
                </p>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  </section>
);

export default HowItWorks;