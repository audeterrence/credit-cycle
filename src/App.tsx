import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import Partner from "./pages/Partner";

const queryClient = new QueryClient();

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "user" | "super_admin" | "kiosk_admin";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading } = useAuth(); // Removed loose 'role' destructuring bug

  // 1. Show crisp loading state while Supabase profile data is being fetched
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-sm font-medium text-slate-500 tracking-wide">Securing Session...</p>
        </div>
      </div>
    );
  }

  // 2. Reject unauthenticated lookups
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. String Casing Normalization Guard - READ DIRECTLY FROM user.role
  const userRoleNormalized = user.role?.toLowerCase().trim() || "user";
  const requiredRoleNormalized = requiredRole?.toLowerCase().trim();

  if (requiredRoleNormalized && userRoleNormalized !== requiredRoleNormalized) {
    // Cross-route the user to their actual authorized dashboard layout if they cross paths
    if (userRoleNormalized === "super_admin") {
      return <Navigate to="/admin-dashboard" replace />;
    }
    if (userRoleNormalized === "kiosk_admin") {
      return <Navigate to="/kiosk-dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* PUBLIC PLATFORM CHANNELS */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/partner" element={<Partner />} />

            {/* END-USER CONSUMER DASHBOARD */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole="user">
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* SUPER ADMIN MASTER TERMINAL */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* KIOSK OPERATOR TERMINAL */}
            <Route
              path="/kiosk-dashboard"
              element={
                <ProtectedRoute requiredRole="kiosk_admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* ERROR ROUTE INTERCEPT */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;