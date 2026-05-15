import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

export type UserRole = 'user' | 'super_admin' | 'kiosk_admin';

export interface MappedUser {
  id: string;
  username: string;
  full_name: string;
  email: string;
  phone_number: string;
  role: UserRole;
  total_credits: number;
  created_at: string;
}

interface AuthContextType {
  user: MappedUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<MappedUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileAndMap = async (authId: string, email: string, createdAt: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authId)
        .single();

      if (error) throw error;

      if (data) {
        setUser({
          id: authId,
          username: data.username || '',
          full_name: data.full_name || `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'User',
          email: data.email || email,
          phone_number: data.phone_number || '',
          role: (data.role?.toLowerCase() as UserRole) || 'user',
          total_credits: data.credits ?? data.total_credits ?? 0,
          created_at: data.created_at || createdAt,
        });
      }
    } catch (err) {
      console.error("AuthContext: Profile fetching error:", err);
      setUser(null);
    }
  };

  const handleAuthChange = useCallback(async (session: any) => {
    if (session?.user) {
      await fetchProfileAndMap(session.user.id, session.user.email || '', session.user.created_at);
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthChange(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleAuthChange(session);
    });

    return () => subscription.unsubscribe();
  }, [handleAuthChange]);

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
  };

  const refresh = async () => {
    if (user?.id) {
      await fetchProfileAndMap(user.id, user.email, user.created_at);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};