'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createSupabaseClient } from '@/app/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import type { UserSession } from '../types';
import { toast } from 'sonner';
import { dispatchPush } from '../lib/pushNotification';

interface AuthContextType {
  user: UserSession | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: { name: string }) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseClient();

    // If Supabase is not configured, skip auth and mark as not loading
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser({
            userId: user.id,
            email: user.email || '',
            name: user.user_metadata?.display_name as string || '',
            paymentStatus: 'free',
            loggedInAt: new Date().toISOString(),
          });
        }
      }
      setIsLoading(false);
    }

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      if (session) {
        supabase.auth.getUser().then(({ data: { user } }: { data: { user: User | null } }) => {
          if (user) {
            setUser({
              userId: user.id,
              email: user.email || '',
              name: user.user_metadata?.display_name as string || '',
              paymentStatus: 'free',
              loggedInAt: new Date().toISOString(),
            });
          }
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const supabase = createSupabaseClient();
    if (!supabase) {
      toast.error('Supabase não configurado');
      return { success: false, error: 'Supabase não configurado' };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    }
    toast.success('Login realizado com sucesso');
    dispatchPush('Back Discipline', 'Login realizado com sucesso');
    return { success: true };
  };

  const register = async (email: string, password: string, name?: string) => {
    const supabase = createSupabaseClient();
    if (!supabase) {
      toast.error('Supabase não configurado');
      return { success: false, error: 'Supabase não configurado' };
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name || '',
        },
      },
    });

    if (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    }
    toast.success('Conta criada com sucesso');
    dispatchPush('Back Discipline', 'Conta criada com sucesso');
    return { success: true };
  };

  const logout = async () => {
    const supabase = createSupabaseClient();
    if (!supabase) {
      setUser(null);
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
    toast.info('Você saiu da sua conta');
  };

  const updateProfile = async ({ name }: { name: string }) => {
    const supabase = createSupabaseClient();
    if (!supabase) {
      toast.error('Supabase não configurado');
      return { success: false, error: 'Supabase não configurado' };
    }
    const { error } = await supabase.auth.updateUser({
      data: { display_name: name },
    });

    if (error) {
      toast.error('Erro ao atualizar perfil');
      return { success: false, error: error.message };
    }

    setUser(prev => prev ? { ...prev, name } : null);
    toast.success('Perfil atualizado com sucesso');
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}