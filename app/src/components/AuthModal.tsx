'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { X, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';

interface AuthModalProps {
 isOpen: boolean;
 onClose: () => void;
 initialMode?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
 const [mode, setMode] = useState<'login' | 'register'>(initialMode);
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [confirmPassword, setConfirmPassword] = useState('');
 const [name, setName] = useState('');
 const [showPassword, setShowPassword] = useState(false);
 const [error, setError] = useState('');
 const [isLoading, setIsLoading] = useState(false);

 const { login, register } = useAuth();
 const router = useRouter();

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  if (mode === 'register' && password !== confirmPassword) {
   setError('As senhas não conferem');
   setIsLoading(false);
   return;
  }

  let result;
  if (mode === 'login') {
   result = await login(email, password);
  } else {
   result = await register(email, password, name || undefined);
  }

  if (result.success) {
   onClose();
   router.push('/dashboard');
  } else {
   setError(result.error || 'Erro ao fazer login');
  }

  setIsLoading(false);
 };

 const switchMode = () => {
  setMode(mode === 'login' ? 'register' : 'login');
  setError('');
 };

 if (!isOpen) return null;

 return (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
   <div 
    className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
    onClick={onClose}
   />
   <div className="relative w-full max-w-md mx-4 bg-surface border border-secondary rounded-lg p-6">
    <button
     onClick={onClose}
     className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors"
    >
     <X className="w-5 h-5" />
    </button>

    <h2 className="text-2xl font-bold text-white mb-2">
     {mode === 'login' ? 'Entrar' : 'Criar Conta'}
    </h2>
    <p className="text-muted-foreground mb-6">
     {mode === 'login' 
      ? 'Entre com sua conta para continuar' 
      : 'Cadastre-se para começar seu treino'}
    </p>

    <form onSubmit={handleSubmit} className="space-y-4">
     {error && (
      <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-lg text-sm">
       {error}
      </div>
     )}

     {mode === 'register' && (
      <div>
       <label className="block text-muted-foreground mb-2">Nome (opcional)</label>
       <div className="relative">
        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
         type="text"
         value={name}
         onChange={(e) => setName(e.target.value)}
         className="w-full bg-card border border-border rounded-lg py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
         placeholder="Seu nome"
        />
       </div>
      </div>
     )}

     <div>
      <label className="block text-muted-foreground mb-2">Email</label>
      <div className="relative">
       <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
       <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full bg-card border border-border rounded-lg py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
        placeholder="seu@email.com"
        required
       />
      </div>
     </div>

     <div>
      <label className="block text-muted-foreground mb-2">Senha</label>
      <div className="relative">
       <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
       <input
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full bg-card border border-border rounded-lg py-3 pl-11 pr-12 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
        placeholder="••••••••"
        required
       />
       <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground"
       >
        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
       </button>
      </div>
     </div>

     {mode === 'register' && (
      <div>
       <label className="block text-muted-foreground mb-2">Confirmar Senha</label>
       <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
         type={showPassword ? 'text' : 'password'}
         value={confirmPassword}
         onChange={(e) => setConfirmPassword(e.target.value)}
         className="w-full bg-card border border-border rounded-lg py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
         placeholder="••••••••"
         required
        />
       </div>
      </div>
     )}

     <button
      type="submit"
      disabled={isLoading}
      className="w-full bg-primary hover:bg-primary-dark text-background font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
     >
      {isLoading 
       ? (mode === 'login' ? 'Entrando...' : 'Cadastrando...')
       : (mode === 'login' ? 'Entrar' : 'Cadastrar')}
     </button>
    </form>

    <p className="text-center text-muted-foreground mt-6">
     {mode === 'login' ? (
      <>
       Não tem conta?{' '}
       <button 
        onClick={switchMode} 
        className="text-primary hover:text-primary-dark"
       >
        Cadastrar
       </button>
      </>
     ) : (
      <>
       Já tem conta?{' '}
       <button 
        onClick={switchMode} 
        className="text-primary hover:text-primary-dark"
       >
        Entrar
       </button>
      </>
     )}
    </p>
   </div>
  </div>
 );
}