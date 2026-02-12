import { Leaf, TrendingUp, Heart } from "lucide-react";

const reasons = [
  { icon: Leaf, title: "Protect the Environment", desc: "Reduce waste in streets and waterways. Every item recycled counts." },
  { icon: TrendingUp, title: "Create Value", desc: "Recyclable materials have real economic value. We help you capture it." },
  { icon: Heart, title: "Benefit Society", desc: "Support local businesses and communities through reward partnerships." },
];

const WhyCrediCan = () => (
  <section className="py-20">
    <div className="container">
      <h2 className="mb-12 text-center font-display text-3xl font-bold text-foreground md:text-4xl">
        Why Credi-Can?
      </h2>
      <div className="grid gap-8 md:grid-cols-3">
        {reasons.map((r, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-8 text-center shadow-card transition-shadow hover:shadow-elevated">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-primary">
              <r.icon className="h-8 w-8" />
            </div>
            <h3 className="mb-3 font-display text-xl font-semibold text-foreground">{r.title}</h3>
            <p className="text-muted-foreground">{r.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyCrediCan;
