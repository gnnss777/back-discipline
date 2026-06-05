'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle, Lock } from 'lucide-react';
import { chapters, chapterGroups, getGroupCompletedCount } from '@/lib/chapters';
import { AuthModal } from '../../components/AuthModal';
import { useAuth } from '../../hooks/useAuth';
import { getAllProgress } from '../../lib/reading-storage';
import type { ReadingProgressRecord } from '../../lib/reading-storage';

export default function LivroPage() {
 const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
const [progressData, setProgressData] = useState<ReadingProgressRecord[]>([]);
const { user, isLoading } = useAuth();
 const router = useRouter();

 useEffect(() => {
  if (!isLoading && !user) {
   setIsAuthModalOpen(true);
  }
 }, [user, isLoading]);

useEffect(() => {
 if (!isLoading && user) {
  const userId = user.userId;
  getAllProgress(userId).then(data => {
   setProgressData(data);
  });
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

const part1Groups = chapterGroups.filter(g => g.part === 'I').sort((a, b) => a.order - b.order);
const part2Groups = chapterGroups.filter(g => g.part === 'II').sort((a, b) => a.order - b.order);
const standaloneChapters = chapters.filter(c => c.part);

const allTrackableSlugs = standaloneChapters.map(c => c.slug);
const totalSlugs = allTrackableSlugs.length;
const completedCount = progressData.filter(p => p.completed && allTrackableSlugs.includes(p.chapter_slug)).length;
const progressPercent = totalSlugs > 0 ? Math.round((completedCount / totalSlugs) * 100) : 0;

// Last-read chapter for auto-resume
const lastReadChapter = progressData
 .filter(p => p.last_read_at)
 .sort((a, b) => new Date(b.last_read_at).getTime() - new Date(a.last_read_at).getTime())[0]?.chapter_slug || null;

 if (isLoading) {
  return (
   <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-primary">Carregando...</div>
   </div>
  );
 }

 return (
  <div className="min-h-screen bg-background text-foreground pb-24">
   <AuthModal 
    isOpen={isAuthModalOpen} 
    onClose={() => setIsAuthModalOpen(false)}
    initialMode={authModalMode}
   />

   <header className="border-b border-secondary sticky top-0 bg-background/95 backdrop-blur-sm z-50">
    <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
     <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium tracking-wider text-sm">
      <ArrowLeft className="w-4 h-4" />
      VOLTAR
     </Link>
     <div className="flex items-center gap-2">
       <span className="text-sm font-medium tracking-[0.2em] text-muted-foreground">JOÃO MONTEIRO</span>
      <span className="text-sm font-bold tracking-[0.15em] text-primary">BACK DISCIPLINE</span>
     </div>
     {!user && (
      <button onClick={openLogin} className="text-sm text-primary hover:text-primary-dark font-medium tracking-wider">
       ENTRAR
      </button>
     )}
    </div>
   </header>

   <main className="max-w-6xl mx-auto px-6 py-12">
    <div className="text-center mb-12">
     <h1 className="text-4xl font-medium mb-4 tracking-wider">PROGRAMA <span className="text-primary">6 SEMANAS</span></h1>
     <p className="text-muted-foreground font-light tracking-wide">DE TREINAMENTO DE COSTAS</p>
    </div>

    {!user && (
     <div className="mb-8 p-4 bg-primary/10 border border-primary/30 rounded text-center">
      <p className="text-primary mb-2">Faça login para acompanhar seu progresso</p>
      <div className="flex gap-4 justify-center">
       <button onClick={openLogin} className="px-4 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-background transition-colors font-medium tracking-wider text-sm">
        ENTRAR
       </button>
       <button onClick={openRegister} className="px-4 py-2 bg-primary text-background rounded hover:bg-primary-dark transition-colors font-medium tracking-wider text-sm">
        CADASTRAR
       </button>
      </div>
     </div>
    )}

    {user && (
     <div className="mb-12 p-4 bg-surface rounded border border-secondary">
      <div className="flex items-center justify-between text-sm mb-2">
       <span className="text-muted-foreground font-medium tracking-wider">SEU PROGRESSO</span>
       <span className="text-primary font-bold tracking-wider">{completedCount} / {totalSlugs} CAPÍTULOS</span>
      </div>
      <div className="h-1 bg-card rounded-full overflow-hidden">
       <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progressPercent}%` }} />
      </div>
     </div>
    )}

    {/* Parte I */}
    <section className="mb-12">
     <div className="flex items-center gap-3 mb-6">
      <span className="px-3 py-1 bg-primary/20 text-primary text-sm font-bold tracking-wider rounded">PARTE I</span>
      <h2 className="text-xl font-medium tracking-wider">SISTEMA E PRÁTICA</h2>
     </div>

     <div className="space-y-6">
      {part1Groups.map((group) => {
       const groupCompleted = getGroupCompletedCount(group, progressData);
       const totalInGroup = group.children.length;
       const isFullyComplete = groupCompleted === totalInGroup;
       const lastReadSlug = lastReadChapter && group.children.includes(lastReadChapter) ? lastReadChapter : null;

       return (
        <div key={group.id} className="border border-secondary rounded overflow-hidden">
         {/* Group header */}
         <div className={`px-5 py-4 ${isFullyComplete ? 'bg-primary/10' : 'bg-surface'} border-b border-secondary`}>
          <div className="flex items-center justify-between">
           <div>
            <h3 className="font-bold tracking-wider text-sm">{group.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{group.description}</p>
           </div>
           {user && (
            <div className="text-right">
             <span className={`text-sm font-bold tracking-wider ${isFullyComplete ? 'text-primary' : 'text-muted-foreground'}`}>
              {groupCompleted}/{totalInGroup}
             </span>
            </div>
           )}
          </div>
          {user && (
           <div className="mt-2 h-0.5 bg-card rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${Math.round((groupCompleted / totalInGroup) * 100)}%` }} />
           </div>
          )}
         </div>

         {/* Children */}
         <div className="divide-y divide-secondary/50">
          {group.children.map((childSlug) => {
           const child = chapters.find(c => c.slug === childSlug);
           if (!child) return null;
           const isCompleted = progressData.some(p => p.chapter_slug === childSlug && p.completed);
           const isLastRead = lastReadSlug === childSlug;

           return (
            <Link
             key={childSlug}
             href={user ? `/livro/${childSlug}` : '#'}
             onClick={(e) => { if (!user) { e.preventDefault(); openLogin(); } }}
             className={`block px-5 py-3 transition-all group ${
              isLastRead
              ? 'bg-surface border-l-2 border-l-primary'
              : isCompleted
              ? 'bg-surface'
              : user
              ? 'bg-background hover:bg-surface'
              : 'bg-background cursor-pointer'
             }`}
            >
             <div className="flex items-center gap-3">
              <div className={`w-8 h-8 flex items-center justify-center rounded text-sm ${
               isCompleted
               ? 'bg-primary/20 text-primary'
               : user
               ? 'bg-card text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors'
               : 'bg-card text-border'
              }`}>
               {isCompleted ? <CheckCircle className="w-4 h-4" /> : user ? <ArrowRight className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              </div>
              <div className="flex-1">
               <span className={`text-sm font-medium tracking-wider ${user ? 'group-hover:text-primary' : ''} transition-colors`}>
                {child.title}
               </span>
               {isLastRead && (
                <span className="ml-2 text-xs text-primary font-medium">CONTINUAR</span>
               )}
              </div>
              {!user && <Lock className="w-3 h-3 text-border" />}
             </div>
            </Link>
           );
          })}
         </div>
        </div>
       );
      })}
     </div>
    </section>

    {/* Parte II */}
    <section>
     <div className="flex items-center gap-3 mb-6">
      <span className="px-3 py-1 bg-primary/20 text-primary text-sm font-bold tracking-wider rounded">PARTE II</span>
      <h2 className="text-xl font-medium tracking-wider">FUNDAMENTOS TÉCNICOS</h2>
     </div>

     <div className="space-y-6">
      {part2Groups.map((group) => {
       const groupCompleted = getGroupCompletedCount(group, progressData);
       const totalInGroup = group.children.length;
       const isFullyComplete = groupCompleted === totalInGroup;
       const lastReadSlug = lastReadChapter && group.children.includes(lastReadChapter) ? lastReadChapter : null;

       return (
        <div key={group.id} className="border border-secondary rounded overflow-hidden">
         {/* Group header */}
         <div className={`px-5 py-4 ${isFullyComplete ? 'bg-primary/10' : 'bg-surface'} border-b border-secondary`}>
          <div className="flex items-center justify-between">
           <div>
            <h3 className="font-bold tracking-wider text-sm">{group.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{group.description}</p>
           </div>
           {user && (
            <div className="text-right">
             <span className={`text-sm font-bold tracking-wider ${isFullyComplete ? 'text-primary' : 'text-muted-foreground'}`}>
              {groupCompleted}/{totalInGroup}
             </span>
            </div>
           )}
          </div>
          {user && (
           <div className="mt-2 h-0.5 bg-card rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${Math.round((groupCompleted / totalInGroup) * 100)}%` }} />
           </div>
          )}
         </div>

         {/* Children */}
         <div className="divide-y divide-secondary/50">
          {group.children.map((childSlug) => {
           const child = chapters.find(c => c.slug === childSlug);
           if (!child) return null;
           const isCompleted = progressData.some(p => p.chapter_slug === childSlug && p.completed);
           const isLastRead = lastReadSlug === childSlug;

           return (
            <Link
             key={childSlug}
             href={user ? `/livro/${childSlug}` : '#'}
             onClick={(e) => { if (!user) { e.preventDefault(); openLogin(); } }}
             className={`block px-5 py-3 transition-all group ${
              isLastRead
              ? 'bg-surface border-l-2 border-l-primary'
              : isCompleted
              ? 'bg-surface'
              : user
              ? 'bg-background hover:bg-surface'
              : 'bg-background cursor-pointer'
             }`}
            >
             <div className="flex items-center gap-3">
              <div className={`w-8 h-8 flex items-center justify-center rounded text-sm ${
               isCompleted
               ? 'bg-primary/20 text-primary'
               : user
               ? 'bg-card text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors'
               : 'bg-card text-border'
              }`}>
               {isCompleted ? <CheckCircle className="w-4 h-4" /> : user ? <ArrowRight className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              </div>
              <div className="flex-1">
               <span className={`text-sm font-medium tracking-wider ${user ? 'group-hover:text-primary' : ''} transition-colors`}>
                {child.title}
               </span>
               {isLastRead && (
                <span className="ml-2 text-xs text-primary font-medium">CONTINUAR</span>
               )}
              </div>
              {!user && <Lock className="w-3 h-3 text-border" />}
             </div>
            </Link>
           );
          })}
         </div>
        </div>
       );
      })}
     </div>
    </section>

    {!user && (
     <div className="mt-12 p-6 bg-surface rounded-xl border border-secondary text-center">
      <p className="text-muted-foreground mb-4 font-light tracking-wide">FAÇA LOGIN PARA ACOMPANHAR SEU PROGRESSO</p>
      <button onClick={openRegister} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-background font-bold tracking-wider rounded hover:bg-primary-dark transition-colors">
       CADASTRAR PARA ACESSAR
      </button>
     </div>
    )}
   </main>
  </div>
 );
}
