import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, ShieldCheck, Loader2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Resolve User Email and Role via custom profiles database matrix
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email, role')
        .eq('username', username.toLowerCase().trim())
        .single();

      if (profileError || !profile) {
        throw new Error("Username not found.");
      }

      // 2. Authenticate user credentials against Supabase Auth engine
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password: pin,
      });

      if (authError) throw authError;

      // 3. Dispatch and redirect the profile context into their designated matching view
      if (authData.user) {
        const normalizedRole = profile.role?.toLowerCase().trim() || "user";
        
        if (normalizedRole === "super_admin" || normalizedRole === "admin") {
          navigate("/admin-dashboard");
        } else if (normalizedRole === "kiosk_admin") {
          navigate("/kiosk-dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err: any) {
      console.error("Login verification crash log:", err.message);
      if (err.message === "Username not found.") {
        setError("This username does not exist inside our records.");
      } else if (err.message.includes("Invalid login credentials")) {
        setError("Incorrect security PIN. Please check details and try again.");
      } else {
        setError("An unexpected error occurred during account verification.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4 md:py-24">
        <div className="w-full max-w-[1100px] bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100 flex flex-col lg:grid lg:grid-cols-12">
          
          {/* Left Hero Graphic Column */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-12 bg-slate-900 text-white relative">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1000')] opacity-5 bg-cover mix-blend-overlay"></div>
            <div className="relative z-10 space-y-8">
              <h1 className="text-4xl xl:text-5xl font-black leading-tight">Welcome <br />Back.</h1>
              <p className="text-slate-400 text-lg">Log in to manage your recycling wallet and impact.</p>
              <div className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-white/10">
                <ShieldCheck className="h-7 w-7 text-primary" />
                <div>
                  <p className="text-sm font-bold">Secure Access Layer</p>
                  <p className="text-xs text-slate-500">Credi-Can identity encryption module.</p>
                </div>
              </div>
            </div>
            <p className="relative z-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Credi-Can © 2026</p>
          </div>

          {/* Right Input Form Column */}
          <div className="lg:col-span-7 p-8 md:p-16 xl:p-20 flex items-center">
            <div className="max-w-sm w-full mx-auto space-y-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Login</h2>
                <p className="text-slate-500 font-medium">Please enter your credentials below.</p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100 animate-in fade-in zoom-in-95 duration-150">
                  {error}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleLogin}>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Username handle</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                    <Input 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                      placeholder="e.g., mbassa_terrence" 
                      className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 text-slate-800 font-medium placeholder:text-slate-400" 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Security PIN</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                    <Input 
                      value={pin} 
                      onChange={(e) => setPin(e.target.value)} 
                      type="password" 
                      placeholder="••••••" 
                      className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 text-slate-800 font-medium placeholder:text-slate-400" 
                      required 
                    />
                  </div>
                </div>

                <Button disabled={isLoading} type="submit" className="w-full h-14 rounded-2xl font-bold shadow-lg shadow-primary/10">
                  {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Access Account"}
                </Button>
              </form>

              <p className="text-sm text-slate-500 font-medium text-center">
                New to Credi-Can? <Link to="/signup" className="text-primary font-bold hover:underline">Create an account</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;