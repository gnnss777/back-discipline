'use client';

import { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Search, Filter, Play, Lock, ClipboardList, ExternalLink, ChevronRight } from 'lucide-react';
import { exercises, categories } from '../../data/exercises';
import type { Exercise } from '../../types/exercise';
import { VideoModal } from '../../components/VideoModal';
import { AuthModal } from '../../components/AuthModal';
import { useAuth } from '../../hooks/useAuth';

function BibliotecaContent() {
 const searchParams = useSearchParams();
 const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
 const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
 const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
 const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
 const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
 const { user, isLoading } = useAuth();

 const openLogin = () => {
  setAuthModalMode('login');
  setIsAuthModalOpen(true);
 };

 const openRegister = () => {
  setAuthModalMode('register');
  setIsAuthModalOpen(true);
 };

 const filteredExercises = useMemo(() => {
  return exercises.filter(ex => {
   const q = searchQuery.toLowerCase();
   const n = ex.name.toLowerCase();
   const matchesSearch = searchQuery === '' || 
    n.includes(q) ||
    q.includes(n) ||
    ex.muscles.some(m => m.toLowerCase().includes(q));
   
   const matchesCategory = selectedCategory === 'Todas' || ex.category === selectedCategory;
   
   return matchesSearch && matchesCategory;
  });
 }, [searchQuery, selectedCategory]);

 if (isLoading) {
  return (
   <div className="min-h-screen bg-background flex flex-col items-center justify-center">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
   </div>
  );
 }

 return (
  <div className="min-h-screen bg-background text-white pb-24">
   <AuthModal 
    isOpen={isAuthModalOpen} 
    onClose={() => setIsAuthModalOpen(false)}
    initialMode={authModalMode}
   />

   <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
    <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
     <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-medium tracking-wider text-sm">
      <ArrowLeft className="w-4 h-4" />
      VOLTAR
     </Link>
     <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-primary flex items-center justify-center rounded">
        <span className="text-background text-sm font-bold">JM</span>
      </div>
      <span className="font-bold tracking-wider">BIBLIOTECA</span>
     </div>
     {user ? (
      <Link href="/dashboard" className="text-sm text-gray-500 hover:text-white font-medium tracking-wider">
       PAINEL
      </Link>
     ) : (
      <button onClick={openLogin} className="text-sm text-primary hover:text-white font-medium tracking-wider">
       ENTRAR
      </button>
     )}
    </div>
   </header>

   <main className="max-w-6xl mx-auto px-6 py-12">
    <div className="text-center mb-10">
     <h1 className="text-3xl font-bold mb-2 tracking-wider">BIBLIOTECA <span className="text-primary">TÉCNICA</span></h1>
     <p className="text-gray-500 tracking-wide font-medium">GUIA COMPLETO DE EXERCÍCIOS</p>
    </div>

    {!user && (
     <div className="mb-8 p-6 bg-card border border-border rounded-lg text-center">
      <p className="text-primary mb-4">Faça login para acessar vídeos dos exercícios</p>
      <div className="flex gap-4 justify-center">
       <button onClick={openLogin} className="px-6 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-background transition-colors font-bold tracking-wider">
        ENTRAR
       </button>
       <button onClick={openRegister} className="px-6 py-2 bg-primary text-background rounded hover:bg-primary-dark transition-colors font-bold tracking-wider">
        CADASTRAR
       </button>
      </div>
     </div>
    )}

    <div className="flex flex-col md:flex-row gap-4 mb-8">
     <div className="relative flex-1">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
      <input 
       type="text" 
       placeholder="BUSCAR EXERCÍCIO..." 
       value={searchQuery}
       onChange={(e) => setSearchQuery(e.target.value)}
       className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded text-white placeholder:text-gray-500 focus:outline-none focus:border-primary font-medium tracking-wider"
      />
     </div>
     <div className="flex items-center gap-2">
      <Filter className="w-5 h-5 text-gray-500" />
      <select 
       value={selectedCategory}
       onChange={(e) => setSelectedCategory(e.target.value)}
       className="px-4 py-3 bg-card border border-border rounded text-white focus:outline-none focus:border-primary font-medium tracking-wider"
      >
       {categories.map(cat => (
        <option key={cat} value={cat}>{cat.toUpperCase()}</option>
       ))}
      </select>
     </div>
    </div>

    <div className="mb-4 text-sm text-gray-500">
     {filteredExercises.length} exercício{filteredExercises.length !== 1 ? 's' : ''} encontrado{filteredExercises.length !== 1 ? 's' : ''}
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
     {filteredExercises.map(exercise => (
      <Link
       key={exercise.id}
       href={`/biblioteca/${exercise.id}`}
       className="block p-6 bg-card border border-border rounded hover:border-primary hover:bg-card transition-all group relative"
      >
       {exercise.videoUrl && user && (
        <button
         onClick={(e) => { e.preventDefault(); setSelectedExercise(exercise); }}
         className="absolute top-4 right-4 w-10 h-10 bg-primary/80 hover:bg-primary rounded-full flex items-center justify-center transition-colors z-10"
        >
         <Play className="w-5 h-5 text-background fill-background" />
        </button>
       )}

       {!user && (
        <div className="absolute top-4 right-4">
         <Lock className="w-4 h-4 text-border" />
        </div>
       )}

       <div className="flex items-start justify-between mb-4">
        <div>
         <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-bold tracking-wider rounded">
          {exercise.category.toUpperCase()}
         </span>
         <h3 className="text-lg font-bold mt-2 group-hover:text-primary transition-colors tracking-wider">
          {exercise.name}
         </h3>
        </div>
        <span className={`px-2 py-1 text-xs font-bold tracking-wider rounded ${
         exercise.difficulty === 'Iniciante' ? 'bg-green-900/50 text-green-500' :
         exercise.difficulty === 'Intermediário' ? 'bg-yellow-900/50 text-yellow-500' :
         'bg-red-900/50 text-red-500'
        }`}>
         {exercise.difficulty.toUpperCase()}
        </span>
       </div>
       
       <p className="text-sm text-gray-500 mb-4">{exercise.description}</p>
       
       <div className="flex flex-wrap gap-2">
        {exercise.muscles.map(muscle => (
         <span key={muscle} className="text-xs text-muted bg-card px-2 py-1 rounded tracking-wider">
          {muscle.toUpperCase()}
         </span>
        ))}
       </div>

       <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        {user ? (
         <Link
          href="/planilha"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-2 text-xs text-gray-500 hover:text-primary transition-colors tracking-wider"
         >
          <ClipboardList className="w-3.5 h-3.5" />
          VER NA PLANILHA
         </Link>
        ) : <div />}
        <span className="flex items-center gap-1 text-xs text-muted group-hover:text-primary transition-colors">
         VER MAIS <ChevronRight className="w-3 h-3" />
        </span>
       </div>

       {exercise.tips && exercise.tips.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
         <div className="text-xs text-gray-500 mb-2">DICAS:</div>
         <ul className="text-xs text-muted space-y-1">
          {exercise.tips.slice(0, 2).map((tip, i) => (
           <li key={i}>• {tip}</li>
          ))}
         </ul>
        </div>
       )}
      </Link>
     ))}
    </div>

    {filteredExercises.length === 0 && (
     <div className="text-center py-12">
      <p className="text-gray-500">Nenhum exercício encontrado.</p>
      <button
       onClick={() => { setSearchQuery(''); setSelectedCategory('Todas'); }}
       className="mt-4 text-primary hover:underline"
      >
       Limpar filtros
      </button>
     </div>
    )}
   </main>

   <VideoModal
    isOpen={selectedExercise !== null}
    onClose={() => setSelectedExercise(null)}
    videoUrl={selectedExercise?.videoUrl || ''}
    title={selectedExercise?.name || ''}
   />
  </div>
 );
}

export default function BibliotecaPage() {
 return (
  <Suspense fallback={
   <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
   </div>
  }>
   <BibliotecaContent />
  </Suspense>
 );
}