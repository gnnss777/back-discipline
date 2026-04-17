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
      <div className="relative w-full max-w-md mx-4 bg-[#0F0F0F] border border-[#3A2E22] rounded-lg p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">
          {mode === 'login' ? 'Entrar' : 'Criar Conta'}
        </h2>
        <p className="text-gray-400 mb-6">
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
              <label className="block text-gray-300 mb-2">Nome (opcional)</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:border-[#B8956A] focus:outline-none"
                  placeholder="Seu nome"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:border-[#B8956A] focus:outline-none"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-3 pl-11 pr-12 text-white placeholder-gray-500 focus:border-[#B8956A] focus:outline-none"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-gray-300 mb-2">Confirmar Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:border-[#B8956A] focus:outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#B8956A] hover:bg-[#c9a67a] text-[#0A0A0A] font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading 
              ? (mode === 'login' ? 'Entrando...' : 'Cadastrando...')
              : (mode === 'login' ? 'Entrar' : 'Cadastrar')}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          {mode === 'login' ? (
            <>
              Não tem conta?{' '}
              <button 
                onClick={switchMode} 
                className="text-[#B8956A] hover:text-[#c9a67a]"
              >
                Cadastrar
              </button>
            </>
          ) : (
            <>
              Já tem conta?{' '}
              <button 
                onClick={switchMode} 
                className="text-[#B8956A] hover:text-[#c9a67a]"
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