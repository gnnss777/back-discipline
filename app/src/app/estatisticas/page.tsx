'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Trophy, BarChart2, Activity } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { loadPlanilha } from '@/utils/planilhaStorage';
import { calculateAllStats, type AllExercisesStats } from '@/lib/exerciseStats';
import { ExerciseStatsCard } from '@/components/ExerciseStatsCard';

export default function EstatisticasPage() {
 const { user, isLoading: authLoading } = useAuth();
 const [stats, setStats] = useState<AllExercisesStats | null>(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  if (authLoading) return;
  
  if (!user) {
   setLoading(false);
   return;
  }

  const planilha = loadPlanilha(user.userId);
  if (planilha) {
   const exerciseStats = calculateAllStats(planilha);
   setStats(exerciseStats);
  }
  setLoading(false);
 }, [user, authLoading]);

 const formatVolume = (volume: number): string => {
  if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
  if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
  return volume.toString();
 };

 if (authLoading || loading) {
  return (
   <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-primary">Carregando...</div>
   </div>
  );
 }

 return (
  <div className="min-h-screen bg-background text-white pb-24">
   <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
    <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
     <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
      <ArrowRight className="w-4 h-4 rotate-180" /> Voltar
     </Link>
     <div className="flex items-center gap-2">
      <BarChart2 className="w-4 h-4 text-primary" />
      <span className="text-sm font-bold tracking-[0.15em] text-primary">ESTATÍSTICAS</span>
     </div>
     <Link href="/planilha" className="text-sm text-muted hover:text-white">
      Planilha
     </Link>
    </div>
   </header>

   <main className="max-w-6xl mx-auto px-4 py-6">
    {!user ? (
     <div className="mb-6 p-5 rounded border border-secondary bg-surface text-center">
      <p className="mb-3 text-muted">Faça login para ver suas estatísticas.</p>
      <Link href="/login" className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-black rounded font-bold tracking-wider text-sm">
       Entrar
      </Link>
     </div>
    ) : stats ? (
     <>
      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
       <div className="p-4 bg-card border border-border rounded-lg">
        <Trophy className="w-6 h-6 text-primary mb-2" />
        <div className="text-2xl font-bold">{stats.totalPRs}</div>
        <div className="text-sm text-muted tracking-wider">PRs</div>
       </div>
       <div className="p-4 bg-card border border-border rounded-lg">
        <Activity className="w-6 h-6 text-primary mb-2" />
        <div className="text-2xl font-bold">{formatVolume(stats.totalVolume)}</div>
        <div className="text-sm text-muted tracking-wider">Volume Total</div>
       </div>
       <div className="p-4 bg-card border border-border rounded-lg">
        <BarChart2 className="w-6 h-6 text-primary mb-2" />
        <div className="text-2xl font-bold">{stats.exercises.length}</div>
        <div className="text-sm text-muted tracking-wider">Exercícios</div>
       </div>
      </div>

      {/* Section Title */}
      <div className="flex items-center justify-between mb-4">
       <h2 className="text-lg font-bold tracking-wider">DESEMPENHO POR EXERCÍCIO</h2>
       <span className="text-xs text-muted">Ordenado por PR</span>
      </div>

      {/* Exercise List */}
      {stats.exercises.length > 0 ? (
       <div className="space-y-3">
        {stats.exercises.map((exercise) => (
         <ExerciseStatsCard key={exercise.exerciseName} stats={exercise} />
        ))}
       </div>
      ) : (
       <div className="p-8 text-center text-muted">
        <p>Nenhum exercício registrado ainda.</p>
        <p className="text-sm mt-2">Comece a treinar para ver suas estatísticas!</p>
       </div>
      )}
     </>
    ) : (
     <div className="p-8 text-center text-muted">
      <p>Carregue sua planilha para ver estatísticas.</p>
     </div>
    )}
   </main>

  </div>
 );
}