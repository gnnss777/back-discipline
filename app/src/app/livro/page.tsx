'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, BookOpen, Lock } from 'lucide-react';
import { chapters } from '../../../lib/chapters';
import { AuthModal } from '../../components/AuthModal';
import { useAuth } from '../../hooks/useAuth';

export default function LivroPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      setIsAuthModalOpen(true);
    }
  }, [user, isLoading]);

  const openLogin = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const openRegister = () => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };

  const part1Chapters = chapters.filter(c => c.part === 'I');
  const part2Chapters = chapters.filter(c => c.part === 'II');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#B8956A]">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E8E0D0]">
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      {/* Header */}
      <header className="border-b border-[#3A2E22] sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#666] hover:text-[#B8956A] transition-colors font-medium tracking-wider text-sm">
            <ArrowLeft className="w-4 h-4" />
            VOLTAR
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium tracking-[0.2em] text-[#666]">JJ MONTEIRO</span>
            <span className="text-sm font-bold tracking-[0.15em] text-[#B8956A]">BACK DISCIPLINE</span>
          </div>
          <button onClick={openLogin} className="text-sm text-[#B8956A] hover:text-[#9A7A50] font-medium tracking-wider">
            ENTRAR
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-medium mb-4 tracking-wider">PROGRAMA <span className="text-[#B8956A]">6 SEMANAS</span></h1>
          <p className="text-[#555] font-light tracking-wide">DE TREINAMENTO DE COSTAS</p>
        </div>

        {!user && (
          <div className="mb-8 p-4 bg-[#B8956A]/10 border border-[#B8956A]/30 rounded-sm text-center">
            <p className="text-[#B8956A] mb-2">Faça login para acompanhar seu progresso</p>
            <div className="flex gap-4 justify-center">
              <button onClick={openLogin} className="px-4 py-2 border border-[#B8956A] text-[#B8956A] rounded-sm hover:bg-[#B8956A] hover:text-[#0A0A0A] transition-colors font-medium tracking-wider text-sm">
                ENTRAR
              </button>
              <button onClick={openRegister} className="px-4 py-2 bg-[#B8956A] text-[#0A0A0A] rounded-sm hover:bg-[#9A7A50] transition-colors font-medium tracking-wider text-sm">
                CADASTRAR
              </button>
            </div>
          </div>
        )}

        {/* Progress */}
        <div className="mb-12 p-4 bg-[#0F0F0F] rounded-sm border border-[#3A2E22]">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-[#555] font-medium tracking-wider">SEU PROGRESSO</span>
            <span className="text-[#B8956A] font-bold tracking-wider">0 / 11 CAPÍTULOS</span>
          </div>
          <div className="h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
            <div className="h-full bg-[#B8956A]" style={{ width: '0%' }} />
          </div>
        </div>

        {/* Parte I */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-[#B8956A]/20 text-[#B8956A] text-sm font-bold tracking-wider rounded-sm">PARTE I</span>
            <h2 className="text-xl font-medium tracking-wider">SISTEMA E PRÁTICA</h2>
          </div>
          
          <div className="space-y-3">
            {part1Chapters.map((chapter) => (
              <Link
                key={chapter.slug}
                href={user ? `/livro/${chapter.slug}` : '#'}
                onClick={(e) => { if (!user) { e.preventDefault(); openLogin(); } }}
                className={`block p-5 border transition-all group rounded-sm ${
                  user 
                    ? 'bg-[#0F0F0F] border-[#3A2E22] hover:border-[#B8956A]' 
                    : 'bg-[#0F0F0F] border-[#2A2A2A] cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-sm ${
                    user 
                      ? 'bg-[#1a1a1a] text-[#444] group-hover:bg-[#B8956A]/20 group-hover:text-[#B8956A] transition-colors' 
                      : 'bg-[#1a1a1a] text-[#333]'
                  }`}>
                    {user ? <ArrowRight className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold tracking-wider text-sm ${user ? 'group-hover:text-[#B8956A]' : ''} transition-colors`}>{chapter.title}</h3>
                    <p className="text-xs text-[#444]">{chapter.description}</p>
                  </div>
                  {!user && <Lock className="w-4 h-4 text-[#333]" />}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Parte II */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-[#B8956A]/20 text-[#B8956A] text-sm font-bold tracking-wider rounded-sm">PARTE II</span>
            <h2 className="text-xl font-medium tracking-wider">FUNDAMENTOS TÉCNICOS</h2>
          </div>
          
          <div className="space-y-3">
            {part2Chapters.map((chapter) => (
              <Link
                key={chapter.slug}
                href={user ? `/livro/${chapter.slug}` : '#'}
                onClick={(e) => { if (!user) { e.preventDefault(); openLogin(); } }}
                className={`block p-5 border transition-all group rounded-sm ${
                  user 
                    ? 'bg-[#0F0F0F] border-[#3A2E22] hover:border-[#B8956A]' 
                    : 'bg-[#0F0F0F] border-[#2A2A2A] cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-sm ${
                    user 
                      ? 'bg-[#1a1a1a] text-[#444] group-hover:bg-[#B8956A]/20 group-hover:text-[#B8956A] transition-colors' 
                      : 'bg-[#1a1a1a] text-[#333]'
                  }`}>
                    {user ? <ArrowRight className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold tracking-wider text-sm ${user ? 'group-hover:text-[#B8956A]' : ''} transition-colors`}>{chapter.title}</h3>
                    <p className="text-xs text-[#444]">{chapter.description}</p>
                  </div>
                  {!user && <Lock className="w-4 h-4 text-[#333]" />}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {!user && (
          <div className="mt-12 p-6 bg-[#0F0F0F] rounded-xl border border-[#3A2E22] text-center">
            <p className="text-[#444] mb-4 font-light tracking-wide">FAÇA LOGIN PARA ACOMPANHAR SEU PROGRESSO</p>
            <button onClick={openRegister} className="inline-flex items-center gap-2 px-6 py-3 bg-[#B8956A] text-[#0A0A0A] font-bold tracking-wider rounded-sm hover:bg-[#9A7A50] transition-colors">
              CADASTRAR PARA ACESSAR
            </button>
          </div>
        )}
      </main>
    </div>
  );
}