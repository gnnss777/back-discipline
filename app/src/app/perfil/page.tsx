'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, LogOut, Save, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { UserAvatar } from '../../components/UserAvatar';

export default function PerfilPage() {
  const { user, isLoading, logout, updateProfile } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#B8956A]">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    router.push('/');
    return null;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfile({ name: name.trim() });
    setIsSaving(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-24">
      <header className="border-b border-[#2A2A2A] sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-[#666] hover:text-white transition-colors font-medium tracking-wider text-sm">
            <ArrowLeft className="w-4 h-4" />
            VOLTAR
          </Link>
          <span className="font-bold tracking-wider">PERFIL</span>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <UserAvatar name={user.name} email={user.email} size="md" />
          </div>
          <h1 className="text-2xl font-bold tracking-wider">
            {user.name || 'SEM NOME'}
          </h1>
          <p className="text-[#555] text-sm mt-1">{user.email}</p>
        </div>

        <div className="max-w-md mx-auto space-y-6">
          <div className="p-6 bg-[#111] rounded-xl border border-[#2A2A2A]">
            <h2 className="text-lg font-bold mb-4 tracking-wider flex items-center gap-2">
              <User className="w-5 h-5 text-[#B8956A]" />
              NOME DE EXIBIÇÃO
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:border-[#B8956A] focus:outline-none"
                placeholder="Seu nome"
              />
              <button
                type="submit"
                disabled={isSaving || name.trim() === (user.name || '')}
                className="w-full bg-[#B8956A] hover:bg-[#c9a67a] text-[#0A0A0A] font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed tracking-wider flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'SALVANDO...' : 'SALVAR'}
              </button>
            </form>
          </div>

          <div className="p-6 bg-[#111] rounded-xl border border-[#2A2A2A]">
            <h2 className="text-lg font-bold mb-4 tracking-wider">CONTA</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#555]">Email</span>
                <span className="text-gray-300">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#555]">Status</span>
                <span className="text-[#B8956A] uppercase">{user.paymentStatus || 'FREE'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full p-4 bg-[#111] border border-red-900/50 rounded-xl text-red-400 font-bold tracking-wider hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            SAIR DA CONTA
          </button>
        </div>
      </main>
    </div>
  );
}
