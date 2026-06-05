'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Dumbbell, Trophy, ArrowRight, Flame, GraduationCap, Lock, Target, BarChart3, Brain, ClipboardList, ChevronDown, HelpCircle } from 'lucide-react';
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
   <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-primary">Carregando...</div>
   </div>
  );
 }

 return (
  <div className="min-h-screen bg-background text-foreground">
   <AuthModal 
    isOpen={isAuthModalOpen} 
    onClose={() => setIsAuthModalOpen(false)}
    initialMode={authModalMode}
   />

   {/* Header */}
   <header className="border-b border-secondary">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
     <div className="flex items-center gap-2 sm:gap-3 min-w-0">
      <span className="hidden sm:inline text-xl lg:text-2xl font-medium tracking-[0.3em]">JOÃO</span>
      <span className="hidden sm:inline text-xl lg:text-2xl font-light tracking-[0.2em] text-muted-foreground">MONTEIRO</span>
      <span className="sm:hidden w-8 h-8 bg-primary flex items-center justify-center rounded shrink-0">
       <span className="text-background text-xs font-bold">JM</span>
      </span>
      <span className="text-sm sm:text-base lg:text-lg font-bold tracking-[0.15em] text-primary truncate">BACK DISCIPLINE</span>
     </div>
     <div className="flex items-center gap-2 sm:gap-4 shrink-0">
      <button 
       onClick={openLogin}
       className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
      >
       Entrar
      </button>
      <button 
       onClick={openRegister}
       className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-background text-xs sm:text-sm font-bold tracking-wider rounded hover:bg-primary-dark transition-colors whitespace-nowrap"
      >
       Cadastrar
      </button>
     </div>
    </div>
   </header>

   {/* Hero */}
   <main>
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
     <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background z-0" />
     
     <div className="relative z-10 text-center max-w-6xl mx-auto px-6 py-20">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded bg-primary/20 text-primary text-sm font-bold tracking-wider mb-8">
       <Flame className="w-4 h-4" />
       DISCIPLINA NÃO É MOTIVAÇÃO. É MÉTODO.
      </div>
      
       <h1 className="font-display text-3xl sm:text-5xl md:text-7xl font-bold mb-6 tracking-tight sm:tracking-wide leading-tight">
        CONSTRUA AS COSTAS
        <br />
        <span className="text-primary text-glow">QUE VOCÊ MERECE</span>
       </h1>
      
       <p className="text-base sm:text-lg text-muted-foreground/80 mb-4 max-w-xl mx-auto font-medium tracking-wide">
        VOCÊ TREINA. VOCÊ TENTA. E AS COSTAS NUNCA APARECEM.
       </p>
       <p className="text-base sm:text-xl text-muted-foreground mb-4 max-w-2xl mx-auto font-light tracking-wide">
        6 semanas de treinamento estruturado por João Monteiro, com base acadêmica em Educação Física e Nutrição e anos de experiência prática.
       </p>
       <p className="text-sm text-muted-foreground mb-10 font-light tracking-wide">
        Cada série, cada técnica e cada nível de esforço com propósito definido por quem estuda e aplica.
       </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
         onClick={openRegister}
         className="btn-glow inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-background font-bold tracking-wider rounded hover:bg-primary-dark transition-colors"
        >
         COMEÇAR AGORA
         <ArrowRight className="w-5 h-5" />
        </button>
       <button 
        onClick={openLogin}
        className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-secondary text-foreground font-bold tracking-wider rounded hover:border-primary hover:text-primary transition-colors"
       >
        ENTRAR
       </button>
      </div>
     </div>
    </section>

    {/* Stats Section */}
    <section className="py-16 border-y border-secondary bg-surface">
     <div className="max-w-6xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
      <div>
       <div className="text-4xl font-medium text-primary tracking-wider">6</div>
       <div className="text-sm text-muted-foreground mt-2 tracking-wider">SEMANAS</div>
      </div>
      <div>
       <div className="text-4xl font-medium text-primary tracking-wider">11</div>
       <div className="text-sm text-muted-foreground mt-2 tracking-wider">CAPÍTULOS</div>
      </div>
      <div>
       <div className="text-4xl font-medium text-primary tracking-wider">16+</div>
       <div className="text-sm text-muted-foreground mt-2 tracking-wider">EXERCÍCIOS</div>
      </div>
     </div>
    </section>

    {/* Antes de Começar */}
    <section className="py-16 border-y border-secondary">
     <div className="max-w-6xl mx-auto px-6 text-center">
      <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4 tracking-wider">ANTES DE COMEÇAR,<br />SEJA HONESTO.</h2>
      <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
       Selecione os problemas com os quais você se identifica.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
       {[
        'Treino costas há meses e não vejo desenvolvimento',
        'Fico preso nos mesmos 3 exercícios sempre',
        'Não sei se estou com a intensidade certa',
        'Meu progresso parou e não sei como ajustar',
        'Nunca tive um programa específico de costas',
        'Já tentei vários treinos e nenhum funcionou',
       ].map((pain, i) => (
        <div key={i} className="flex items-start gap-3 p-5 bg-surface border border-border rounded-lg text-left">
         <Target className="w-5 h-5 text-primary shrink-0 mt-0.5" />
         <span className="text-sm font-medium text-muted-foreground">{pain}</span>
        </div>
       ))}
      </div>
      <p className="text-primary font-bold tracking-wider mt-8">
        MARCOU 2 OU MAIS? ESTE PROGRAMA É PARA VOCÊ.
      </p>
     </div>
    </section>

    {/* Não é Força de Vontade. É Método. */}
    <section className="py-16">
     <div className="max-w-6xl mx-auto px-6 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded bg-primary/20 text-primary text-sm font-bold tracking-wider mb-6">
       <Flame className="w-4 h-4" />
       NÃO É FORÇA DE VONTADE. É MÉTODO.
      </div>
      <p className="text-muted-foreground mb-12 max-w-xl mx-auto font-light tracking-wide">
       Enquanto você depende de motivação, este programa depende de estratégia.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
       <div className="p-6 bg-surface border border-border rounded-lg text-left">
        <div className="w-12 h-12 bg-primary/20 flex items-center justify-center rounded-lg mb-4">
         <Brain className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-display font-bold text-lg mb-2 tracking-wider">FUNDAMENTAÇÃO</h3>
        <p className="text-sm text-muted-foreground font-light leading-relaxed">
         Cada capítulo explica o <span className="text-primary font-medium">porquê</span> de cada técnica, não só o como. Base acadêmica aplicada ao treino real.
        </p>
       </div>
       <div className="p-6 bg-surface border border-border rounded-lg text-left">
        <div className="w-12 h-12 bg-primary/20 flex items-center justify-center rounded-lg mb-4">
         <Dumbbell className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-display font-bold text-lg mb-2 tracking-wider">ESTRUTURA</h3>
        <p className="text-sm text-muted-foreground font-light leading-relaxed">
         6 semanas progressivas com RPE, séries, cargas e descanso definidos. Treino genérico é para quem não tem método.
        </p>
       </div>
       <div className="p-6 bg-surface border border-border rounded-lg text-left">
        <div className="w-12 h-12 bg-primary/20 flex items-center justify-center rounded-lg mb-4">
         <BarChart3 className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-display font-bold text-lg mb-2 tracking-wider">DADOS</h3>
        <p className="text-sm text-muted-foreground font-light leading-relaxed">
         Métricas de progresso, volume, peso e frequência para ajustes reais. O que não é medido não pode ser melhorado.
        </p>
       </div>
      </div>
      <button 
       onClick={openRegister}
       className="btn-glow mt-10 inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-background font-bold tracking-wider rounded hover:bg-primary-dark transition-colors"
      >
       COMEÇAR AGORA
       <ArrowRight className="w-5 h-5" />
      </button>
     </div>
    </section>

    {/* Como Funciona */}
    <section className="py-16 border-y border-secondary bg-surface">
     <div className="max-w-6xl mx-auto px-6 text-center">
      <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4 tracking-wider">COMO FUNCIONA</h2>
      <p className="text-muted-foreground mb-12 max-w-xl mx-auto">3 passos para transformar suas costas com método.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
       <div className="text-left">
        <div className="flex items-center gap-4 mb-3">
         <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-full shrink-0">
          <span className="text-background font-bold text-sm">1</span>
         </div>
         <h3 className="font-display font-bold tracking-wider">ESTUDE OS FUNDAMENTOS</h3>
        </div>
        <p className="text-sm text-muted-foreground font-light leading-relaxed ml-14">
         Leia os capítulos e entenda a mecânica de cada exercício, a lógica do RPE e a progressão do método Mountain Dog.
        </p>
       </div>
       <div className="text-left">
        <div className="flex items-center gap-4 mb-3">
         <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-full shrink-0">
          <span className="text-background font-bold text-sm">2</span>
         </div>
         <h3 className="font-display font-bold tracking-wider">EXECUTE O TREINO</h3>
        </div>
        <p className="text-sm text-muted-foreground font-light leading-relaxed ml-14">
         Siga a planilha dia a dia com RPE, séries, carga e descanso definidos. Sem adivinhação — só executar.
        </p>
       </div>
       <div className="text-left">
        <div className="flex items-center gap-4 mb-3">
         <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-full shrink-0">
          <span className="text-background font-bold text-sm">3</span>
         </div>
         <h3 className="font-display font-bold tracking-wider">ACOMPANHE SEUS DADOS</h3>
        </div>
        <p className="text-sm text-muted-foreground font-light leading-relaxed ml-14">
         Volume, progresso de carga, frequência e PRs. Ajustes baseados em números, não em achismo.
        </p>
       </div>
      </div>
      <button 
       onClick={openRegister}
       className="btn-glow mt-10 inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-background font-bold tracking-wider rounded hover:bg-primary-dark transition-colors"
      >
       QUERO COMEÇAR
       <ArrowRight className="w-5 h-5" />
      </button>
     </div>
    </section>

    {/* Program Preview - Locked */}
    <section className="max-w-6xl mx-auto px-6 py-16">
     <div className="text-center mb-8">
      <h2 className="font-display text-2xl font-bold mb-4 tracking-wider">PROGRAMA — 6 SEMANAS</h2>
      <p className="text-muted-foreground mb-6">Faça login para acessar o conteúdo completo</p>
     </div>

     <div className="space-y-4">
      {weeks.map((week, weekIndex) => (
       <div key={weekIndex} className="border border-border rounded-lg overflow-hidden">
        <div className="bg-surface px-6 py-4 flex items-center justify-between">
         <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/20 flex items-center justify-center rounded">
           <span className="text-primary font-bold text-sm">{weekIndex + 1}</span>
          </div>
          <span className="font-medium">{week.name}</span>
         </div>
          <Lock className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="px-6 py-3 bg-background space-y-2">
         {week.chapters.map((chapter) => (
          <div 
           key={chapter.slug}
            className="flex items-center justify-between text-sm text-muted-foreground py-2 border-b border-card last:border-0"
          >
           <span>{chapter.title}</span>
           <button 
            onClick={openLogin}
            className="text-primary text-xs hover:underline"
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
       className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-background font-bold tracking-wider rounded hover:bg-primary-dark transition-colors"
      >
       CADASTRAR PARA ACESSAR
       <ArrowRight className="w-5 h-5" />
      </button>
     </div>
    </section>

    {/* About Section */}
    <section className="py-16 border-t border-secondary bg-surface">
     <div className="max-w-6xl mx-auto px-6 text-center">
      <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4 tracking-wider">CIÊNCIA, PERFORMANCE E RESULTADO</h2>
      <p className="text-muted-foreground font-light text-lg leading-relaxed mb-6 max-w-3xl mx-auto">
        Back Discipline não é uma rotina de treino. É a síntese de tudo que João Monteiro desenvolveu sobre treinamento de costas — traduzida em um programa que qualquer pessoa comprometida pode executar. Cada capítulo, cada série e cada RPE foi pensado para quem quer resultado real, não apenas motivação.
      </p>
      <div className="flex items-center justify-center gap-3 mb-10 text-primary">
       <GraduationCap className="w-5 h-5" />
        <span className="text-sm tracking-wider font-bold">JOÃO MONTEIRO — EDUCADOR FÍSICO E NUTRICIONISTA</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
       {[
        'EDUCAÇÃO FÍSICA',
        'NUTRIÇÃO',
        'PÓS EM NUTRIÇÃO COMPORTAMENTAL',
       ].map((credential, i) => (
        <div key={i} className="p-4 bg-background border border-border rounded-lg">
         <GraduationCap className="w-5 h-5 text-primary mx-auto mb-2" />
         <span className="text-xs font-bold tracking-wider text-muted-foreground">{credential}</span>
        </div>
       ))}
      </div>
     </div>
    </section>
   </main>

   {/* FAQ */}
   <section className="py-16 border-t border-secondary">
    <div className="max-w-3xl mx-auto px-6">
     <h2 className="font-display text-2xl sm:text-3xl font-bold mb-10 text-center tracking-wider">PERGUNTAS FREQUENTES</h2>
     <div className="space-y-4">
      {[
       { q: 'QUANTO TEMPO LEVA CADA TREINO?', a: 'Entre 45 e 60 minutos. Cada sessão tem séries, repetições e descanso definidos — você sabe exatamente quanto tempo vai gastar.' },
       { q: 'PRECISO DE EQUIPAMENTOS ESPECÍFICOS?', a: 'O programa utiliza exercícios com barra, halteres, cabos e máquinas — equipamento padrão de qualquer academia bem equipada.' },
       { q: 'FUNCIONA PARA INICIANTES?', a: 'Sim. Cada exercício vem com explicação detalhada e vídeo demonstrativo. O RPE guia a intensidade no seu nível atual.' },
       { q: 'NÃO TENHO TEMPO PARA TREINAR 6 DIAS POR SEMANA.', a: 'O programa é flexível. Siga os dias que sua rotina permite — a estrutura progressiva se adapta à sua frequência real.' },
       { q: 'JÁ TENTEI PROGRAMAS DE COSTAS ANTES E NÃO FUNCIONOU.', a: 'Exatamente por isso o Back Discipline existe. Não é uma coleção de exercícios — é um sistema progressivo com método, métricas e ajustes.' },
      ].map((faq, i) => (
       <details key={i} className="group bg-surface border border-border rounded-lg overflow-hidden">
        <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-bold tracking-wider hover:text-primary transition-colors list-none">
         {faq.q}
         <ChevronDown className="w-4 h-4 text-muted-foreground group-open:rotate-180 transition-transform shrink-0" />
        </summary>
        <div className="px-5 pb-4 text-sm text-muted-foreground font-light leading-relaxed border-t border-border pt-3">
         {faq.a}
        </div>
       </details>
      ))}
     </div>
    </div>
   </section>

   {/* Footer */}
   <footer className="border-t border-secondary py-8">
    <div className="max-w-6xl mx-auto px-6 text-center text-muted-foreground text-sm font-light tracking-wider">
      <p>JOÃO MONTEIRO · BACK DISCIPLINE · PROGRAMA DESENVOLVIDO COM BASE ACADÊMICA E EXPERIÊNCIA PRÁTICA</p>
    </div>
   </footer>
  </div>
 );
}