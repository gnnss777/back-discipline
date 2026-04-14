'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Trophy, Target, Clock, Lock, Dumbbell, Calendar } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useProgress } from '../../context/ProgressContext';
import { chapters } from '../../../lib/chapters';
import { DashboardStats } from '../../components/DashboardStats';

export default function DashboardPage() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const { stats, isLoading: progressLoading, progress } = useProgress();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || authLoading || progressLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#B8956A]">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <header className="border-b border-[#333] sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-sm z-50">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-[#666] hover:text-white transition-colors font-medium tracking-wider text-sm">
              <ArrowLeft className="w-4 h-4" />
              INÍCIO
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#B8956A] flex items-center justify-center rounded-sm">
                <span className="text-[#0A0A0A] text-sm font-bold">JJ</span>
              </div>
              <span className="font-bold tracking-wider">PROGRESSO</span>
            </div>
            <div className="w-16" />
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="mt-12 p-6 bg-[#111] rounded-xl border border-[#333] text-center">
            <h3 className="text-lg font-bold mb-2 tracking-wider">FAÇA LOGIN PARA ACOMPANHAR SEU PROGRESSO</h3>
            <p className="text-[#555] mb-4 tracking-wide">Crie uma conta para acompanhar seu progresso e treinar.</p>
            <div className="flex gap-4 justify-center">
              <Link href="/login" className="px-6 py-2 border border-[#333] text-[#ccc] rounded-sm hover:border-[#B8956A] hover:text-[#B8956A] transition-colors font-bold tracking-wider">
                ENTRAR
              </Link>
              <Link href="/register" className="px-6 py-2 bg-[#B8956A] text-[#0A0A0A] font-bold tracking-wider rounded-sm hover:bg-[#8B7355] transition-colors">
                CRIAR CONTA
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const totalChapters = chapters.filter(c => c.part).length;
  const completedChapters = stats.chaptersCompleted;
  const progressPercent = Math.round((completedChapters / totalChapters) * 100);
  const daysTrained = stats.totalDaysTrained;
  const timeHours = Math.round(daysTrained * 1.5);

  const badges = [
    { name: "PRIMEIRO PASSO", description: "Complete o primeiro capítulo", earned: completedChapters >= 1, icon: "🎯" },
    { name: "ESTUDANTE", description: "Complete 3 capítulos", earned: completedChapters >= 3, icon: "📚" },
    { name: "MOUNTAIN DOG", description: "Complete a Parte I", earned: completedChapters >= 6, icon: "🐕" },
    { name: "FORMADO", description: "Complete todo o livro", earned: completedChapters >= 11, icon: "🎓" },
  ];
  const earnedBadges = badges.filter(b => b.earned).length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-[#333] sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-sm z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#666] hover:text-white transition-colors font-medium tracking-wider text-sm">
            <ArrowLeft className="w-4 h-4" />
            INÍCIO
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#B8956A] flex items-center justify-center rounded-sm">
              <span className="text-[#0A0A0A] text-sm font-bold">JJ</span>
            </div>
            <span className="font-bold tracking-wider">PROGRESSO</span>
          </div>
          <button 
            onClick={logout}
            className="text-sm text-[#666] hover:text-white font-medium tracking-wider"
          >
            SAIR
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2 tracking-wider">SEU <span className="text-[#B8956A]">PAINEL</span></h1>
          <p className="text-[#555] tracking-wide font-medium">SEMANA {stats.currentWeek} · DIA {stats.currentDay}</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <DashboardStats title="CAPÍTULOS" value={`${completedChapters}/${totalChapters}`} icon={BookOpen} />
          <DashboardStats title="PROGRESSO" value={`${progressPercent}%`} icon={Target} accent />
          <DashboardStats title="BADGES" value={`${earnedBadges}/${badges.length}`} icon={Trophy} />
          <DashboardStats title="TREINO" value={`${daysTrained} dias`} icon={Dumbbell} />
        </div>

        <div className="mb-12 p-6 bg-[#111] rounded-xl border border-[#333]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold tracking-wider">SUA JORNADA</h2>
            <span className="text-[#B8956A] font-bold tracking-wider">{progressPercent}% COMPLETO</span>
          </div>
          <div className="h-3 bg-[#222] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#B8956A] to-[#8B7355] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-sm text-[#444] mt-3 tracking-wide">
            Volume semanal: {stats.weeklyVolume.toLocaleString()} kg
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-12">
          <Link href="/historico" className="p-4 bg-[#111] border border-[#333] rounded-lg hover:border-[#B8956A] transition-colors">
            <Dumbbell className="w-5 h-5 text-[#B8956A] mb-2" />
            <div className="font-bold tracking-wider">REGISTRAR TREINO</div>
            <div className="text-sm text-[#555]">Adicione seu treino de hoje</div>
          </Link>
          <Link href="/livro" className="p-4 bg-[#111] border border-[#333] rounded-lg hover:border-[#B8956A] transition-colors">
            <BookOpen className="w-5 h-5 text-[#B8956A] mb-2" />
            <div className="font-bold tracking-wider">CONTINUAR LENDO</div>
            <div className="text-sm text-[#555]">{totalChapters - completedChapters} capítulos restantes</div>
          </Link>
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 tracking-wider">
            <Trophy className="w-5 h-5 text-[#B8956A]" />
            CONQUISTAS
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {badges.map((badge, index) => (
              <div 
                key={index}
                className={`p-4 rounded-xl border ${
                  badge.earned 
                    ? "bg-[#B8956A]/10 border-[#B8956A]/30" 
                    : "bg-[#111] border-[#333] opacity-60"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{badge.icon}</div>
                  <div>
                    <h3 className="font-bold tracking-wider">{badge.name}</h3>
                    <p className="text-sm text-[#555]">{badge.description}</p>
                  </div>
                </div>
                {badge.earned && (
                  <div className="mt-3 text-xs text-green-500 flex items-center gap-1 tracking-wider">
                    ✓ CONQUISTADO
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 tracking-wider">
            <BookOpen className="w-5 h-5 text-[#B8956A]" />
            CAPÍTULOS
          </h2>
          <div className="space-y-3">
            {chapters.filter(c => c.part).map((chapter) => {
              const chapterProgress = progress?.chapters.find(c => c.slug === chapter.slug);
              const isCompleted = chapterProgress?.completed || false;
              return (
                <div 
                  key={chapter.slug}
                  className={`p-4 border flex items-center gap-4 rounded-sm ${
                    isCompleted ? 'bg-[#B8956A]/10 border-[#B8956A]/30' : 'bg-[#111] border-[#333]'
                  }`}
                >
                  <div className={`w-10 h-10 flex items-center justify-center rounded-sm ${
                    isCompleted ? 'bg-[#B8956A] text-[#0A0A0A]' : 'bg-[#222]'
                  }`}>
                    {isCompleted ? <Trophy className="w-5 h-5" /> : <Lock className="w-5 h-5 text-[#444]" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold tracking-wider text-sm">{chapter.title}</h3>
                    <p className="text-xs text-[#444]">{chapter.description}</p>
                  </div>
                  <Link 
                    href={`/livro/${chapter.slug}`}
                    className="px-4 py-2 text-sm bg-[#222] hover:bg-[#B8956A] hover:text-[#0A0A0A] rounded-sm transition-colors font-medium tracking-wider"
                  >
                    {isCompleted ? 'REVER' : 'LER'}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}