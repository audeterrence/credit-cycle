import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Recycle, LogOut, Search, UserPlus, Package, CheckCircle, Users, Coins, User as UserIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  searchUsers, registerUser, submitAndApproveWaste,
  getFocusWeek, MATERIALS, getUsers, getUserSubmissions, type User,
} from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

const KioskAdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [, setTick] = useState(0);

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

  if (!user) return null;

  const currentFocusWeek = getFocusWeek();

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
      toast({ title: "Account created!", description: `${newUser.full_name} (@${newUser.username})` });
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

  const userHistory = selectedUser ? getUserSubmissions(selectedUser.id).slice(-5).reverse() : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-display text-xl font-bold text-primary">
            <Recycle className="h-7 w-7" />
            <span>Credi-Can</span>
            <span className="ml-2 rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-600">
              Kiosk Agent Panel
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-700">{user.full_name}</span>
            <Button variant="ghost" size="icon" onClick={async () => { await logout(); navigate("/"); }}>
              <LogOut className="h-5 w-5 text-slate-500" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl py-8 space-y-6">
        {currentFocusWeek && (
          <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm animate-pulse">
            <span className="text-xl">⚡</span>
            <div>
              <p className="text-sm font-bold text-amber-900">Focus Event Multiplier Engaged</p>
              <p className="text-xs text-amber-700">{currentFocusWeek.label} brings ×{currentFocusWeek.multiplier} scaling factors today.</p>
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-12 items-start">
          <div className="md:col-span-12 space-y-6">
            {/* Step 1: Find User Card */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                  <Search className="h-5 w-5 text-primary" /> Find or Register Account
                </CardTitle>
                <CardDescription>Verify identifier strings before registering material intakes.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search username or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="h-11 bg-white"
                  />
                  <Button onClick={handleSearch} className="h-11 px-5">Search</Button>
                </div>

                {searchResults.length > 0 && (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-inner max-h-60 overflow-y-auto">
                    {searchResults.map((u) => (
                      <button key={u.id} onClick={() => handleSelectUser(u)}
                        className="flex w-full items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors">
                        <div>
                          <p className="font-bold text-slate-800">{u.full_name} <span className="text-slate-400 font-normal">@{u.username}</span></p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                        <span className="text-sm font-black text-primary">{u.total_credits} cr</span>
                      </button>
                    ))}
                  </div>
                )}

                {showCreateForm && (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 space-y-4">
                    <p className="flex items-center gap-2 text-sm font-bold text-slate-800">
                      <UserPlus className="h-4 w-4 text-primary" /> Fast Identity Onboarding Form
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div><Label className="text-slate-600">Username</Label><Input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="johndoe" className="bg-white mt-1" /></div>
                      <div><Label className="text-slate-600">Full Name</Label><Input value={newFullName} onChange={(e) => setNewFullName(e.target.value)} placeholder="John Doe" className="bg-white mt-1" /></div>
                      <div><Label className="text-slate-600">Email Address</Label><Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="user@example.com" className="bg-white mt-1" /></div>
                      <div><Label className="text-slate-600">Phone</Label><Input type="tel" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="+237 6..." className="bg-white mt-1" /></div>
                    </div>
                    <Button onClick={handleCreateUser} disabled={!newUsername || !newFullName || !newEmail} className="w-full sm:w-auto shadow-sm">
                      Register & Select User
                    </Button>
                  </div>
                )}

                {selectedUser && (
                  <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-4 animate-in fade-in duration-200">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-primary/70">Selected Wallet context</span>
                      <p className="text-lg font-black text-slate-900">{selectedUser.full_name} <span className="text-slate-500 font-normal text-sm">@{selectedUser.username}</span></p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setSelectedUser(null)} className="border-slate-200 bg-white shadow-sm font-bold">Change Target</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Step 2: Waste Logging Input Module */}
            {selectedUser && (
              <Card className="shadow-sm border-slate-200 animate-in slide-in-from-bottom-2 duration-300">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                    <Package className="h-5 w-5 text-primary" /> Record Weight Deposits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <Label className="text-slate-600">Material classification</Label>
                      <select className="w-full rounded-md border border-slate-200 bg-white h-10 px-3 py-2 text-sm mt-1 focus:ring-2 focus:ring-primary/20" value={materialId} onChange={(e) => setMaterialId(e.target.value)}>
                        <option value="">Select Material...</option>
                        {MATERIALS.map((m) => (
                          <option key={m.id} value={m.id}>{m.name} ({m.bin_color}){currentFocusWeek?.material_id === m.id ? " ⚡ Active" : ""}</option>
                        ))}
                      </select>
                    </div>
                    <div><Label className="text-slate-600">Quantity (units)</Label><Input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="e.g. 15" className="h-10 mt-1" /></div>
                    <div><Label className="text-slate-600">Net Weight (kg, optional)</Label><Input type="number" min="0" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 2.4" className="h-10 mt-1" /></div>
                  </div>
                  <Button onClick={handleSubmitWaste} disabled={!materialId || !quantity} className="w-full sm:w-auto h-11 font-bold shadow-md shadow-primary/10">
                    Award Credits Instantly
                  </Button>

                  {userHistory.length > 0 && (
                    <div className="pt-4 border-t border-slate-100">
                      <p className="mb-2.5 text-xs font-black uppercase tracking-wider text-slate-400">Recent logs for @{selectedUser.username}</p>
                      <div className="overflow-hidden rounded-xl border border-slate-100 shadow-sm bg-white">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-50 text-slate-600 border-b border-slate-100">
                            <tr>
                              <th className="px-4 py-2.5 text-left font-bold">Material</th>
                              <th className="px-4 py-2.5 text-left font-bold">Units</th>
                              <th className="px-4 py-2.5 text-right font-bold">Payout</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {userHistory.map((s) => {
                              const mat = MATERIALS.find((m) => m.id === s.material_id);
                              return (
                                <tr key={s.id} className="hover:bg-slate-50/50">
                                  <td className="px-4 py-3 font-medium text-slate-700">{mat?.name ?? "Assorted"}</td>
                                  <td className="px-4 py-3 text-slate-600">{s.quantity_units}</td>
                                  <td className="px-4 py-3 text-right font-bold text-emerald-600">+{s.credits_awarded} cr</td>
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default KioskAdminDashboard;