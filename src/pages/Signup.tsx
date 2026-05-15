import { useState } from "react";
import { Link } from "react-router-dom"; // Pour une navigation fluide
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, MapPin, User, AtSign, Globe, CheckCircle2, LogIn, Lock, Loader2, Mail } from "lucide-react";

const Signup = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [town, setTown] = useState("");
  const [otherTown, setOtherTown] = useState("");
  const [pin, setPin] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: pin,
        options: {
          data: {
            username: username.toLowerCase(),
            full_name: `${firstName} ${lastName}`,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              username: username.toLowerCase(),
              email: email,
              first_name: firstName,
              last_name: lastName,
              phone_number: phone,
              town: town === "other" ? otherTown : town,
              credits: 0,
              total_recycled_kg: 0
            }
          ]);

        if (profileError) throw profileError;
        setIsSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during signup.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-10 px-4 md:py-20">
        <div className="w-full max-w-[1100px] bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100 flex flex-col lg:grid lg:grid-cols-12">
          
          {/* LEFT: Branding Sidebar */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-12 bg-primary text-white relative">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1000')] opacity-10 bg-cover mix-blend-overlay"></div>
            <div className="relative z-10 space-y-8">
              <h1 className="text-4xl xl:text-5xl font-black leading-tight">Join the movement.</h1>
              <p className="text-primary-foreground/90 text-lg leading-relaxed">
                Start your green journey. Join thousands across Cameroon turning waste into value.
              </p>
              
              <div className="space-y-4 pt-4">
                {["Secure Digital Identity", "Instant Reward Payouts", "Community Impact Tracking"].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                    <span className="text-sm font-bold">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Form Content */}
          <div className="lg:col-span-7 p-8 md:p-12 xl:p-16">
            <div className="max-w-md mx-auto">
              
              {!isSuccess ? (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h2>
                    <p className="text-slate-500 font-medium">Build your secure recycler profile.</p>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100">
                      {error}
                    </div>
                  )}

                  <form className="space-y-4" onSubmit={handleSignup}>
                    {/* Names Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">First Name</Label>
                        <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Mbassa" className="h-12 rounded-xl bg-slate-50 border-none focus:ring-primary" required />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Last Name</Label>
                        <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Terrence" className="h-12 rounded-xl bg-slate-50 border-none focus:ring-primary" required />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="terrence@example.com" className="pl-12 h-12 rounded-xl bg-slate-50 border-none focus:ring-primary" required />
                      </div>
                    </div>

                    {/* Username & Phone */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Username</Label>
                        <div className="relative">
                          <AtSign className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                          <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="terrence_01" className="pl-12 h-12 rounded-xl bg-slate-50 border-none focus:ring-primary" required />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</Label>
                        <div className="relative">
                          <span className="absolute left-4 top-3.5 text-sm font-bold text-slate-400">+237</span>
                          <Input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="6xx xxx xxx" className="pl-16 h-12 rounded-xl bg-slate-50 border-none focus:ring-primary" required />
                        </div>
                      </div>
                    </div>

                    {/* PIN & Town */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Security PIN</Label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                          <Input value={pin} onChange={(e) => setPin(e.target.value)} type="password" maxLength={6} placeholder="••••••" className="pl-12 h-12 rounded-xl bg-slate-50 border-none focus:ring-primary" required />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Town / City</Label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                          <select className="w-full pl-12 h-12 rounded-xl bg-slate-50 border-none text-sm focus:ring-2 focus:ring-primary outline-none appearance-none" required value={town} onChange={(e) => setTown(e.target.value)}>
                            <option value="">Select City</option>
                            <option value="douala">Douala</option>
                            <option value="yaounde">Yaoundé</option>
                            <option value="bafoussam">Bafoussam</option>
                            <option value="other">Other...</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {town === "other" && (
                      <div className="space-y-1.5 animate-in slide-in-from-top-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Specify Location</Label>
                        <div className="relative">
                          <Globe className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                          <Input value={otherTown} onChange={(e) => setOtherTown(e.target.value)} placeholder="Enter your city" className="pl-12 h-12 rounded-xl bg-slate-50 border-none focus:ring-primary" required />
                        </div>
                      </div>
                    )}

                    <Button disabled={isLoading} type="submit" className="w-full h-14 rounded-2xl font-bold mt-6 shadow-xl shadow-primary/20 transition-transform active:scale-95">
                      {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Create My Account"}
                      {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </form>

                  {/* LIEN DE REDIRECTION VERS LOGIN */}
                  <p className="text-center text-sm text-slate-500 pt-4">
                    Already have an account? <Link to="/login" className="font-bold text-primary hover:underline underline-offset-4">Log in here</Link>
                  </p>
                </div>
              ) : (
                /* SUCCESS STATE */
                <div className="space-y-8 text-center animate-in zoom-in-95 duration-500">
                  <div className="bg-emerald-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-3xl font-black text-slate-900">Welcome, {firstName}!</h2>
                    <p className="text-slate-500 font-medium leading-relaxed">
                      Your account is ready. Please log in to start recycling.
                    </p>
                  </div>
                  <Button asChild className="w-full h-14 rounded-2xl font-bold shadow-xl shadow-emerald-200">
                    <Link to="/login" className="flex items-center justify-center gap-2">
                      Log In Now <LogIn className="h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Signup;