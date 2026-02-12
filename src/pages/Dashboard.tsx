import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Recycle, LogOut, Coins, Trophy, Package, Bell, User as UserIcon,
  Phone, Mail, Calendar, TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getUserSubmissions, getUserTransactions, getUserMaterialStats,
  MATERIALS, REWARDS, redeemReward,
} from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

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
  const materialStats = getUserMaterialStats(user.id);
  const transactions = getUserTransactions(user.id);
  const recentTransactions = transactions.slice(-10).reverse();
  const totalUnits = submissions.reduce((a, s) => a + s.quantity_units, 0);

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
            <span className="text-sm font-medium text-muted-foreground">@{user.username}</span>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl py-8 space-y-8">
        {/* ── Profile Card ── */}
        <Card>
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserIcon className="h-8 w-8" />
            </div>
            <div className="flex-1 space-y-1">
              <h1 className="font-display text-2xl font-bold text-foreground">{user.full_name}</h1>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{user.email}</span>
                <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{user.phone_number}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Joined {new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex flex-col items-center rounded-lg border border-primary/20 bg-primary/5 px-6 py-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Balance</span>
              <span className="text-3xl font-bold text-primary">{user.total_credits}</span>
              <span className="text-xs text-muted-foreground">credits</span>
            </div>
          </CardContent>
        </Card>

        {/* ── Summary cards ── */}
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard icon={<Coins className="h-6 w-6 text-accent" />} label="Total Earned" value={transactions.filter(t => t.amount > 0).reduce((a, t) => a + t.amount, 0)} />
          <SummaryCard icon={<Trophy className="h-6 w-6 text-primary" />} label="Submissions" value={submissions.length} />
          <SummaryCard icon={<Package className="h-6 w-6 text-bin-orange" />} label="Total Units" value={totalUnits} />
        </div>

        {/* ── Tabbed sections ── */}
        <Tabs defaultValue="activity" className="space-y-4">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="activity" className="gap-1"><Bell className="h-4 w-4" /> Activity</TabsTrigger>
            <TabsTrigger value="materials" className="gap-1"><Package className="h-4 w-4" /> Materials</TabsTrigger>
            <TabsTrigger value="rewards" className="gap-1"><Trophy className="h-4 w-4" /> Rewards</TabsTrigger>
          </TabsList>

          {/* ── Activity / Notifications ── */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bell className="h-5 w-5 text-primary" /> Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentTransactions.length === 0 ? (
                  <p className="text-muted-foreground py-4 text-center">No activity yet. Visit a kiosk to start earning credits!</p>
                ) : (
                  <div className="space-y-3">
                    {recentTransactions.map((t) => (
                      <div key={t.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                          t.type === "EARNED" ? "bg-primary/10 text-primary" :
                          t.type === "BONUS" ? "bg-accent/10 text-accent" :
                          "bg-destructive/10 text-destructive"
                        }`}>
                          {t.type === "EARNED" ? <TrendingUp className="h-4 w-4" /> :
                           t.type === "BONUS" ? <Trophy className="h-4 w-4" /> :
                           <Coins className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{t.description}</p>
                          <p className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleDateString()} · {new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <span className={`text-sm font-bold ${t.amount > 0 ? "text-primary" : "text-destructive"}`}>
                          {t.amount > 0 ? "+" : ""}{t.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Materials ── */}
          <TabsContent value="materials">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Materials Submitted</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {materialStats.map(({ material, totalUnits }) => (
                    <div key={material.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
                      <div className={`h-10 w-10 rounded-full ${binColorMap[material.bin_color]}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground">{material.name}</p>
                        <p className="text-lg font-bold text-foreground">{totalUnits} units</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{material.bin_color} bin</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Rewards ── */}
          <TabsContent value="rewards">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {REWARDS.filter((r) => r.is_active).map((r) => (
                <Card key={r.id} className="flex flex-col justify-between">
                  <CardContent className="p-5 space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{r.category}</span>
                    <h3 className="font-display text-lg font-bold text-foreground">{r.name}</h3>
                    <p className="text-sm text-muted-foreground">{r.description}</p>
                    <p className="text-xs text-muted-foreground">Partner: {r.partner_name}</p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-bold text-primary">{r.credit_cost} credits</span>
                      <Button
                        size="sm"
                        disabled={user.total_credits < r.credit_cost}
                        onClick={() => handleRedeem(r.id)}
                      >
                        Redeem
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
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
