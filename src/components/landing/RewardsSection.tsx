import { CreditCard, Bus, BookOpen, Smartphone, ShoppingBag } from "lucide-react";

const rewards = [
  { icon: CreditCard, name: "Bakery Vouchers", desc: "Bread & pastries from 50 credits", credits: "50+" },
  { icon: Bus, name: "Transport Support", desc: "Moto & taxi vouchers", credits: "80+" },
  { icon: Smartphone, name: "Mobile Airtime", desc: "500-1000 FCFA top-ups", credits: "100+" },
  { icon: BookOpen, name: "Education Support", desc: "Exercise books & school supplies", credits: "200+" },
  { icon: ShoppingBag, name: "Grocery Support", desc: "Rice, cooking oil & basics", credits: "250+" },
];

const RewardsSection = () => (
  <section id="rewards" className="py-20">
    <div className="container">
      <h2 className="mb-4 text-center font-display text-3xl font-bold text-foreground md:text-4xl">
        Rewards Await You
      </h2>
      <p className="mx-auto mb-12 max-w-lg text-center text-muted-foreground">
        Redeem your credits for <span className="font-semibold text-foreground">amazing rewards</span> that make a real difference.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {rewards.map((r) => (
          <div key={r.name} className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-card transition-transform hover:-translate-y-1">
            <div className="mb-4 rounded-xl bg-secondary p-3 text-primary">
              <r.icon className="h-7 w-7" />
            </div>
            <h3 className="mb-1 font-display text-sm font-semibold text-foreground">{r.name}</h3>
            <p className="mb-3 text-xs text-muted-foreground">{r.desc}</p>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{r.credits} credits</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default RewardsSection;
