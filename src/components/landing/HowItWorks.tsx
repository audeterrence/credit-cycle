import { Trash2, UserPlus, Coins, Gift } from "lucide-react";

const steps = [
  { icon: Trash2, title: "Bring Waste", desc: "Bring clean, sorted recyclable materials to a collection point.", color: "text-bin-green" },
  { icon: UserPlus, title: "Register", desc: "Sign up on our platform and get your digital wallet.", color: "text-primary" },
  { icon: Coins, title: "Earn Credits", desc: "Credits are awarded based on material type and quantity.", color: "text-accent" },
  { icon: Gift, title: "Get Rewards", desc: "Exchange credits for bread, airtime, transport, and more.", color: "text-bin-orange" },
];

const HowItWorks = () => (
  <section id="how-it-works" className="bg-card py-20">
    <div className="container">
      <h2 className="mb-12 text-center font-display text-3xl font-bold text-foreground md:text-4xl">
        How It Works
      </h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <div key={i} className="flex flex-col items-center rounded-xl bg-secondary/50 p-6 text-center shadow-card transition-transform hover:-translate-y-1">
            <div className={`mb-4 rounded-full bg-card p-4 shadow-card ${s.color}`}>
              <s.icon className="h-8 w-8" />
            </div>
            <h3 className="mb-2 font-display text-lg font-semibold text-foreground">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
