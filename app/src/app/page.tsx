'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Dumbbell, Trophy, ArrowRight, Flame, GraduationCap, Lock } from 'lucide-react';
import { BottomNav } from '../components/Layout';
import { AuthModal } from '../components/AuthModal';
import { useAuth } from '../hooks/useAuth';
import { chapters } from '../lib/chapters';

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  const openLogin = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const openRegister = () => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };

  const week1Chapters = chapters.filter(c => c.order >= 1 && c.order <= 2);
  const weeks = [
    { name: 'Semana 1', chapters: chapters.filter(c => c.order >= 1 && c.order <= 2) },
    { name: 'Semana 2', chapters: chapters.filter(c => c.order >= 3 && c.order <= 4) },
    { name: 'Semana 3', chapters: chapters.filter(c => c.order >= 5 && c.order <= 6) },
    { name: 'Semana 4', chapters: chapters.filter(c => c.order >= 7 && c.order <= 8) },
    { name: 'Semana 5', chapters: chapters.filter(c => c.order >= 9 && c.order <= 10) },
    { name: 'Semana 6', chapters: [chapters.find(c => c.order === 11)!].filter(Boolean) },
  ];

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
      <header className="border-b border-[#3A2E22]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-medium tracking-[0.3em]">JJ</span>
            <span className="text-2xl font-light tracking-[0.2em] text-[#666]">MONTEIRO</span>
            <span className="text-lg font-bold tracking-[0.15em] text-[#B8956A]">BACK DISCIPLINE</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={openLogin}
              className="text-sm font-medium text-gray-400 hover:text-[#B8956A] transition-colors"
            >
              Entrar
            </button>
            <button 
              onClick={openRegister}
              className="px-4 py-2 bg-[#B8956A] text-[#0A0A0A] text-sm font-bold tracking-wider rounded-sm hover:bg-[#9A7A50] transition-colors"
            >
              Cadastrar
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#B8956A]/5 to-[#0A0A0A] z-0" />
          
          <div className="relative z-10 text-center max-w-4xl mx-auto px-6 py-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-[#B8956A]/20 text-[#B8956A] text-sm font-bold tracking-wider mb-8">
              <Flame className="w-4 h-4" />
              DISCIPLINA NÃO É MOTIVAÇÃO. É MÉTODO.
            </div>
            
            <h1 className="text-5xl md:text-7xl font-medium mb-6 tracking-wide leading-tight">
              CONSTRUA AS COSTAS
              <br />
              <span className="text-[#B8956A]">QUE VOCÊ MERECE</span>
            </h1>
            
            <p className="text-xl text-[#666] mb-4 max-w-2xl mx-auto font-light tracking-wide">
              6 semanas de treinamento estruturado por JJ Monteiro, com base acadêmica em Educação Física e Nutrição e anos de experiência prática.
            </p>
            <p className="text-sm text-[#555] mb-10 font-light tracking-wide">
              Cada série, cada técnica e cada nível de esforço com propósito definido por quem estuda e aplica.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={openRegister}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#B8956A] text-[#0A0A0A] font-bold tracking-wider rounded-sm hover:bg-[#9A7A50] transition-colors"
              >
                COMEÇAR AGORA
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={openLogin}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#3A2E22] text-[#E8E0D0] font-bold tracking-wider rounded-sm hover:border-[#B8956A] hover:text-[#B8956A] transition-colors"
              >
                ENTRAR
              </button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 border-y border-[#3A2E22] bg-[#0F0F0F]">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-medium text-[#B8956A] tracking-wider">6</div>
              <div className="text-sm text-[#555] mt-2 tracking-wider">SEMANAS</div>
            </div>
            <div>
              <div className="text-4xl font-medium text-[#B8956A] tracking-wider">11</div>
              <div className="text-sm text-[#555] mt-2 tracking-wider">CAPÍTULOS</div>
            </div>
            <div>
              <div className="text-4xl font-medium text-[#B8956A] tracking-wider">16+</div>
              <div className="text-sm text-[#555] mt-2 tracking-wider">EXERCÍCIOS</div>
            </div>
          </div>
        </section>

        {/* Program Preview - Locked */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-medium mb-4 tracking-wider">PROGRAMA — 6 SEMANAS</h2>
            <p className="text-[#555] mb-6">Faça login para acessar o conteúdo completo</p>
          </div>

          <div className="space-y-4">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="border border-[#2A2A2A] rounded-lg overflow-hidden">
                <div className="bg-[#0F0F0F] px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#B8956A]/20 flex items-center justify-center rounded-sm">
                      <span className="text-[#B8956A] font-bold text-sm">{weekIndex + 1}</span>
                    </div>
                    <span className="font-medium">{week.name}</span>
                  </div>
                  <Lock className="w-4 h-4 text-gray-600" />
                </div>
                <div className="px-6 py-3 bg-[#0A0A0A] space-y-2">
                  {week.chapters.map((chapter) => (
                    <div 
                      key={chapter.slug}
                      className="flex items-center justify-between text-sm text-gray-500 py-2 border-b border-[#1A1A1A] last:border-0"
                    >
                      <span>{chapter.title}</span>
                      <button 
                        onClick={openLogin}
                        className="text-[#B8956A] text-xs hover:underline"
                      >
                        <Lock className="w-3 h-3 inline mr-1" />
                        Login
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button 
              onClick={openRegister}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#B8956A] text-[#0A0A0A] font-bold tracking-wider rounded-sm hover:bg-[#9A7A50] transition-colors"
            >
              CADASTRAR PARA ACESSAR
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* About Section */}
        <section className="max-w-4xl mx-auto px-6 py-16 text-center border-t border-[#3A2E22]">
          <h2 className="text-2xl font-medium mb-6 tracking-wider">SOBRE O PROGRAMA</h2>
          <p className="text-[#666] font-light text-lg leading-relaxed mb-8">
            Back Discipline não é uma rotina de treino. É a síntese de tudo que JJ Monteiro desenvolveu sobre treinamento de costas — traduzida em um programa que qualquer pessoa comprometida pode executar. Cada capítulo, cada série e cada RPE foi pensado para quem quer resultado real, não apenas motivação.
          </p>
          <div className="flex items-center justify-center gap-3 text-[#B8956A]">
            <GraduationCap className="w-5 h-5" />
            <span className="text-sm tracking-wider font-medium">JJ MONTEIRO — EDUCADOR FÍSICO E NUTRICIONISTA</span>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#3A2E22] py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-[#444] text-sm font-light tracking-wider">
          <p>JJ MONTEIRO · BACK DISCIPLINE · PROGRAMA DESENVOLVIDO COM BASE ACADÊMICA E EXPERIÊNCIA PRÁTICA</p>
        </div>
      </footer>

      <BottomNav />
    </div>
  );
}