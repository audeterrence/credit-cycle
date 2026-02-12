import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Recycle, LogOut, Coins, Trophy, Package, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserSubmissions, getUserTransactions, getUserMaterialStats, MATERIALS, REWARDS, redeemReward } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const binColorMap: Record<string, string> = {
  Yellow: "bg-bin-yellow",
  Red: "bg-bin-red",
  Orange: "bg-bin-orange",
  Green: "bg-bin-green",
};

const Dashboard = () => {
  const { user, logout, refresh } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
  }, [user, navigate]);

  if (!user) return null;

  const submissions = getUserSubmissions(user.id);
  const approved = submissions.filter((s) => s.status === "APPROVED");
  const materialStats = getUserMaterialStats(user.id);
  const transactions = getUserTransactions(user.id);
  const last5 = submissions.slice(-5).reverse();

  const handleRedeem = (rewardId: string) => {
    try {
      redeemReward(user.id, rewardId);
      refresh();
      setTick((t) => t + 1);
      toast({ title: "Reward redeemed!", description: "Check your transaction history." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Redemption failed", description: err.message });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary">
            <Recycle className="h-7 w-7" />
            Credi-Can
          </a>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">Hi, {user.full_name.split(" ")[0]}</span>
            <Button variant="ghost" size="icon" onClick={handleLogout}><LogOut className="h-5 w-5" /></Button>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl py-8 space-y-8">
        {/* ── Summary cards ── */}
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard icon={<Coins className="h-6 w-6 text-accent" />} label="Total Credits" value={user.total_credits} />
          <SummaryCard icon={<Trophy className="h-6 w-6 text-primary" />} label="Approved Submissions" value={approved.length} />
          <SummaryCard icon={<Package className="h-6 w-6 text-bin-orange" />} label="Total Units" value={approved.reduce((a, s) => a + s.quantity_units, 0)} />
        </div>

        {/* ── Material breakdown ── */}
        <section>
          <h2 className="mb-4 font-display text-xl font-bold text-foreground">Materials Submitted</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {materialStats.map(({ material, totalUnits }) => (
              <div key={material.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-card">
                <div className={`h-10 w-10 rounded-full ${binColorMap[material.bin_color]}`} />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{material.name}</p>
                  <p className="text-lg font-bold text-foreground">{totalUnits} units</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Recent activity ── */}
        <section>
          <h2 className="mb-4 font-display text-xl font-bold text-foreground">Recent Submissions</h2>
          {last5.length === 0 ? (
            <p className="text-muted-foreground">No submissions yet. Bring recyclable materials to start earning credits!</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary text-secondary-foreground">
                  <tr>
                    <th className="px-4 py-2 text-left">Material</th>
                    <th className="px-4 py-2 text-left">Qty</th>
                    <th className="px-4 py-2 text-left">Credits</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {last5.map((s) => {
                    const mat = MATERIALS.find((m) => m.id === s.material_id);
                    return (
                      <tr key={s.id} className="border-t border-border">
                        <td className="px-4 py-2">{mat?.name ?? "Unknown"}</td>
                        <td className="px-4 py-2">{s.quantity_units}</td>
                        <td className="px-4 py-2">{s.credits_awarded}</td>
                        <td className="px-4 py-2">
                          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                            s.status === "APPROVED" ? "bg-primary/15 text-primary" :
                            s.status === "REJECTED" ? "bg-destructive/15 text-destructive" :
                            "bg-accent/15 text-accent-foreground"
                          }`}>{s.status}</span>
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ── Rewards ── */}
        <section>
          <h2 className="mb-4 font-display text-xl font-bold text-foreground">Available Rewards</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {REWARDS.filter((r) => r.is_active).map((r) => (
              <div key={r.id} className="flex flex-col justify-between rounded-lg border border-border bg-card p-5 shadow-card">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{r.category}</span>
                  <h3 className="mt-1 font-display text-lg font-bold text-foreground">{r.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Partner: {r.partner_name}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-bold text-primary">{r.credit_cost} credits</span>
                  <Button
                    size="sm"
                    disabled={user.total_credits < r.credit_cost}
                    onClick={() => handleRedeem(r.id)}
                  >
                    Redeem
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

function SummaryCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-5 shadow-card">
      {icon}
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}

export default Dashboard;
