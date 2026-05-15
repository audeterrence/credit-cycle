import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, User, Lock, ShieldCheck, Loader2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form States
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    console.log("--- Login Attempt Started ---");

    try {
      // STEP 1: Search for the real email in the profiles table
      console.log("Step 1: Looking up email for username:", username);
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', username.toLowerCase().trim())
        .single();

      if (profileError || !profile) {
        console.error("Step 1 Failed: Profile lookup error", profileError);
        throw new Error("Username not found.");
      }

      console.log("Step 1 Success: Found email:", profile.email);

      // STEP 2: Sign in with the email we just found and the PIN
      console.log("Step 2: Authenticating with Supabase Auth...");
      
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password: pin,
      });

      if (authError) {
        console.error("Step 2 Failed: Auth error", authError.message);
        throw authError;
      }

      console.log("Step 2 Success: User logged in!", data.user);
      
      // Navigate to the dashboard
      navigate("/dashboard");

    } catch (err: any) {
      console.error("Final Error State:", err);
      
      if (err.message === "Username not found.") {
        setError("This username is not registered.");
      } else if (err.message.includes("Invalid login credentials") || err.status === 400) {
        setError("Invalid security PIN. Please try again.");
      } else {
        setError(err.message || "An error occurred. Check your connection.");
      }
    } finally {
      setIsLoading(false);
      console.log("--- Login Attempt Finished ---");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 md:py-24">
        <div className="w-full max-w-[1100px] bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100 flex flex-col lg:grid lg:grid-cols-12">
          
          {/* Left Panel */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-12 bg-slate-900 text-white relative">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1000')] opacity-5 bg-cover mix-blend-overlay"></div>
            <div className="relative z-10 space-y-8">
              <h1 className="text-4xl xl:text-5xl font-black leading-tight">Welcome <br />Back.</h1>
              <p className="text-slate-400 text-lg">Log in to manage your recycling wallet and impact.</p>
              <div className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-white/10">
                <ShieldCheck className="h-7 w-7 text-primary" />
                <div>
                  <p className="text-sm font-bold">Secure Access</p>
                  <p className="text-xs text-slate-500">Credi-Can uses end-to-end encryption.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Form */}
          <div className="lg:col-span-7 p-8 md:p-16 xl:p-20 flex items-center">
            <div className="max-w-sm w-full mx-auto space-y-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Log In</h2>
                <p className="text-slate-500 font-medium">Enter your credentials below.</p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100">
                  {error}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleLogin}>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Username</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                    <Input 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username" 
                      className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20" 
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
                      className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20" 
                      required 
                    />
                  </div>
                </div>

                <Button disabled={isLoading} type="submit" className="w-full h-14 rounded-2xl font-bold">
                  {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Access Account"}
                </Button>
              </form>

              <p className="text-sm text-slate-500 font-medium text-center">
                New to Credi-Can? <a href="/signup" className="text-primary font-bold">Create an account</a>
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