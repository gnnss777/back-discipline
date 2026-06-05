'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BookOpen, Trophy, Target, Dumbbell, ClipboardList, Search, Timer, ArrowLeft, AlertTriangle, ChevronRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useProgress } from '../../context/ProgressContext';
import { getProgramInfo } from '@/utils/programTracker';
import { chapters } from '@/lib/chapters';
import { exercises } from '../../data/exercises';
import { UserAvatar } from '../../components/UserAvatar';

export default function DashboardPage() {
 const { user, isLoading: authLoading } = useAuth();
 const { stats, isLoading: progressLoading } = useProgress();
 const [isClient, setIsClient] = useState(false);

 useEffect(() => {
  setIsClient(true);
 }, []);

 if (!isClient || authLoading || progressLoading) {
  return (
   <div className="min-h-screen bg-background flex flex-col items-center justify-center">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
   </div>
  );
 }

 if (!user) {
  return (
   <div className="min-h-screen bg-background text-white">
    <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
     <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-medium tracking-wider text-sm">
       <ArrowLeft className="w-4 h-4" />
       INÍCIO
      </Link>
      <div className="flex items-center gap-2">
       <div className="w-8 h-8 bg-primary flex items-center justify-center rounded">
        <span className="text-background text-sm font-bold">JM</span>
       </div>
       <span className="font-bold tracking-wider">PROGRESSO</span>
      </div>
      <div className="w-16" />
     </div>
    </header>
    <main className="max-w-6xl mx-auto px-6 py-12">
     <div className="mt-12 p-6 bg-card rounded-xl border border-border text-center">
      <h3 className="text-lg font-bold mb-2 tracking-wider">FAÇA LOGIN PARA ACOMPANHAR SEU PROGRESSO</h3>
      <p className="text-gray-500 mb-4 tracking-wide">Crie uma conta para acompanhar seu progresso e treinar.</p>
      <div className="flex gap-4 justify-center">
       <Link href="/login" className="px-6 py-2 border border-border text-muted rounded hover:border-primary hover:text-primary transition-colors font-bold tracking-wider">
        ENTRAR
       </Link>
       <Link href="/register" className="px-6 py-2 bg-primary text-background font-bold tracking-wider rounded hover:bg-primary-dark transition-colors">
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

 return (
  <div className="min-h-screen bg-background text-white">
   <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
    <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
     <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-primary flex items-center justify-center rounded">
       <span className="text-background text-sm font-bold">JJ</span>
      </div>
      <span className="font-bold tracking-wider">PAINEL</span>
     </div>
     <UserAvatar name={user.name} email={user.email} />
    </div>
   </header>

   <main className="max-w-6xl mx-auto px-6 py-12 pb-24">
    <div className="text-center mb-10">
     <h1 className="text-3xl font-bold mb-2 tracking-wider">SEU <span className="text-primary">PAINEL</span></h1>
     <p className="text-gray-500 tracking-wide font-medium">SEMANA {stats.currentWeek} · DIA {stats.currentDay}</p>
    </div>

    <div className="grid grid-cols-3 gap-4 mb-8">
     <div className="p-4 bg-card border border-border rounded-lg text-center">
      <BookOpen className="w-5 h-5 text-primary mx-auto mb-2" />
      <div className="text-2xl font-bold tracking-wider">{completedChapters}/{totalChapters}</div>
      <div className="text-xs text-gray-500 tracking-wider mt-1">CAPÍTULOS</div>
     </div>
     <div className="p-4 bg-card border border-primary/30 rounded-lg text-center">
      <Target className="w-5 h-5 text-primary mx-auto mb-2" />
      <div className="text-2xl font-bold tracking-wider">{progressPercent}%</div>
      <div className="text-xs text-gray-500 tracking-wider mt-1">PROGRESSO</div>
     </div>
     <div className="p-4 bg-card border border-border rounded-lg text-center">
      <Dumbbell className="w-5 h-5 text-primary mx-auto mb-2" />
      <div className="text-2xl font-bold tracking-wider">{daysTrained}</div>
      <div className="text-xs text-gray-500 tracking-wider mt-1">TREINOS</div>
     </div>
    </div>

    <div className="mb-12 p-6 bg-card rounded-xl border border-border">
     <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold tracking-wider">SUA JORNADA</h2>
      <span className="text-primary font-bold tracking-wider">{progressPercent}%</span>
     </div>
     <div className="h-3 bg-card rounded-full overflow-hidden">
      <div
       className="h-full bg-gradient-to-r from-primary to-primary-dark rounded-full transition-all duration-500"
       style={{ width: `${progressPercent}%` }}
      />
     </div>
    </div>

    {/* Alerts */}
    {(() => {
     const progInfo = getProgramInfo(user.userId);
     const alerts = progInfo?.alerts.filter(a => a.type !== 'program_not_started' && a.type !== 'week_complete') || [];
     if (alerts.length === 0) return null;
     return (
      <div className="mb-8 space-y-2">
       {alerts.map((alert, i) => {
        const classes = `flex items-start gap-3 p-3 rounded border text-sm ${
         alert.severity === 'warning'
          ? 'border-yellow-900/30 bg-yellow-900/10 text-yellow-400'
          : 'border-red-900/30 bg-red-900/10 text-red-400'
        }${alert.action ? ' cursor-pointer hover:opacity-80 transition-opacity' : ''}`;
        const inner = (
         <>
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <span className="flex-1">{alert.message}</span>
          {alert.action && <ChevronRight className="w-4 h-4 shrink-0 self-center" />}
         </>
        );
        return alert.action ? (
         <Link key={i} href={alert.action.href} className={classes}>
          {inner}
         </Link>
        ) : (
         <div key={i} className={classes}>{inner}</div>
        );
       })}
      </div>
     );
    })()}

    <div className="grid grid-cols-2 gap-4">
     <Link href="/livro" className="p-6 bg-card border border-border rounded-lg hover:border-primary transition-colors text-center">
      <BookOpen className="w-8 h-8 text-primary mx-auto mb-3" />
      <div className="font-bold tracking-wider">LIVRO</div>
      <div className="text-sm text-gray-500 mt-1">{totalChapters - completedChapters} capítulos restantes</div>
     </Link>
     <Link href="/planilha" className="p-6 bg-card border border-border rounded-lg hover:border-primary transition-colors text-center">
      <ClipboardList className="w-8 h-8 text-primary mx-auto mb-3" />
      <div className="font-bold tracking-wider">PLANILHA</div>
      <div className="text-sm text-gray-500 mt-1">6 semanas de treino</div>
     </Link>
     <Link href="/timer" className="p-6 bg-card border border-border rounded-lg hover:border-primary transition-colors text-center">
      <Timer className="w-8 h-8 text-primary mx-auto mb-3" />
      <div className="font-bold tracking-wider">CRONÔMETRO</div>
      <div className="text-sm text-gray-500 mt-1">Descanso entre séries</div>
     </Link>
     <Link href="/biblioteca" className="p-6 bg-card border border-border rounded-lg hover:border-primary transition-colors text-center">
      <Search className="w-8 h-8 text-primary mx-auto mb-3" />
      <div className="font-bold tracking-wider">BIBLIOTECA</div>
      <div className="text-sm text-gray-500 mt-1">{exercises.length} exercícios</div>
     </Link>
    </div>
   </main>
  </div>
 );
}
