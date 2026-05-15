import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Recycle, LogOut, Search, UserPlus, Package, CheckCircle, Users, Coins,
  BarChart3, User as UserIcon, Phone, Mail, Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  searchUsers, registerUser, submitAndApproveWaste,
  getFocusWeek, MATERIALS, getUsers, getUserSubmissions,
  getAllSubmissions, type User,
} from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tick, setTick] = useState(0);

  // User Lookup state hooks
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Registration states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");

  // Input Collection states
  const [materialId, setMaterialId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [weight, setWeight] = useState("");

  // REDIRECT HOOK PURGED: Gateway route interceptors manage authorization access safely
  if (!user) return null;

  const currentFocusWeek = getFocusWeek();

  // Metrics extraction logic
  const allSubs = getAllSubmissions() || [];
  const todaySubs = allSubs.filter(s => new Date(s.created_at).toDateString() === new Date().toDateString());
  const todayCredits = todaySubs.reduce((a, s) => a + s.credits_awarded, 0);
  const todayUsers = new Set(todaySubs.map(s => s.user_id)).size;
  const totalSubs = allSubs.length;
  const totalCredits = allSubs.reduce((a, s) => a + s.credits_awarded, 0);

  const materialBreakdown = MATERIALS.map(m => {
    const subs = allSubs.filter(s => s.material_id === m.id);
    return {
      material: m,
      count: subs.length,
      units: subs.reduce((a, s) => a + s.quantity_units, 0),
      credits: subs.reduce((a, s) => a + s.credits_awarded, 0),
    };
  });

  const handleSearch = () => {
    const results = searchUsers(searchQuery);
    setSearchResults(results);
    if (results.length === 0 && searchQuery.trim()) {
      toast({ title: "No user found", description: "You can create a new account below." });
      setShowCreateForm(true);
    } else {
      setShowCreateForm(false);
    }
  };

  const handleSelectUser = (u: User) => {
    const freshUsers = getUsers();
    const fresh = freshUsers.find((x) => x.id === u.id) ?? u;
    setSelectedUser(fresh);
    setSearchResults([]);
    setSearchQuery("");
    setShowCreateForm(false);
  };

  const handleCreateUser = () => {
    try {
      const newUser = registerUser({
        username: newUsername, full_name: newFullName, email: newEmail,
        password: "changeme123", phone_number: newPhone,
      });
      setSelectedUser(newUser);
      setShowCreateForm(false);
      setNewUsername(""); setNewFullName(""); setNewEmail(""); setNewPhone("");
      toast({ title: "Account created!", description: `${newUser.full_name} (@${newUser.username}) — Default password: changeme123` });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  const handleSubmitWaste = () => {
    if (!selectedUser || !materialId || !quantity) return;
    try {
      const sub = submitAndApproveWaste(selectedUser.id, materialId, Number(quantity), weight ? Number(weight) : null);
      const freshUsers = getUsers();
      const fresh = freshUsers.find((x) => x.id === selectedUser.id);
      if (fresh) setSelectedUser(fresh);
      setMaterialId(""); setQuantity(""); setWeight("");
      setTick((t) => t + 1);
      toast({ title: "Credits awarded!", description: `${sub.credits_awarded} credits added to @${selectedUser.username}` });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const userHistory = selectedUser ? getUserSubmissions(selectedUser.id).slice(-5).reverse() : [];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary">
            <Recycle className="h-7 w-7" />
            Credi-Can
            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              {user.role === "super_admin" ? "Super Admin" : "Kiosk Admin"}
            </span>
          </a>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">{user.full_name}</span>
            <Button variant="ghost" size="icon" onClick={handleLogout}><LogOut className="h-5 w-5" /></Button>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl py-8 space-y-6">
        {/* Quick metrics bar */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<CheckCircle className="h-5 w-5 text-primary" />} label="Today's Submissions" value={todaySubs.length} />
          <StatCard icon={<Coins className="h-5 w-5 text-accent" />} label="Today's Credits" value={todayCredits} />
          <StatCard icon={<Users className="h-5 w-5 text-primary" />} label="Users Served Today" value={todayUsers} />
          <StatCard icon={<Package className="h-5 w-5 text-primary" />} label="All-Time Submissions" value={totalSubs} />
        </div>

        {/* Focus Week Event Active handler */}
        {currentFocusWeek && (
          <div className="flex items-center gap-3 rounded-lg border border-accent/30 bg-accent/10 p-3">
            <span className="text-lg">⚡</span>
            <div>
              <p className="text-sm font-semibold text-foreground">Focus Week Active: {currentFocusWeek.label} — ×{currentFocusWeek.multiplier} credits</p>
              <p className="text-xs text-muted-foreground">Since {new Date(currentFocusWeek.started_at).toLocaleDateString()}</p>
            </div>
          </div>
        )}

        <Tabs defaultValue="kiosk" className="space-y-4">
          <TabsList>
            <TabsTrigger value="kiosk" className="gap-1"><CheckCircle className="h-4 w-4" /> Kiosk</TabsTrigger>
            <TabsTrigger value="reports" className="gap-1"><BarChart3 className="h-4 w-4" /> Reports</TabsTrigger>
            <TabsTrigger value="profile" className="gap-1"><UserIcon className="h-4 w-4" /> Profile</TabsTrigger>
          </TabsList>

          {/* Kiosk Operations Panel */}
          <TabsContent value="kiosk" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" /> Step 1 — Find User
                </CardTitle>
                <CardDescription>Search by username or email. If no account exists, create one.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Username or email…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button onClick={handleSearch}><Search className="mr-1 h-4 w-4" /> Search</Button>
                </div>

                {searchResults.length > 0 && (
                  <div className="space-y-2">
                    {searchResults.map((u) => (
                      <button key={u.id} onClick={() => handleSelectUser(u)}
                        className="flex w-full items-center gap-3 rounded-lg border border-border bg-card p-3 text-left transition hover:bg-secondary">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">{u.full_name} <span className="text-muted-foreground">@{u.username}</span></p>
                          <p className="text-xs text-muted-foreground">{u.email} · {u.total_credits} credits</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {showCreateForm && (
                  <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4 space-y-3">
                    <p className="flex items-center gap-2 text-sm font-semibold text-foreground"><UserPlus className="h-4 w-4 text-primary" /> Create New Account</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div><Label>Username</Label><Input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="johndoe" /></div>
                      <div><Label>Full Name</Label><Input value={newFullName} onChange={(e) => setNewFullName(e.target.value)} placeholder="John Doe" /></div>
                      <div><Label>Email</Label><Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="user@example.com" /></div>
                      <div><Label>Phone</Label><Input type="tel" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="+237 6XX XXX XXX" /></div>
                    </div>
                    <Button onClick={handleCreateUser} disabled={!newUsername || !newFullName || !newEmail}>
                      <UserPlus className="mr-1 h-4 w-4" /> Create Account
                    </Button>
                  </div>
                )}

                {selectedUser && (
                  <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 p-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Selected User</p>
                      <p className="text-lg font-bold text-foreground">{selectedUser.full_name} <span className="text-muted-foreground font-normal">@{selectedUser.username}</span></p>
                      <p className="text-sm text-primary font-semibold">{selectedUser.total_credits} credits</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setSelectedUser(null)}>Change</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Waste Entry Module */}
            {selectedUser && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" /> Step 2 — Log Waste & Award Credits
                  </CardTitle>
                  <CardDescription>
                    Enter materials brought by {selectedUser.full_name}. Credits are awarded instantly.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <Label>Material</Label>
                      <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground" value={materialId} onChange={(e) => setMaterialId(e.target.value)}>
                        <option value="">Select…</option>
                        {MATERIALS.map((m) => (
                          <option key={m.id} value={m.id}>{m.name} ({m.bin_color}){currentFocusWeek?.material_id === m.id ? " ⚡" : ""}</option>
                        ))}
                      </select>
                    </div>
                    <div><Label>Quantity (units)</Label><Input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="e.g. 10" /></div>
                    <div><Label>Weight (kg, optional)</Label><Input type="number" min="0" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 1.5" /></div>
                  </div>
                  <Button onClick={handleSubmitWaste} disabled={!materialId || !quantity} className="w-full sm:w-auto">
                    <CheckCircle className="mr-1 h-4 w-4" /> Submit & Award Credits
                  </Button>

                  {userHistory.length > 0 && (
                    <div className="mt-4">
                      <p className="mb-2 text-sm font-semibold text-muted-foreground">Recent for @{selectedUser.username}</p>
                      <div className="overflow-x-auto rounded-lg border border-border">
                        <table className="w-full text-sm">
                          <thead className="bg-secondary text-secondary-foreground">
                            <tr>
                              <th className="px-3 py-2 text-left">Material</th>
                              <th className="px-3 py-2 text-left">Qty</th>
                              <th className="px-3 py-2 text-left">Credits</th>
                              <th className="px-3 py-2 text-left">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userHistory.map((s) => {
                              const mat = MATERIALS.find((m) => m.id === s.material_id);
                              return (
                                <tr key={s.id} className="border-t border-border">
                                  <td className="px-3 py-2">{mat?.name ?? "Unknown"}</td>
                                  <td className="px-3 py-2">{s.quantity_units}</td>
                                  <td className="px-3 py-2 font-semibold text-primary">+{s.credits_awarded}</td>
                                  <td className="px-3 py-2 text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Reports Analytics Module */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" /> Kiosk Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border border-border bg-secondary/50 p-4 text-center">
                    <p className="text-2xl font-bold text-foreground">{totalSubs}</p>
                    <p className="text-xs text-muted-foreground">Total Collections</p>
                  </div>
                  <div className="rounded-lg border border-border bg-secondary/50 p-4 text-center">
                    <p className="text-2xl font-bold text-primary">{totalCredits}</p>
                    <p className="text-xs text-muted-foreground">Total Credits Awarded</p>
                  </div>
                  <div className="rounded-lg border border-border bg-secondary/50 p-4 text-center">
                    <p className="text-2xl font-bold text-foreground">{new Set(allSubs.map(s => s.user_id)).size}</p>
                    <p className="text-xs text-muted-foreground">Unique Users Served</p>
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-sm font-semibold text-foreground">Material Breakdown</p>
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-sm">
                      <thead className="bg-secondary text-secondary-foreground">
                        <tr>
                          <th className="px-4 py-2 text-left">Material</th>
                          <th className="px-4 py-2 text-left">Bin</th>
                          <th className="px-4 py-2 text-right">Collections</th>
                          <th className="px-4 py-2 text-right">Units</th>
                          <th className="px-4 py-2 text-right">Credits</th>
                        </tr>
                      </thead>
                      <tbody>
                        {materialBreakdown.map((row) => (
                          <tr key={row.material.id} className="border-t border-border">
                            <td className="px-4 py-2 font-medium text-foreground">{row.material.name}</td>
                            <td className="px-4 py-2 text-muted-foreground">{row.material.bin_color}</td>
                            <td className="px-4 py-2 text-right">{row.count}</td>
                            <td className="px-4 py-2 text-right">{row.units}</td>
                            <td className="px-4 py-2 text-right font-semibold text-primary">{row.credits}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Metadata panel view */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><UserIcon className="h-5 w-5 text-primary" /> My Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <UserIcon className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-foreground">{user.full_name}</p>
                      <p className="text-sm text-muted-foreground">@{user.username} · Account Manager</p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email Address</p>
                        <p className="text-sm font-medium text-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone Connection</p>
                        <p className="text-sm font-medium text-foreground">{user.phone_number}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Account Created</p>
                        <p className="text-sm font-medium text-foreground">{new Date(user.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Security Clearance</p>
                        <p className="text-sm font-medium text-foreground uppercase tracking-wider text-primary">
                          {user.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-card">
      {icon}
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}

export default AdminDashboard;