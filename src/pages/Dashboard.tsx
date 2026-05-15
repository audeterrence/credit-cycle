import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import {
  Recycle, LogOut, Coins, Trophy, Package, Bell, User as UserIcon,
  Phone, Mail, Calendar, TrendingUp, AlertCircle, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const MATERIALS = [
  { id: "mat-plastic", name: "Plastic Bottles", bin_color: "Yellow" },
  { id: "mat-metal", name: "Metal Scraps", bin_color: "Red" },
  { id: "mat-cans", name: "Aluminum Cans", bin_color: "Orange" },
  { id: "mat-glass", name: "Glass Containers", bin_color: "Green" },
];

const REWARDS = [
  { id: "rw-1", name: "Bread Voucher", description: "Fresh bread from local bakery", credit_cost: 50, partner_name: "Local Bakery", category: "Bakery" },
  { id: "rw-2", name: "Family Bread Pack", description: "Large bread pack for the family", credit_cost: 120, partner_name: "Local Bakery", category: "Bakery" },
  { id: "rw-5", name: "500 FCFA Airtime", description: "Mobile credit top-up instantly", credit_cost: 100, partner_name: "Mobile Partner", category: "Mobile" },
  { id: "rw-6", name: "1000 FCFA Airtime", description: "Mobile credit top-up instantly", credit_cost: 200, partner_name: "Mobile Partner", category: "Mobile" },
];

function SummaryCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <Card className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
      <CardContent className="p-6 flex items-center gap-4">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-slate-800 mt-0.5">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Supabase dynamic live trackers
  const [liveSubmissions, setLiveSubmissions] = useState<any[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Retrieve data records directly from your live Supabase database tables
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user?.id) return;
      try {
        const { data, error } = await supabase
          .from("waste_submissions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setLiveSubmissions(data || []);
      } catch (err: any) {
        console.error("Dashboard database sync exception:", err.message);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchUserStats();
  }, [user]);

  if (!user) return null;

  // =========================================================================
  // DYNAMIC COMPATIBILITY AGGREGATIONS (READS LIVE SUPABASE DATA INTS)
  // =========================================================================
  const totalUnitsCalculated = liveSubmissions.reduce((acc, s) => acc + (s.quantity_units || 0), 0);
  const totalEarnedCalculated = liveSubmissions.reduce((acc, s) => acc + (s.credits_awarded || 0), 0);

  const handleRedeemReward = async (rewardName: string, cost: number) => {
    if (user.total_credits < cost) {
      toast({ variant: "destructive", title: "Insufficient Credits", description: "Collect more recyclables to claim this coupon." });
      return;
    }
    
    toast({
      title: "Reward Claimed!",
      description: `Successfully processed voucher for ${rewardName}. code generated.`
    });
  };

  const handleLogoutAction = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Layer Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-display text-xl font-bold text-slate-900">
            <div className="bg-primary p-1.5 rounded-xl text-white">
              <Recycle className="h-5 w-5" />
            </div>
            <span>Credi-Can Client Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-500">@{user.username}</span>
            <Button variant="ghost" size="icon" onClick={handleLogoutAction} className="text-slate-400 hover:text-rose-600 rounded-xl transition-colors">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl py-8 space-y-8 animate-in fade-in duration-300">
        {/* Profile Details Container Grid */}
        <Card className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/5">
              <UserIcon className="h-8 w-8" />
            </div>
            <div className="flex-1 space-y-1">
              <h1 className="font-display text-2xl font-bold text-slate-800">
                {user.first_name} {user.last_name}
              </h1>
              <p className="text-xs font-semibold text-slate-400">@{user.username}</p>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs font-medium text-slate-400">
                <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {user.email}</span>
                <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {user.phone_number || "+237"}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Active Account</span>
              </div>
            </div>
            <div className="flex flex-col items-center rounded-2xl border border-primary/20 bg-primary/5 px-6 py-4 shadow-sm min-w-[120px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Balance</span>
              <span className="text-3xl font-black text-primary mt-0.5">{user.total_credits || user.credits || 0}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">credits</span>
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Telemetry Metrics Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard icon={<Coins className="h-6 w-6 text-amber-500" />} label="Total Earned" value={isLoadingStats ? "..." : `${totalEarnedCalculated} pts`} />
          <SummaryCard icon={<Trophy className="h-6 w-6 text-indigo-500" />} label="Submissions Count" value={isLoadingStats ? "..." : `${liveSubmissions.length} operations`} />
          <SummaryCard icon={<Package className="h-6 w-6 text-emerald-500" />} label="Total Recycled Units" value={isLoadingStats ? "..." : `${totalUnitsCalculated} items`} />
        </div>

        {/* Tab Selection Lists Navigation layouts */}
        <Tabs defaultValue="activity" className="space-y-4">
          <TabsList className="bg-white border border-slate-200/60 p-1 rounded-xl shadow-sm gap-1">
            <TabsTrigger value="activity" className="rounded-lg text-xs font-semibold gap-1.5 px-4 py-2"><Bell className="h-4 w-4" /> Operations Activity</TabsTrigger>
            <TabsTrigger value="rewards" className="rounded-lg text-xs font-semibold gap-1.5 px-4 py-2"><Trophy className="h-4 w-4" /> Redeem Rewards</TabsTrigger>
          </TabsList>

          {/* Tab Content Block layout for submissions auditing logs timeline list */}
          <TabsContent value="activity" className="outline-none">
            <Card className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-slate-50 p-6 bg-slate-50/40">
                <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" /> Live Audit Log Mappings
                </CardTitle>
                <CardDescription className="text-xs">Real-time breakdown of weight volume processed at Credit Cycle centers</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {liveSubmissions.length === 0 ? (
                  <div className="py-12 border border-dashed border-slate-200 bg-slate-50/50 rounded-2xl flex flex-col items-center justify-center text-center gap-2">
                    <AlertCircle className="h-8 w-8 text-slate-300" />
                    <p className="text-xs font-semibold text-slate-400">No deposit records detected today. Visit a center kiosk to start earning!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {liveSubmissions.map((s) => {
                      const matName = MATERIALS.find(m => m.id === s.material_id)?.name || "Recyclable Stream";
                      return (
                        <div key={s.id} className="flex items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 bg-white transition-all shadow-sm shadow-slate-50">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/50">
                              <TrendingUp className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-800">Deposited {matName}</p>
                              <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                                Capacity: {s.quantity_units} items {s.weight_kg ? `(${s.weight_kg} kg)` : ""} • {new Date(s.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-extrabold text-emerald-600">+{s.credits_awarded} pts</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rewards marketplace tab */}
          <TabsContent value="rewards" className="outline-none">
            <div className="grid gap-4 sm:grid-cols-2">
              {REWARDS.map((r) => (
                <Card key={r.id} className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden flex flex-col justify-between">
                  <CardContent className="p-6 space-y-3">
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide bg-indigo-50 text-indigo-600 border border-indigo-100/40">{r.category}</span>
                    <h3 className="font-display text-base font-bold text-slate-800">{r.name}</h3>
                    <p className="text-xs font-medium text-slate-400 leading-relaxed">{r.description}</p>
                    <p className="text-[10px] font-semibold text-slate-400">Partner Vendor: {r.partner_name}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-4">
                      <span className="text-sm font-black text-primary">{r.credit_cost} credits</span>
                      <Button size="sm" onClick={() => handleRedeemReward(r.name, r.credit_cost)} className="rounded-xl px-4 font-bold text-xs h-8 bg-primary hover:bg-primary/95 text-white">Claim Voucher</Button>
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
}