import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { getCurrentUser, setCurrentUser, loginUser, registerUser, type User } from "@/lib/store";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  signup: (data: { full_name: string; email: string; password: string; phone_number: string }) => void;
  logout: () => void;
  refresh: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getCurrentUser());

  const login = useCallback((email: string, password: string) => {
    const u = loginUser(email, password);
    setCurrentUser(u);
    setUser(u);
  }, []);

  const signup = useCallback((data: { full_name: string; email: string; password: string; phone_number: string }) => {
    const u = registerUser(data);
    setCurrentUser(u);
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setUser(null);
  }, []);

  const refresh = useCallback(() => {
    const u = getCurrentUser();
    if (u) {
      const users = JSON.parse(localStorage.getItem("credi_users") || "[]");
      const fresh = users.find((x: User) => x.id === u.id);
      if (fresh) {
        setCurrentUser(fresh);
        setUser(fresh);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
