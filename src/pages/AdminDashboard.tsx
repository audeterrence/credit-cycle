import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Recycle, LogOut, ShieldCheck, CheckCircle, XCircle, Users, Clock, Zap, Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  getAllSubmissions, getAdminStats, approveSubmission, rejectSubmission,
  getFocusWeek, setFocusWeek, clearFocusWeek, MATERIALS, getUsers,
  type FocusWeek,
} from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tick, setTick] = useState(0);
  const [focusMaterial, setFocusMaterial] = useState("");
  const [focusMultiplier, setFocusMultiplier] = useState("2");
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("PENDING");

  useEffect(() => {
    if (!user || user.role !== "ADMIN") navigate("/login", { replace: true });
  }, [user, navigate]);

  if (!user || user.role !== "ADMIN") return null;

  const stats = getAdminStats();
  const submissions = getAllSubmissions();
  const users = getUsers();
  const currentFocusWeek = getFocusWeek();

  const filtered = filter === "ALL" ? submissions : submissions.filter((s) => s.status === filter);

  const handleApprove = (id: string) => {
    try {
      approveSubmission(id);
      setTick((t) => t + 1);
      toast({ title: "Submission approved", description: "Credits awarded to user." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  const handleReject = (id: string) => {
    try {
      rejectSubmission(id);
      setTick((t) => t + 1);
      toast({ title: "Submission rejected" });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  const handleSetFocusWeek = () => {
    if (!focusMaterial) return;
    try {
      setFocusWeek(focusMaterial, Number(focusMultiplier) || 2);
      setTick((t) => t + 1);
      toast({ title: "Focus Week activated!", description: `${MATERIALS.find(m => m.id === focusMaterial)?.name} now earns ×${focusMultiplier} credits.` });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  const handleClearFocusWeek = () => {
    clearFocusWeek();
    setTick((t) => t + 1);
    toast({ title: "Focus Week cleared" });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getUserName = (userId: string) => {
    const u = users.find((x) => x.id === userId);
    return u?.full_name ?? "Unknown";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary">
            <Recycle className="h-7 w-7" />
            Credi-Can
            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              Admin
            </span>
          </a>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">{user.full_name}</span>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl py-8 space-y-8">
        {/* ── Stats ── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<Users className="h-5 w-5 text-primary" />} label="Total Users" value={stats.totalUsers} />
          <StatCard icon={<Clock className="h-5 w-5 text-accent" />} label="Pending" value={stats.pendingCount} />
          <StatCard icon={<CheckCircle className="h-5 w-5 text-primary" />} label="Approved" value={stats.approvedCount} />
          <StatCard icon={<XCircle className="h-5 w-5 text-destructive" />} label="Rejected" value={stats.rejectedCount} />
        </div>

        {/* ── Focus Week Management ── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent" />
              Material Focus Week
            </CardTitle>
            <CardDescription>
              Set a bonus multiplier for a specific material. All new approvals for that material earn boosted credits.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentFocusWeek ? (
              <div className="flex flex-wrap items-center gap-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Active Focus Week</p>
                  <p className="text-lg font-bold text-foreground">
                    {currentFocusWeek.label} — <span className="text-primary">×{currentFocusWeek.multiplier}</span> credits
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Since {new Date(currentFocusWeek.started_at).toLocaleDateString()}
                  </p>
                </div>
                <Button variant="destructive" size="sm" onClick={handleClearFocusWeek}>
                  <Trash2 className="mr-1 h-4 w-4" /> End Focus Week
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex-1 min-w-[180px]">
                  <label className="mb-1 block text-sm font-medium text-foreground">Material</label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                    value={focusMaterial}
                    onChange={(e) => setFocusMaterial(e.target.value)}
                  >
                    <option value="">Select material…</option>
                    {MATERIALS.map((m) => (
                      <option key={m.id} value={m.id}>{m.name} ({m.bin_color})</option>
                    ))}
                  </select>
                </div>
                <div className="w-28">
                  <label className="mb-1 block text-sm font-medium text-foreground">Multiplier</label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                    value={focusMultiplier}
                    onChange={(e) => setFocusMultiplier(e.target.value)}
                  >
                    <option value="1.5">×1.5</option>
                    <option value="2">×2</option>
                    <option value="3">×3</option>
                  </select>
                </div>
                <Button onClick={handleSetFocusWeek} disabled={!focusMaterial}>
                  <Zap className="mr-1 h-4 w-4" /> Activate
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Submission Queue ── */}
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Submissions
            </h2>
            <div className="flex gap-1">
              {(["PENDING", "APPROVED", "REJECTED", "ALL"] as const).map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(f)}
                >
                  {f === "PENDING" ? `Pending (${stats.pendingCount})` : f.charAt(0) + f.slice(1).toLowerCase()}
                </Button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">No {filter.toLowerCase()} submissions.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary text-secondary-foreground">
                  <tr>
                    <th className="px-4 py-2 text-left">User</th>
                    <th className="px-4 py-2 text-left">Material</th>
                    <th className="px-4 py-2 text-left">Qty</th>
                    <th className="px-4 py-2 text-left">Weight</th>
                    <th className="px-4 py-2 text-left">Credits</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => {
                    const mat = MATERIALS.find((m) => m.id === s.material_id);
                    const isFocused = currentFocusWeek?.material_id === s.material_id;
                    return (
                      <tr key={s.id} className="border-t border-border">
                        <td className="px-4 py-2 font-medium">{getUserName(s.user_id)}</td>
                        <td className="px-4 py-2">
                          {mat?.name ?? "Unknown"}
                          {isFocused && s.status === "PENDING" && (
                            <span className="ml-1 text-xs text-accent font-semibold">⚡ Focus</span>
                          )}
                        </td>
                        <td className="px-4 py-2">{s.quantity_units}</td>
                        <td className="px-4 py-2">{s.weight_kg != null ? `${s.weight_kg} kg` : "—"}</td>
                        <td className="px-4 py-2">
                          {s.credits_awarded}
                          {isFocused && s.status === "PENDING" && (
                            <span className="ml-1 text-xs text-accent">→ {s.credits_awarded * (currentFocusWeek?.multiplier ?? 1)}</span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                            s.status === "APPROVED" ? "bg-primary/15 text-primary" :
                            s.status === "REJECTED" ? "bg-destructive/15 text-destructive" :
                            "bg-accent/15 text-accent-foreground"
                          }`}>{s.status}</span>
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-2">
                          {s.status === "PENDING" ? (
                            <div className="flex gap-1">
                              <Button size="sm" variant="default" onClick={() => handleApprove(s.id)}>
                                <CheckCircle className="mr-1 h-3.5 w-3.5" /> Approve
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleReject(s.id)}>
                                <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
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

export default AdminDashboard;
