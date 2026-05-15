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

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

const StatCard = ({ icon, label, value }: StatCardProps) => (
  <Card className="bg-white border border-slate-100 shadow-sm shadow-slate-100/50 rounded-2xl overflow-hidden">
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

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Dashboard state variables
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Intake Deposit Transaction Form States
  const [materialId, setMaterialId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [weight, setWeight] = useState("");
  const [isSubmittingWaste, setIsSubmittingWaste] = useState(false);

  // Administrative User Provisioning Form States
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("+237 ");
  const [newCity, setNewCity] = useState("Douala");
  const [newPin, setNewPin] = useState("");
  const [assignedRole, setAssignedRole] = useState("user");
  const [isProvisioning, setIsProvisioning] = useState(false);

  // Promotional Campaign Configurations (Mock state for point multiplier evaluation)
  const [activeCampaign] = useState<any>({ material_id: "mat-plastic", multiplier: 1.5, name: "May Rouge Influx Burst" });

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

  // =========================================================================
  // LIVE METRIC TELEMETRY CALCULATIONS (ISOLATED STRICTLY TO THIS OPERATOR)
  // =========================================================================
  const todayStr = new Date().toDateString();
  
  // Filters submissions processed strictly by THIS manager/operator session today
  const todaySubs = submissions.filter(
    s => new Date(s.created_at).toDateString() === todayStr && s.operator_id === user?.id
  );
  const todayCredits = todaySubs.reduce((acc, s) => acc + (s.credits_awarded || 0), 0);
  const todayUsersCount = new Set(todaySubs.map(s => s.user_id)).size;

  const materialBreakdown = MATERIALS.map(m => {
    // Isolate stream performance tracking specifically to this current manager too
    const matched = submissions.filter(s => s.material_id === m.id && s.operator_id === user?.id);
    return {
      material: m,
      count: matched.length,
      units: matched.reduce((acc, s) => acc + (s.quantity_units || 0), 0),
      credits: matched.reduce((acc, s) => acc + (s.credits_awarded || 0), 0),
    };
  });

  // Handle active account lookups
  const handleUserSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    setSelectedUser(null);

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .or(`username.ilike.%${searchTerm.trim()}%,email.ilike.%${searchTerm.trim()}%`);

      if (error) throw error;
      setSearchResults(data || []);
      if (!data || data.length === 0) {
        toast({ variant: "destructive", title: "No Accounts Found", description: "Verify account username spelling." });
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Search Aborted", description: err.message });
    } finally {
      setIsSearching(false);
    }
  };

  // =========================================================================
  // CORE METRIC INTAKE TRANSACTION HANDLER (WITH IMMEDIATE DB COALESCE UPDATE)
  // =========================================================================
  const handleLogIntakeDeposit = async () => {
    if (!selectedUser || !materialId || !quantity) return;
    setIsSubmittingWaste(true);

    try {
      const selectedMat = MATERIALS.find(m => m.id === materialId);
      if (!selectedMat) return;

      let baseYield = Number(quantity) * selectedMat.base_unit;
      if (weight && Number(weight) > 0) {
        const kgYield = Number(weight) * selectedMat.base_kg;
        baseYield = Math.max(baseYield, kgYield);
      }

      if (activeCampaign && activeCampaign.material_id === materialId) {
        baseYield = baseYield * activeCampaign.multiplier;
      }

      const finalCreditsCalculated = Math.round(baseYield);
      const inputWeight = weight ? Number(weight) : 0;

      // 1. Log transaction into live audit tracking table with manager reference tracking
      const { error: subError } = await supabase.from("waste_submissions").insert({
        user_id: selectedUser.id,
        operator_id: user?.id, // Stamps log with active manager ID
        material_id: materialId,
        quantity_units: Number(quantity),
        weight_kg: weight ? Number(weight) : null,
        credits_awarded: finalCreditsCalculated,
        status: "APPROVED"
      });

      if (subError) throw subError;

      // 2. IMMEDIATE WALLET BALANCE DATABASE COALESCE INJECTION
      const newTotalCredits = (selectedUser.total_credits || 0) + finalCreditsCalculated;
      const newCredits = (selectedUser.credits || 0) + finalCreditsCalculated;
      const newRecycledVolume = Number(selectedUser.total_recycled_kg || 0) + inputWeight;

      const { error: profileUpdateError } = await supabase
        .from("profiles")
        .update({
          total_credits: newTotalCredits,
          credits: newCredits, // Updates dual architectural fallback variants safely
          total_recycled_kg: newRecycledVolume
        })
        .eq("id", selectedUser.id);

      if (profileUpdateError) throw profileUpdateError;

      // 3. Clear forms and fetch fresh unified telemetry states
      setMaterialId(""); setQuantity(""); setWeight("");
      await fetchGlobalSubmissions();

      // Reflect structural changes cleanly inside active state focus context
      setSelectedUser((prev: any) => 
        prev ? { 
          ...prev, 
          total_credits: newTotalCredits, 
          credits: newCredits,
          total_recycled_kg: newRecycledVolume
        } : null
      );

      toast({ 
        title: "Transaction Dispatched", 
        description: `${finalCreditsCalculated} points safely committed to user balance @${selectedUser.username}` 
      });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Ledger Update Failed", description: err.message });
    } finally {
      setIsSubmittingWaste(false);
    }
  };

  // Administrative User Provisioning Form Actions
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirstName || !newLastName || !newUsername || !newEmail || !newPin) {
      toast({ variant: "destructive", title: "Incomplete Attributes", description: "All fields are mandatory." });
      return;
    }

    setIsProvisioning(true);
    try {
      const formattedPhone = newPhone.trim();
      const compiledFullName = `${newFirstName.trim()} ${newLastName.trim()}`;

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
        description: `Successfully provisioned account for ${compiledFullName} [${assignedRole}].`
      });

      setNewFirstName(""); setNewLastName(""); setNewUsername("");
      setNewEmail(""); setNewPhone("+237 "); setNewPin("");
    } catch (err: any) {
      toast({ variant: "destructive", title: "Provisioning Aborted", description: err.message });
    } finally {
      setIsProvisioning(false);
    }
  };

  const handleLogoutAction = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-display text-xl font-bold text-slate-900">
            <div className="bg-primary p-1.5 rounded-xl text-white"><Recycle className="h-5 w-5" /></div>
            <span>Credi-Can Central Workspace</span>
            <span className="ml-2 rounded-full px-2 py-0.5 text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100 capitalize">
              {user?.role || "Operator Portal"}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogoutAction} className="text-slate-500 hover:text-rose-600 transition-colors gap-2 rounded-xl">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline font-medium text-xs">Terminate Session</span>
          </Button>
        </div>
      </header>

      <main className="container py-8 space-y-8 animate-in fade-in duration-300">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Operational Dashboard</h1>
          <p className="text-sm text-slate-500">Welcome back, <span className="font-semibold text-slate-700">{user?.first_name || "Administrator"}</span>. Tracking processed logs below.</p>
        </div>

        {/* Real-time Telemetry Analytics Units */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<CheckCircle className="h-5 w-5 text-emerald-600" />} label="Your Material Influx" value={todaySubs.length} />
          <StatCard icon={<Coins className="h-5 w-5 text-amber-600" />} label="Your Distributed Tokens" value={todayCredits} />
          <StatCard icon={<Users className="h-5 w-5 text-blue-600" />} label="Active Handled Recyclers" value={todayUsersCount} />
          <StatCard icon={<Package className="h-5 w-5 text-indigo-600" />} label="System Total History Logs" value={submissions.length} />
        </div>

        <Tabs defaultValue="intake" className="space-y-6">
          <TabsList className="bg-white border border-slate-200/60 p-1 rounded-xl shadow-sm gap-1 w-full sm:w-auto overflow-x-auto justify-start">
            <TabsTrigger value="intake" className="rounded-lg text-xs font-semibold gap-2 px-4 py-2"><Recycle className="h-3.5 w-3.5" /> Log Waste Deposit</TabsTrigger>
            <TabsTrigger value="provisioning" className="rounded-lg text-xs font-semibold gap-2 px-4 py-2"><UserPlus className="h-3.5 w-3.5" /> Onboard Profiles</TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-lg text-xs font-semibold gap-2 px-4 py-2"><BarChart3 className="h-3.5 w-3.5" /> Stream Ledger Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="intake" className="grid gap-6 md:grid-cols-12 items-start outline-none">
            {/* Account Finder Sub-Panel */}
            <Card className="md:col-span-5 bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-slate-50 p-6 bg-slate-50/40">
                <CardTitle className="text-base font-bold text-slate-800">Identify Recycler Identity</CardTitle>
                <CardDescription className="text-xs">Query systemic records via account username attributes</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <form onSubmit={handleUserSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input placeholder="Enter unique user handle..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 rounded-xl bg-slate-50/50 border-slate-200 focus-visible:ring-primary h-10 text-xs font-medium" />
                  </div>
                  <Button type="submit" disabled={isSearching} className="rounded-xl px-4 font-semibold text-xs h-10 bg-primary hover:bg-primary/95 text-white shadow-sm shadow-primary/10">
                    {isSearching ? <Activity className="h-4 w-4 animate-spin" /> : "Query"}
                  </Button>
                </form>

                {searchResults.length > 0 && !selectedUser && (
                  <div className="border border-slate-100 rounded-xl divide-y divide-slate-50 overflow-hidden bg-slate-50/30">
                    {searchResults.map((u) => (
                      <div key={u.id} onClick={() => setSelectedUser(u)} className="p-4 flex items-center justify-between cursor-pointer hover:bg-white transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs capitalize">{u.username.slice(0,2)}</div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">@{u.username}</p>
                            <p className="text-[10px] font-medium text-slate-400 mt-0.5">{u.first_name} {u.last_name}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" className="text-[10px] font-bold text-primary group-hover:bg-primary/5 rounded-lg px-2.5 h-7">Select</Button>
                      </div>
                    ))}
                  </div>
                )}

                {selectedUser && (
                  <div className="p-4 border border-emerald-100 bg-emerald-50/20 rounded-2xl relative space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold text-sm capitalize">{selectedUser.username.slice(0,2)}</div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-xs font-bold text-slate-800">@{selectedUser.username}</h3>
                          <span className="rounded-full bg-emerald-100/60 text-emerald-700 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide border border-emerald-200/40">Focused</span>
                        </div>
                        <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{selectedUser.first_name} {selectedUser.last_name}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3.5 text-center">
                      <div className="bg-white/80 border border-slate-100/80 p-2.5 rounded-xl">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Wallet Balance</p>
                        <p className="text-lg font-bold text-slate-800 mt-0.5">{selectedUser.total_credits || selectedUser.credits || 0} pts</p>
                      </div>
                      <div className="bg-white/80 border border-slate-100/80 p-2.5 rounded-xl">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Recycled Mass</p>
                        <p className="text-lg font-bold text-slate-800 mt-0.5">{selectedUser.total_recycled_kg || 0} kg</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => setSelectedUser(null)} className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 text-[10px] font-bold rounded-lg h-6 px-2">Reset</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Intake Ledger Logging Panel */}
            <Card className="md:col-span-7 bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-slate-50 p-6 bg-slate-50/40">
                <CardTitle className="text-base font-bold text-slate-800">Log Waste Ledger Records</CardTitle>
                <CardDescription className="text-xs">Allocate points derived from scale telemetry indices</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-600">Material Stream Type</Label>
                    <select value={materialId} onChange={(e) => setMaterialId(e.target.value)} className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 h-10 text-xs font-medium focus:outline-none focus:border-primary text-slate-700">
                      <option value="">Select Target Material Classification...</option>
                      {MATERIALS.map(m => (
                        <option key={m.id} value={m.id}>{m.name} ({m.bin_color} Sorting Channel)</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-600">Item Unit Count</Label>
                    <Input type="number" placeholder="Example: 12 bottles..." value={quantity} onChange={(e) => setQuantity(e.target.value)} className="rounded-xl bg-slate-50/50 border-slate-200 h-10 text-xs font-medium focus-visible:ring-primary" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-600">Physical Weight Yield (Optional kilograms override)</Label>
                  <Input type="number" placeholder="Example: 4.5kg..." value={weight} onChange={(e) => setWeight(e.target.value)} className="rounded-xl bg-slate-50/50 border-slate-200 h-10 text-xs font-medium focus-visible:ring-primary" />
                </div>

                {materialId && quantity && (
                  <div className="p-4 bg-indigo-50/30 border border-indigo-100/50 rounded-xl flex items-center justify-between text-xs font-semibold text-indigo-700 animate-in fade-in slide-in-from-top-1">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-indigo-500 animate-pulse" />
                      <span>Estimated Points Matrix Yield:</span>
                    </div>
                    <span className="text-base font-extrabold text-indigo-600">
                      {Math.round(
                        Number(quantity) * (MATERIALS.find(m => m.id === materialId)?.base_unit || 1) * (activeCampaign?.material_id === materialId ? activeCampaign.multiplier : 1)
                      )} pts
                    </span>
                  </div>
                )}

                <Button onClick={handleLogIntakeDeposit} disabled={isSubmittingWaste || !selectedUser || !materialId || !quantity} className="w-full rounded-xl font-bold text-xs h-11 bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/10 gap-2 mt-4 transition-all disabled:opacity-40">
                  {isSubmittingWaste ? <Activity className="h-4 w-4 animate-spin" /> : "Commit Point Settlement Balance"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Onboarding Form Block Panel */}
          <TabsContent value="provisioning" className="outline-none">
            <Card className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden max-w-3xl mx-auto">
              <CardHeader className="border-b border-slate-50 p-6 bg-slate-50/40">
                <CardTitle className="text-base font-bold text-slate-800">Onboard System Profiles</CardTitle>
                <CardDescription className="text-xs">Generate credentials and roles completely secured inside the cloud layer</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-600">First Name</Label>
                      <Input placeholder="John" value={newFirstName} onChange={(e) => setNewFirstName(e.target.value)} className="rounded-xl bg-slate-50/50 border-slate-200 h-10 text-xs font-medium focus-visible:ring-primary" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-600">Last Name</Label>
                      <Input placeholder="Doe" value={newLastName} onChange={(e) => setNewLastName(e.target.value)} className="rounded-xl bg-slate-50/50 border-slate-200 h-10 text-xs font-medium focus-visible:ring-primary" />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-600">Account Username</Label>
                      <Input placeholder="johndoe_2026" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className="rounded-xl bg-slate-50/50 border-slate-200 h-10 text-xs font-medium focus-visible:ring-primary" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-600">Email Address</Label>
                      <Input type="email" placeholder="john@example.cm" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="rounded-xl bg-slate-50/50 border-slate-200 h-10 text-xs font-medium focus-visible:ring-primary" />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-600">Phone Number (+237)</Label>
                      <Input placeholder="+237 677889900" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} className="rounded-xl bg-slate-50/50 border-slate-200 h-10 text-xs font-medium focus-visible:ring-primary" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-600">Regional Municipality Location</Label>
                      <select value={newCity} onChange={(e) => setNewCity(e.target.value)} className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 h-10 text-xs font-medium focus:outline-none focus:border-primary text-slate-700">
                        <option value="Douala">Douala (Littoral)</option>
                        <option value="Yaoundé">Yaoundé (Centre)</option>
                        <option value="Buea">Buea (South West)</option>
                        <option value="Bamenda">Bamenda (North West)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-600">Authentication Security PIN</Label>
                      <Input type="password" placeholder="6-digit PIN numerical security string..." value={newPin} onChange={(e) => setNewPin(e.target.value)} className="rounded-xl bg-slate-50/50 border-slate-200 h-10 text-xs font-medium focus-visible:ring-primary" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-600">System Permission Security clearance</Label>
                      <select value={assignedRole} onChange={(e) => setAssignedRole(e.target.value)} className="w-full rounded-xl bg-slate-50 border border-slate-200 px-3.5 h-10 text-xs font-medium focus:outline-none focus:border-primary text-slate-700">
                        <option value="user">Standard User (End Recycler Wallet View)</option>
                        <option value="kiosk_admin">Kiosk Admin (Operational Supervisor Interface)</option>
                        <option value="super_admin">Super Admin (Global System Controller Clearance)</option>
                      </select>
                    </div>
                  </div>

                  <Button type="submit" disabled={isProvisioning} className="w-full rounded-xl font-bold text-xs h-11 bg-primary hover:bg-primary/95 text-white shadow-md shadow-primary/10 gap-2 mt-4 transition-all">
                    {isProvisioning ? <Activity className="h-4 w-4 animate-spin" /> : "Finalize Account Provisioning Profile"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Operational Metrics Charts Breakdown Panel */}
          <TabsContent value="analytics" className="outline-none">
            <Card className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-slate-50 p-6 bg-slate-50/40">
                <CardTitle className="text-base font-bold text-slate-800">Stream Performance Statistics Summary</CardTitle>
                <CardDescription className="text-xs">Isolate your handled material metrics tracked across deployment scopes today</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-slate-600 border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <th className="px-6 py-4">Classification Parameter</th>
                        <th className="px-4 py-4 text-center">Color Code Channel</th>
                        <th className="px-4 py-4 text-right">Total Operations Handled</th>
                        <th className="px-4 py-4 text-right">Collected Influx Units</th>
                        <th className="px-6 py-4 text-right">Tokens Dispatched Today</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {materialBreakdown.map((row) => (
                        <tr key={row.material.id} className="hover:bg-slate-50/40 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-800">{row.material.name}</td>
                          <td className="px-4 py-4 text-center">
                            <span className="inline-flex items-center rounded-full px-2 py-0.5 font-semibold text-[10px] bg-slate-100 text-slate-600 border border-slate-200">
                              {row.material.bin_color} Bin
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right font-semibold text-slate-500">{row.count} deposits</td>
                          <td className="px-4 py-4 text-right font-bold text-slate-800">{row.units} units</td>
                          <td className="px-6 py-4 text-right font-extrabold text-emerald-600">+{row.credits} pts</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}