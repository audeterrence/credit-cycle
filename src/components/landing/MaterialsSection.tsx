const materials = [
  { name: "Plastic Bottles", bin: "Yellow Bin", credit: "2 credits/unit", bulk: "20 credits/kg", color: "bg-bin-yellow", emoji: "🟡" },
  { name: "Metal", bin: "Red Bin", credit: "5 credits/unit", bulk: "40 credits/kg", color: "bg-bin-red", emoji: "🔴" },
  { name: "Cans", bin: "Orange Bin", credit: "3 credits/unit", bulk: "30 credits/kg", color: "bg-bin-orange", emoji: "🟠" },
  { name: "Glass", bin: "Green Bin", credit: "4 credits/unit", bulk: "25 credits/kg", color: "bg-bin-green", emoji: "🟢" },
];

const MaterialsSection = () => (
  <section className="bg-card py-20">
    <div className="container">
      <h2 className="mb-4 text-center font-display text-3xl font-bold text-foreground md:text-4xl">
        What Can You Recycle?
      </h2>
      <p className="mx-auto mb-12 max-w-xl text-center text-muted-foreground">
        Clean, sorted, and usable materials earn you credits instantly.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {materials.map((m) => (
          <div key={m.name} className="overflow-hidden rounded-2xl border border-border bg-background shadow-card">
            <div className={`${m.color} flex items-center justify-center py-5 text-4xl`}>
              {m.emoji}
            </div>
            <div className="p-5">
              <h3 className="font-display text-lg font-semibold text-foreground">{m.name}</h3>
              <p className="mb-3 text-sm text-muted-foreground">{m.bin}</p>
              <div className="space-y-1 text-sm">
                <p className="font-medium text-primary">{m.credit}</p>
                <p className="text-muted-foreground">{m.bulk} (bulk)</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default MaterialsSection;
