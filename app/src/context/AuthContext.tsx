'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { UserSession } from '../types';
import { getSession, setSession, clearSession, findUserByEmail, saveUser } from '../lib/storage';

interface AuthContextType {
  user: UserSession | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    setUser(session);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const existingUser = findUserByEmail(email);
    if (!existingUser) {
      return { success: false, error: 'Usuário não encontrado' };
    }
    if (existingUser.passwordHash !== password) {
      return { success: false, error: 'Senha incorreta' };
    }
    const session: UserSession = {
      userId: existingUser.id,
      email: existingUser.email,
      name: existingUser.name,
      paymentStatus: existingUser.paymentStatus,
      loggedInAt: new Date().toISOString(),
    };
    setSession(session);
    setUser(session);
    return { success: true };
  };

  const register = async (email: string, password: string, name?: string) => {
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return { success: false, error: 'Email já cadastrado' };
    }
    const newUser = {
      id: crypto.randomUUID(),
      email,
      passwordHash: password,
      name,
      createdAt: new Date().toISOString(),
      paymentStatus: 'free' as const,
    };
    saveUser(newUser);
    const session: UserSession = {
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      paymentStatus: newUser.paymentStatus,
      loggedInAt: new Date().toISOString(),
    };
    setSession(session);
    setUser(session);
    return { success: true };
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
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