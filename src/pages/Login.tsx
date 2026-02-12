import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Recycle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const loggedIn = login(identifier, password);
      navigate(loggedIn.role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (err: any) {
      toast({ variant: "destructive", title: "Login failed", description: err.message });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 font-display text-2xl font-bold text-primary">
            <Recycle className="h-8 w-8" />
            Credi-Can
          </Link>
          <h1 className="mt-4 font-display text-3xl font-bold text-foreground">Welcome back</h1>
          <p className="mt-1 text-muted-foreground">Sign in with your username or email</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="space-y-2">
            <Label htmlFor="identifier">Username or Email</Label>
            <Input id="identifier" type="text" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="username or email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full">Sign In</Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">Sign up</Link>
        </p>
        <div className="rounded-lg border border-border bg-secondary/50 p-3 text-center text-xs text-muted-foreground">
          <p className="font-medium">Admin demo login:</p>
          <p>admin@credican.cm / admin123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
