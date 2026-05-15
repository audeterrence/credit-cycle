import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import {
  Recycle, LogOut, Search, UserPlus, Package, CheckCircle, Users, Coins,
  BarChart3, User as UserIcon, Phone, Mail, Calendar, Sparkles, AlertCircle, 
  Trash2, ShieldCheck, MapPin, Key, Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Static reference matrix mapped directly to platform standards
const MATERIALS = [
  { id: "mat-plastic", name: "Plastic Bottles", bin_color: "Yellow", base_unit: 2, base_kg: 20 },
  { id: "mat-metal", name: "Metal Scraps", bin_color: "Red", base_unit: 5, base_kg: 40 },
  { id: "mat-cans", name: "Aluminum Cans", bin_color: "Orange", base_unit: 3, base_kg: 30 },
  { id: "mat-glass", name: "Glass Containers", bin_color: "Green", base_unit: 4, base_kg: 25 },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Dashboard transactional logs array
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  // Form Creation State Matrix - Explicitly matches relational table requirements
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newCity, setNewCity] = useState("Douala");
  const [newPhone, setNewPhone] = useState("+237 "); // Enforces regional code pre-fill
  const [newPin, setNewPin] = useState(""); 
  const [assignedRole, setAssignedRole] = useState<"user" | "kiosk_admin" | "super_admin">("user");
  const [isProvisioning, setIsProvisioning] = useState(false);

  // Waste logging elements state
  const [materialId, setMaterialId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [weight, setWeight] = useState("");
  const [isSubmittingWaste, setIsSubmittingWaste] = useState(false);

  // Global Promotional Yield Modifiers state
  const [activeCampaign, setActiveCampaign] = useState<{ material_id: string; multiplier: number; label: string } | null>(null);
  const [fwMaterialId, setFwMaterialId] = useState("");
  const [fwMultiplier, setFwMultiplier] = useState("1.5");

  if (!user) return null;

  // Retrieve active transaction records directly from live database instances
  const fetchGlobalSubmissions = async () => {
    const { data, error } = await supabase
      .from("waste_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setSubmissions(data);
  };

  useEffect(() => {
    fetchGlobalSubmissions();
  }, []);

  // Live Metric Telemetry calculations
  const todayStr = new Date().toDateString();
  const todaySubs = submissions.filter(s => new Date(s.created_at).toDateString() === todayStr);
  const todayCredits = todaySubs.reduce((acc, s) => acc + (s.credits_awarded || 0), 0);
  const todayUsersCount = new Set(todaySubs.map(s => s.user_id)).size;

  const materialBreakdown = MATERIALS.map(m => {
    const matched = submissions.filter(s => s.material_id === m.id);
    return {
      material: m,
      count: matched.length,
      units: matched.reduce((acc, s) => acc + (s.quantity_units || 0), 0),
      credits: matched.reduce((acc, s) => acc + (s.credits_awarded || 0), 0),
    };
  });

  const handleSearchUsers = async () => {
    if (!searchQuery.trim()) return;
    const query = searchQuery.toLowerCase().trim();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .or(`username.ilike.%${query}%,email.ilike.%${query}%`);

    if (!error && data) {
      setSearchResults(data);
      if (data.length === 0) {
        toast({ title: "Account Not Found", description: "Use the advanced identity form below to onboard this profile." });
      }
    }
  };

  const handleCommitUserCreation = async () => {
    if (!newFirstName || !newLastName || !newUsername || !newEmail || !newPin) {
      toast({ variant: "destructive", title: "Incomplete Attributes", description: "All registration fields must be populated." });
      return;
    }

    setIsProvisioning(true);
    try {
      const formattedPhone = newPhone.trim();
      const compiledFullName = `${newFirstName.trim()} ${newLastName.trim()}`;

      // Call database transaction query endpoint using RPC mapping formats
      const { data: newUserId, error } = await supabase.rpc("create_user_v2", {
        p_email: newEmail.trim().toLowerCase(),
        p_password: newPin,
        p_username: newUsername.trim().toLowerCase(),
        p_first_name: newFirstName.trim(),
        p_last_name: newLastName.trim(),
        p_phone_number: formattedPhone,
        p_city: newCity,
        p_role: assignedRole
      });

      if (error) throw error;

      toast({
        title: "Database Entry Saved",
        description: `Successfully generated ${compiledFullName} profile mapped as clearance group [${assignedRole}].`
      });

      // Safely flush forms and restore original local regional placeholder strings
      setNewFirstName(""); setNewLastName(""); setNewUsername("");
      setNewEmail(""); setNewPhone("+237 "); setNewPin("");
    } catch (err: any) {
      toast({ variant: "destructive", title: "Provisioning Aborted", description: err.message });
    } finally {
      setIsProvisioning(false);
    }
  };

  const handleLogIntakeDeposit = async () => {
    if (!selectedUser || !materialId || !quantity) return;
    setIsSubmittingWaste(true);

    try {
      const selectedMat = MATERIALS.find(m => m.id === materialId);
      if (!selectedMat) return;

      // Point scaling formula metrics configuration rules
      let baseYield = Number(quantity) * selectedMat.base_unit;
      if (weight && Number(weight) > 0) {
        const kgYield = Number(weight) * selectedMat.base_kg;
        baseYield = Math.max(baseYield, kgYield);
      }

      // Check if a global yield campaign is active for this target stream
      if (activeCampaign && activeCampaign.material_id === materialId) {
        baseYield = baseYield * activeCampaign.multiplier;
      }

      const finalCreditsCalculated = Math.round(baseYield);

      // 1. Log transaction into live audit tracking tables
      const { error: subError } = await supabase.from("waste_submissions").insert({
        user_id: selectedUser.id,
        material_id: materialId,
        quantity_units: Number(quantity),
        weight_kg: weight ? Number(weight) : null,
        credits_awarded: finalCreditsCalculated,
        status: "APPROVED"
      });

      if (subError) throw subError;

      // 2. Clear input entries and sync state logs smoothly
      setMaterialId(""); setQuantity(""); setWeight("");
      await fetchGlobalSubmissions();

      // Instantly increment point metrics visually on current focused account item state container
      setSelectedUser((prev: any) => prev ? { ...prev, total_credits: (prev.total_credits || 0) + finalCreditsCalculated } : null);

      toast({ title: "Transaction Dispatched", description: `${finalCreditsCalculated} points added to account wallet @${selectedUser.username}` });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Ledger Update Failed", description: err.message });
    } finally {
      setIsSubmittingWaste(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-display text-xl font-bold text-slate-900">
            <div className="bg-primary p-1.5 rounded-xl text-white"><Recycle className="h-5 w-5" /></div>
            <span>Credi-Can Central Workspace</span>
            <span className={`ml-2 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
              user.role === "super_admin" ? "bg-purple-100 text-purple-700 border border-purple-200" : "bg-orange-100 text-orange-700 border border-orange-200"
            }`}>
              {user.role === "super_admin" ? "Super Admin Account" : "Kiosk Handler Mode"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-700">{user.full_name}</span>
            <Button variant="ghost" size="icon" onClick={logout} className="hover:bg-slate-100 rounded-xl"><LogOut className="h-5 w-5 text-slate-500" /></Button>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl py-8 space-y-6">
        {/* Real-time Telemetry Analytics Units */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<CheckCircle className="h-5 w-5 text-emerald-600" />} label="Today's Material Influx" value={todaySubs.length} />
          <StatCard icon={<Coins className="h-5 w-5 text-amber-600" />} label="Today's Distributed Tokens" value={todayCredits} />
          <StatCard icon={<Users className="h-5 w-5 text-blue-600" />} label="Active Handled Recyclers" value={todayUsersCount} />
          <StatCard icon={<Package className="h-5 w-5 text-indigo-600" />} label="System Lifetime Submissions" value={submissions.length} />
        </div>

        {/* Global Promotional Surge Yield Banner */}
        {activeCampaign && (
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 shadow-sm backdrop-blur-sm animate-in fade-in">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚡</span>
              <div>
                <p className="text-sm font-bold text-amber-900">Dynamic Multiplier Yield Engine Running Globally</p>
                <p className="text-xs text-amber-700">{activeCampaign.label} items are scaling points directly at <span className="font-bold">×{activeCampaign.multiplier} values</span>.</p>
              </div>
            </div>
            {user.role === "super_admin" && (
              <Button variant="ghost" size="sm" onClick={() => setActiveCampaign(null)} className="text-amber-800 hover:text-red-600 hover:bg-amber-100/50 font-bold gap-1.5 rounded-lg">
                <Trash2 className="h-3.5 w-3.5" /> Terminate Campaign
              </Button>
            )}
          </div>
        )}

        <Tabs defaultValue="kiosk" className="space-y-4">
          <TabsList className="bg-slate-200/60 p-1 rounded-xl border border-slate-200/40">
            <TabsTrigger value="kiosk" className="gap-1.5 rounded-lg font-bold">Kiosk Terminal</TabsTrigger>
            <TabsTrigger value="reports" className="gap-1.5 rounded-lg font-bold">Performance Matrix</TabsTrigger>
            {user.role === "super_admin" && <TabsTrigger value="provisioning" className="gap-1.5 rounded-lg font-bold text-purple-700 data-[state=active]:text-purple-900">User & Personnel Control</TabsTrigger>}
            <TabsTrigger value="profile" className="gap-1.5 rounded-lg font-bold">Terminal Identity</TabsTrigger>
          </TabsList>

          {/* KIOSK TRANSACTION PANEL */}
          <TabsContent value="kiosk" className="space-y-6 animate-in fade-in duration-150">
            <div className="grid gap-6 md:grid-cols-12 items-start">
              <div className="md:col-span-7 space-y-6">
                <Card className="border-slate-200 shadow-sm bg-white rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2 text-slate-900 font-bold"><Search className="h-4 w-4 text-primary" /> Recycler Identity Verification</CardTitle>
                    <CardDescription>Search by registered username handle strings.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Search profile identifiers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearchUsers()}
                        className="bg-slate-50 border-slate-200 h-11 focus-visible:ring-primary/20 rounded-xl"
                      />
                      <Button onClick={handleSearchUsers} className="h-11 px-5 font-bold rounded-xl">Search Index</Button>
                    </div>

                    {searchResults.length > 0 && (
                      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white max-h-48 overflow-y-auto shadow-inner">
                        {searchResults.map((u) => (
                          <button key={u.id} onClick={() => { setSelectedUser(u); setSearchResults([]); setSearchQuery(""); }} className="flex w-full items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors">
                            <div>
                              <p className="font-bold text-slate-800">{u.first_name} {u.last_name} <span className="text-slate-400 font-normal">@{u.username}</span></p>
                              <p className="text-xs text-slate-500">{u.email} · Location: {u.city || "Douala"}</p>
                            </div>
                            <span className="text-xs font-black text-primary bg-primary/5 px-2.5 py-1 rounded-full">{u.total_credits || 0} cr</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {selectedUser && (
                      <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-4 animate-in fade-in">
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-wider text-primary/70">Selected Wallet Target</span>
                          <p className="text-base font-black text-slate-900">{selectedUser.first_name} {selectedUser.last_name} <span className="text-slate-500 font-normal text-sm">@{selectedUser.username}</span></p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setSelectedUser(null)} className="border-slate-200 bg-white font-bold rounded-lg shadow-sm">Reset</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {selectedUser && (
                  <Card className="border-slate-200 shadow-sm bg-white rounded-2xl animate-in slide-in-from-bottom-2 duration-200">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2 text-slate-900 font-bold"><Package className="h-4 w-4 text-primary" /> Input Material Intake Measurements</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <Label className="text-xs font-bold text-slate-500">Material Variant</Label>
                          <select className="w-full rounded-xl border border-slate-200 bg-white h-11 px-3 py-2 text-xs mt-1.5 font-semibold text-slate-800 focus:ring-2 focus:ring-primary/20" value={materialId} onChange={(e) => setMaterialId(e.target.value)}>
                            <option value="">Select Stream...</option>
                            {MATERIALS.map((m) => <option key={m.id} value={m.id}>{m.name} ({m.bin_color})</option>)}
                          </select>
                        </div>
                        <div><Label className="text-xs font-bold text-slate-500">Quantity (Units)</Label><Input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="e.g. 15" className="h-11 mt-1.5 rounded-xl bg-white" /></div>
                        <div><Label className="text-xs font-bold text-slate-500">Mass (kg, Optional)</Label><Input type="number" min="0" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 2.5" className="h-11 mt-1.5 rounded-xl bg-white" /></div>
                      </div>
                      <Button onClick={handleLogIntakeDeposit} disabled={!materialId || !quantity || isSubmittingWaste} className="w-full h-11 font-bold rounded-xl shadow-md">
                        {isSubmittingWaste ? "Processing Deposit Ledger..." : "Award Balance Credits Instantly"}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* LOCAL TERMINAL HISTORY LIST FEED */}
              <div className="md:col-span-5 space-y-6">
                <Card className="border-slate-200 shadow-sm bg-white rounded-2xl">
                  <CardHeader><CardTitle className="text-base flex items-center gap-2 text-slate-900 font-bold"><Activity className="h-4 w-4 text-primary" /> Operational Terminal Log Feed</CardTitle></CardHeader>
                  <CardContent>
                    {submissions.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl bg-slate-50/50">No operational histories recorded today.</div>
                    ) : (
                      <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                        {submissions.slice(0, 6).map((s) => {
                          const mat = MATERIALS.find(m => m.id === s.material_id);
                          return (
                            <div key={s.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                              <div>
                                <p className="text-xs font-bold text-slate-800">{mat?.name || "Assorted Batch"}</p>
                                <p className="text-[10px] text-slate-400 font-medium">{s.quantity_units} Items · {s.weight_kg ? `${s.weight_kg} kg` : "No Scale Metric"}</p>
                              </div>
                              <span className="text-xs font-black text-emerald-600">+{s.credits_awarded} cr</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* PERFORMANCE BREAKDOWN MATRIX */}
          <TabsContent value="reports" className="space-y-6 animate-in fade-in duration-150">
            <Card className="border-slate-200 bg-white rounded-2xl shadow-sm">
              <CardHeader><CardTitle className="text-base font-bold text-slate-900">Material Stream Performance Matrix</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-900 text-white font-bold">
                      <tr>
                        <th className="px-4 py-3 text-left">Material Stream</th>
                        <th className="px-4 py-3 text-left">Bin Assignment</th>
                        <th className="px-4 py-3 text-right">Total Operations</th>
                        <th className="px-4 py-3 text-right">Collected Units</th>
                        <th className="px-4 py-3 text-right">Distributed Tokens</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {materialBreakdown.map((row) => (
                        <tr key={row.material.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3.5 font-bold text-slate-800">{row.material.name}</td>
                          <td className="px-4 py-3.5 text-slate-500">
                            <span className="inline-flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: row.material.bin_color === 'Orange' ? '#f97316' : row.material.bin_color === 'Yellow' ? '#eab308' : row.material.bin_color === 'Red' ? '#ef4444' : '#22c55e' }} />
                              {row.material.bin_color}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right font-semibold text-slate-600">{row.count}</td>
                          <td className="px-4 py-3.5 text-right font-bold text-slate-900">{row.units} items</td>
                          <td className="px-4 py-3.5 text-right font-black text-primary">+{row.credits} cr</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ADVANCED DB ALIGNED IDENTITY PROVISIONING TAB */}
          {user.role === "super_admin" && (
            <TabsContent value="provisioning" className="space-y-6 animate-in slide-in-from-left-2 duration-150">
              <div className="grid gap-6 md:grid-cols-12 items-start">
                <div className="md:col-span-8 space-y-6">
                  <Card className="border-purple-200 bg-white rounded-2xl shadow-sm border-2">
                    <CardHeader className="bg-purple-50/40 border-b border-purple-100 rounded-t-2xl">
                      <CardTitle className="text-base flex items-center gap-2 text-purple-900 font-black"><ShieldCheck className="h-4 w-4 text-purple-600" /> Database-Aligned Identity Provisioning Desk</CardTitle>
                      <CardDescription className="text-purple-700/80">Onboard profiles structured strictly with your public schema variables.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-5 space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div><Label className="text-xs font-bold text-slate-600">First Name</Label><Input value={newFirstName} onChange={(e) => setNewFirstName(e.target.value)} placeholder="e.g. Terrence" className="bg-white mt-1.5 h-10 rounded-xl" /></div>
                        <div><Label className="text-xs font-bold text-slate-600">Last Name</Label><Input value={newLastName} onChange={(e) => setNewLastName(e.target.value)} placeholder="e.g. Mbassa" className="bg-white mt-1.5 h-10 rounded-xl" /></div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div><Label className="text-xs font-bold text-slate-600">Username handle</Label><Input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="e.g. mbassa_audeterrence" className="bg-white mt-1.5 h-10 rounded-xl" /></div>
                        <div><Label className="text-xs font-bold text-slate-600">Email Address String</Label><Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="recycler@domain.cm" className="bg-white mt-1.5 h-10 rounded-xl" /></div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div><Label className="text-xs font-bold text-slate-600 flex items-center gap-1"><Phone className="h-3 w-3" /> Mobile Connection</Label><Input type="tel" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} className="bg-white mt-1.5 h-10 rounded-xl font-bold tracking-wide" /></div>
                        <div>
                          <Label className="text-xs font-bold text-slate-600 flex items-center gap-1"><MapPin className="h-3 w-3" /> Localized City Area</Label>
                          <select className="w-full rounded-xl border border-slate-200 bg-white h-10 px-3 py-2 text-xs mt-1.5 font-bold text-slate-700" value={newCity} onChange={(e) => setNewCity(e.target.value)}>
                            <option value="Douala">Douala (HQ Kiosk Cluster)</option>
                            <option value="Yaoundé">Yaoundé Terminal</option>
                            <option value="Buea">Buea Smart Point</option>
                            <option value="Bafoussam">Bafoussam Outpost</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs font-bold text-purple-900 flex items-center gap-1"><Key className="h-3 w-3 text-purple-600" /> Account Access Password PIN</Label>
                        <Input type="password" value={newPin} onChange={(e) => setNewPin(e.target.value)} placeholder="Configure security password login PIN (6+ characters)" className="bg-white mt-1.5 h-10 rounded-xl border-purple-200 focus-visible:ring-purple-200" />
                      </div>
                      <div className="space-y-2 pt-1">
                        <Label className="text-xs font-bold text-slate-600 block">Clearance Access Group Privileges</Label>
                        <div className="flex gap-2">
                          {["user", "kiosk_admin", "super_admin"].map((roleOption) => (
                            <button key={roleOption} type="button" onClick={() => setAssignedRole(roleOption as any)} className={`flex-1 p-2.5 text-xs rounded-xl border text-center font-bold transition-all capitalize ${assignedRole === roleOption ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
                              {roleOption.replace("_", " ")}
                            </button>
                          ))}
                        </div>
                      </div>
                      <Button onClick={handleCommitUserCreation} disabled={isProvisioning} className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg">
                        {isProvisioning ? "Provisioning Engine Routing..." : "Commit and Secure Account Entry"}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="md:col-span-4 space-y-6">
                  <Card className="border-slate-200 bg-white rounded-2xl shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2 text-slate-900 font-bold"><Sparkles className="h-4 w-4 text-amber-500" /> Yield Multiplier Control</CardTitle>
                      <CardDescription>Trigger dynamic modifier bonuses across chosen streams.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-xs font-bold text-slate-600">Target Material Stream</Label>
                        <select className="w-full rounded-xl border border-slate-200 bg-white h-11 px-3 py-2 text-xs mt-1.5 font-semibold text-slate-700" value={fwMaterialId} onChange={(e) => setFwMaterialId(e.target.value)}>
                          <option value="">Select Stream...</option>
                          {MATERIALS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <Label className="text-xs font-bold text-slate-600">Scaling Ratio Modifier</Label>
                        <select className="w-full rounded-xl border border-slate-200 bg-white h-11 px-3 py-2 text-xs mt-1.5 font-bold text-slate-800" value={fwMultiplier} onChange={(e) => setFwMultiplier(e.target.value)}>
                          <option value="1.5">×1.5 Boost</option>
                          <option value="2.0">×2.0 Double Value</option>
                          <option value="3.0">×3.0 Surge Value</option>
                        </select>
                      </div>
                      <Button onClick={() => {
                        const targetMat = MATERIALS.find(m => m.id === fwMaterialId);
                        if (targetMat) {
                          setActiveCampaign({ material_id: fwMaterialId, multiplier: Number(fwMultiplier), label: targetMat.name });
                          setFwMaterialId("");
                          toast({ title: "Surge Multiplier Engaged", description: `Bonus factors active for ${targetMat.name}.` });
                        }
                      }} disabled={!fwMaterialId} className="w-full h-11 font-bold bg-slate-900 text-white hover:bg-slate-800 rounded-xl">Trigger Multiplier Factor</Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          )}

          {/* PERSONAL VIEW DETAILS */}
          <TabsContent value="profile" className="space-y-6 animate-in fade-in duration-150">
            <Card className="border-slate-200 bg-white rounded-2xl shadow-sm">
              <CardHeader><CardTitle className="text-base flex items-center gap-2 text-slate-900 font-bold"><UserIcon className="h-4 w-4 text-primary" /> Operator Context Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm font-black">{user.full_name?.charAt(0) || "A"}</div>
                  <div>
                    <p className="text-base font-black text-slate-900">{user.full_name}</p>
                    <p className="text-xs font-semibold text-slate-400">Username ID handle: @{user.username}</p>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 pt-2">
                  <ProfileInfoCard icon={<Mail className="h-4 w-4 text-slate-400" />} label="Email Address Contact" value={user.email} />
                  <ProfileInfoCard icon={<Phone className="h-4 w-4 text-slate-400" />} label="Mobile Phone Target" value={user.phone_number || "No Contact Assigned"} />
                  <ProfileInfoCard icon={<Calendar className="h-4 w-4 text-slate-400" />} label="Instance Registered" value={new Date(user.created_at).toLocaleDateString()} />
                  <ProfileInfoCard icon={<AlertCircle className="h-4 w-4 text-purple-600" />} label="Security clearance group" value={user.role?.toUpperCase() || "USER"} isBadge />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl shadow-sm">{icon}</div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-xl font-black text-slate-900 tracking-tight mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function ProfileInfoCard({ icon, label, value, isBadge }: { icon: React.ReactNode; label: string; value: string; isBadge?: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 shadow-inner">
      {icon}
      <div>
        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">{label}</p>
        <p className={`text-xs font-bold mt-0.5 ${isBadge ? "text-purple-700 bg-purple-50 border border-purple-100 px-2.5 py-0.5 rounded-md text-[10px]" : "text-slate-800"}`}>{value}</p>
      </div>
    </div>
  );
}